import { Router, type Request, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import { getSupabaseClient } from '../config/supabase.js';
import {
  challengeAndVerifyTotp,
  enrollTotpFactor,
  getTotpFactorStatus,
  getVerifiedTotpFactorId,
  loginWithEmailAndPassword,
  loadAdminProfile,
  parseCookieHeader,
  refreshWithRefreshToken,
  revokeSession,
} from './auth.service.js';
import { validateJWT } from '../middleware/validate-jwt.js';

const authRateLimiter = rateLimit({
  windowMs: 60_000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too Many Requests' },
});

const ACCESS_TOKEN_COOKIE = 'access_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';
const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'strict' as const,
  secure: process.env['NODE_ENV'] === 'production',
  path: '/',
};

const REFRESH_TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function setAuthCookies(
  response: Response,
  accessToken: string,
  refreshToken: string,
  expiresIn: number
): void {
  response.cookie(ACCESS_TOKEN_COOKIE, accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: Math.max(expiresIn, 1) * 1000,
  });

  response.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: REFRESH_TOKEN_MAX_AGE_MS,
  });
}

function clearAuthCookies(response: Response): void {
  response.clearCookie(ACCESS_TOKEN_COOKIE, COOKIE_OPTIONS);
  response.clearCookie(REFRESH_TOKEN_COOKIE, COOKIE_OPTIONS);
}

function getRefreshTokenFromRequest(request: Request): string | null {
  const bodyRefreshToken =
    typeof request.body?.['refreshToken'] === 'string' ? request.body['refreshToken'] : '';

  if (bodyRefreshToken) {
    return bodyRefreshToken;
  }

  const cookies = parseCookieHeader(request.headers.cookie);

  return cookies[REFRESH_TOKEN_COOKIE] ?? null;
}

function getAccessTokenFromBody(request: Request): string {
  return typeof request.body?.['accessToken'] === 'string'
    ? request.body['accessToken'].trim()
    : '';
}

function getCodeFromBody(request: Request): string {
  return typeof request.body?.['code'] === 'string' ? request.body['code'].trim() : '';
}

function getFactorIdFromBody(request: Request): string {
  return typeof request.body?.['factorId'] === 'string' ? request.body['factorId'].trim() : '';
}

function getFriendlyNameFromBody(request: Request): string {
  return typeof request.body?.['friendlyName'] === 'string'
    ? request.body['friendlyName'].trim()
    : '';
}

export const authRouter = Router();

authRouter.use(authRateLimiter);

authRouter.post('/login', async (request, response) => {
  const email = typeof request.body?.['email'] === 'string' ? request.body['email'].trim() : '';
  const password = typeof request.body?.['password'] === 'string' ? request.body['password'] : '';

  if (!email || !password) {
    response.status(400).json({ message: 'Email e senha são obrigatórios' });
    return;
  }

  try {
    const session = await loginWithEmailAndPassword(email, password);
    const supabase = getSupabaseClient();
    const user = await loadAdminProfile(
      supabase,
      session.user.id,
      session.user.email,
      session.user.user_metadata
    );

    const factorId = await getVerifiedTotpFactorId(session.access_token);

    if (factorId) {
      response.status(200).json({
        mfa_required: true,
        accessToken: session.access_token,
        refreshToken: session.refresh_token,
        expiresIn: session.expires_in,
        factorId,
        user,
      });
      return;
    }

    setAuthCookies(response, session.access_token, session.refresh_token, session.expires_in);
    response.status(200).json({
      mfa_required: false,
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
      expiresIn: session.expires_in,
      user,
    });
  } catch (err) {
    console.error('[auth] login error:', err);
    response.status(401).json({ message: 'Credenciais inválidas' });
  }
});

