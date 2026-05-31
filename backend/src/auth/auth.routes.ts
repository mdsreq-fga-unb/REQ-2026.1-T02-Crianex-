import { Router, type Request, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import { getSupabaseClient } from '../config/supabase.js';
import {
  loginWithEmailAndPassword,
  loadAdminProfile,
  parseCookieHeader,
  refreshWithRefreshToken,
  revokeSession,
  validateAccessToken,
} from './auth.service.js';
import { validateJWT } from '../middleware/validate-jwt.js';
import { requireRole } from '../middleware/require-role.js';

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

const ALLOWED_PROFILE_STATUSES = new Set(['active', 'inactive']);

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

function getAccessTokenFromRequest(request: Request): string | null {
  const authorizationHeader = request.headers.authorization ?? null;

  if (authorizationHeader) {
    const [scheme, token] = authorizationHeader.split(' ');

    if (scheme?.toLowerCase() === 'bearer' && token) {
      return token.trim() || null;
    }
  }

  return typeof request.body?.['accessToken'] === 'string' ? request.body['accessToken'] : null;
}

function normalizeProfileStatus(status: string | null | undefined): string {
  return status?.trim().toLowerCase() || '';
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
  } catch (err) {
    console.error('[auth] login error:', err);
    response.status(401).json({ message: 'Credenciais inválidas' });
  }
});

authRouter.post('/session', async (request, response) => {
  const accessToken = getAccessTokenFromRequest(request);

  if (!accessToken) {
    response.status(401).json({ message: 'Sessão inválida' });
    return;
  }

  try {
    const user = await validateAccessToken(getSupabaseClient(), accessToken);
    response.status(200).json({ user });
  } catch (err) {
    const status =
      typeof err === 'object' && err !== null && 'status' in err
        ? Number((err as { status?: number }).status ?? 401)
        : 401;
    const message = err instanceof Error ? err.message : 'Sessão inválida';

    console.error('[auth] session validation error:', err);
    response.status(status).json({ message });
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

authRouter.patch('/profiles/:id/status', validateJWT, requireRole('owner'), async (request, response) => {
  const authContext = (
    response.locals as {
      auth: { user: { id: string; role: string } };
    }
  ).auth;

  const targetProfileId =
    typeof request.params?.['id'] === 'string' ? request.params['id'].trim() : '';
  const status = normalizeProfileStatus(
    typeof request.body?.['status'] === 'string' ? request.body['status'] : null
  );

  if (!targetProfileId) {
    response.status(400).json({ message: 'Profile id é obrigatório' });
    return;
  }

  if (!ALLOWED_PROFILE_STATUSES.has(status)) {
    response.status(400).json({ message: 'Status inválido' });
    return;
  }

  if (status === 'inactive' && targetProfileId === authContext.user.id) {
    response.status(400).json({ message: 'Owner não pode desativar a própria conta' });
    return;
  }

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('profiles')
      .update({ status })
      .eq('id', targetProfileId)
      .select('id,name,role,email,status')
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      response.status(404).json({ message: 'Profile não encontrado' });
      return;
    }

    response.status(200).json({ profile: data });
  } catch (err) {
    console.error('[auth] profile status update error:', err);
    response.status(500).json({ message: 'Falha ao atualizar o status do profile' });
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
