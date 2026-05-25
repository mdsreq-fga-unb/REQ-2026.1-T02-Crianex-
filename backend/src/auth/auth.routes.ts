import { Router, type Request, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import { getSupabaseClient } from '../config/supabase.js';
import { loginWithEmailAndPassword, loadAdminProfile, parseCookieHeader, refreshWithRefreshToken, revokeSession } from './auth.service.js';
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
  sameSite: 'lax' as const,
  secure: process.env['NODE_ENV'] === 'production',
  path: '/',
};

function setAuthCookies(response: Response, accessToken: string, refreshToken: string, expiresIn: number): void {
  response.cookie(ACCESS_TOKEN_COOKIE, accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: Math.max(expiresIn, 1) * 1000,
  });

  response.cookie(REFRESH_TOKEN_COOKIE, refreshToken, COOKIE_OPTIONS);
}

function clearAuthCookies(response: Response): void {
  response.clearCookie(ACCESS_TOKEN_COOKIE, COOKIE_OPTIONS);
  response.clearCookie(REFRESH_TOKEN_COOKIE, COOKIE_OPTIONS);
}

function getRefreshTokenFromRequest(request: Request): string | null {
  const bodyRefreshToken = typeof request.body?.['refreshToken'] === 'string' ? request.body['refreshToken'] : '';

  if (bodyRefreshToken) {
    return bodyRefreshToken;
  }

  const cookies = parseCookieHeader(request.headers.cookie);

  return cookies[REFRESH_TOKEN_COOKIE] ?? null;
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

    setAuthCookies(response, session.access_token, session.refresh_token, session.expires_in);
    response.status(200).json({
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
      user,
    });
  } catch {
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
  } catch {
    response.status(401).json({ message: 'Sessão inválida' });
  }
});

authRouter.post('/logout', validateJWT, async (request, response) => {
  const authContext = (response.locals as { auth?: { accessToken: string } }).auth;

  if (!authContext) {
    response.status(401).json({ message: 'Token ausente ou inválido' });
    return;
  }

  try {
    await revokeSession(getSupabaseClient(), authContext.accessToken);
    clearAuthCookies(response);
    response.status(204).send();
  } catch {
    response.status(500).json({ message: 'Falha ao encerrar a sessão' });
  }
});