authRouter.post('/refresh', async (request, response) => {
  const refreshToken = getRefreshTokenFromRequest(request);

  if (!refreshToken) {
    response.status(401).json({ message: 'Sessão inválida' });
    return;
  }

  try {
    const session = await refreshWithRefreshToken(refreshToken);
    const supabase = getSupabaseClient();
    const user = await loadAdminProfile(
      supabase,
      session.user.id,
      session.user.email,
      session.user.user_metadata
    );

    setAuthCookies(response, session.access_token, session.refresh_token, session.expires_in);
    response.status(200).json({
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
      user,
    });
  } catch (err) {
    console.error('[auth] refresh error:', err);
    response.status(401).json({ message: 'Sessão inválida' });
  }
});

authRouter.post('/mfa/verify', async (request, response) => {
  const accessToken = getAccessTokenFromBody(request);
  const code = getCodeFromBody(request);

  if (!accessToken || !code) {
    response.status(400).json({ message: 'Código TOTP e token temporário são obrigatórios' });
    return;
  }

  try {
    const session = await challengeAndVerifyTotp(accessToken, code);

    setAuthCookies(response, session.accessToken, session.refreshToken, session.expiresIn);
    response.status(200).json({
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      user: session.user,
    });
  } catch (err) {
    console.error('[auth] mfa verify error:', err);
    const reason =
      err instanceof Error && 'reason' in err ? (err as { reason?: string }).reason : null;

    response.status(400).json({
      message: reason === 'expired' ? 'Código TOTP expirado' : 'Código TOTP inválido',
      reason: reason === 'expired' ? 'expired' : 'invalid',
    });
  }
});

authRouter.get('/mfa/status', validateJWT, async (_request, response) => {
  const authContext = (response.locals as { auth: { accessToken: string } }).auth;

  try {
    const status = await getTotpFactorStatus(authContext.accessToken);

    response.status(200).json(status);
  } catch (err) {
    console.error('[auth] mfa status error:', err);
    response.status(500).json({ message: 'Não foi possível consultar o status do MFA' });
  }
});

authRouter.post('/mfa/enroll', validateJWT, async (request, response) => {
  const authContext = (response.locals as { auth: { accessToken: string; user: { name: string } } })
    .auth;
  const friendlyName = getFriendlyNameFromBody(request) || authContext.user.name || 'Crianex Admin';

  try {
    const status = await getTotpFactorStatus(authContext.accessToken);

    if (status.hasVerifiedFactor) {
      response.status(409).json({ message: 'Este usuário já possui um TOTP ativo' });
      return;
    }

    const enrollment = await enrollTotpFactor(authContext.accessToken, friendlyName);

    response.status(200).json(enrollment);
  } catch (err) {
    console.error('[auth] mfa enroll error:', err);
    response.status(400).json({ message: 'Não foi possível iniciar o cadastro do TOTP' });
  }
});

authRouter.post('/mfa/enroll/verify', validateJWT, async (request, response) => {
  const authContext = (response.locals as { auth: { accessToken: string } }).auth;
  const code = getCodeFromBody(request);
  const factorId = getFactorIdFromBody(request);

  if (!code || !factorId) {
    response.status(400).json({ message: 'Código TOTP e fator são obrigatórios' });
    return;
  }

  try {
    const session = await challengeAndVerifyTotp(authContext.accessToken, code, factorId);

    setAuthCookies(response, session.accessToken, session.refreshToken, session.expiresIn);
    response.status(201).json({
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      user: session.user,
    });
  } catch (err) {
    console.error('[auth] mfa enroll verify error:', err);
    const reason =
      err instanceof Error && 'reason' in err ? (err as { reason?: string }).reason : null;

    response.status(400).json({
      message: reason === 'expired' ? 'Código TOTP expirado' : 'Código TOTP inválido',
      reason: reason === 'expired' ? 'expired' : 'invalid',
    });
  }
});

authRouter.post('/logout', validateJWT, async (_request, response) => {
  const authContext = (response.locals as { auth: { accessToken: string } }).auth;

  try {
    await revokeSession(getSupabaseClient(), authContext.accessToken);
    clearAuthCookies(response);
    response.status(204).send();
  } catch (err) {
    console.error('[auth] logout error:', err);
    response.status(500).json({ message: 'Falha ao encerrar a sessão' });
  }
});
