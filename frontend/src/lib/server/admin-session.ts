import { env } from '$env/dynamic/public';
import { ApiError } from '$lib/api/backend';
import { authorizeAdminSession, type AdminSessionUser } from '$lib/api/admin-auth';
import type { Cookies } from '@sveltejs/kit';

export const ADMIN_ACCESS_TOKEN_COOKIE = 'crianex_admin_access_token';
export const ADMIN_REFRESH_TOKEN_COOKIE = 'crianex_admin_refresh_token';
export const ADMIN_SESSION_EXPIRES_COOKIE = 'crianex_admin_session_expires';

const ACCESS_TOKEN_MAX_AGE_BUFFER_SECONDS = 60;
const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60; // 8 horas — expiração absoluta desde o login

export type AdminSessionTokens = {
  accessToken: string;
  refreshToken: string;
  expiresAt?: number | null;
  sessionExpiresAt?: number | null; // expiração absoluta da sessão (definida no login, nunca renovada)
};

export type AdminSessionCookieState = {
  accessToken?: string;
  refreshToken?: string;
  sessionExpiresAt?: number | null;
};

export type AuthenticatedAdminSession = AdminSessionTokens & {
  user: AdminSessionUser;
};

type RefreshSessionResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
};

export function readAdminSessionCookies(cookies: Cookies): AdminSessionCookieState | null {
  const accessToken = cookies.get(ADMIN_ACCESS_TOKEN_COOKIE);
  const refreshToken = cookies.get(ADMIN_REFRESH_TOKEN_COOKIE);
  const sessionExpiresAtRaw = cookies.get(ADMIN_SESSION_EXPIRES_COOKIE);

  if (!accessToken && !refreshToken) {
    return null;
  }

  const sessionExpiresAt = sessionExpiresAtRaw ? parseInt(sessionExpiresAtRaw, 10) : null;

  return { accessToken, refreshToken, sessionExpiresAt };
}

export function setAdminSessionCookies(cookies: Cookies, session: AdminSessionTokens): void {
  const secure = process.env.NODE_ENV === 'production';
  const now = Math.floor(Date.now() / 1000);

  const accessMaxAge = session.expiresAt
    ? Math.max(session.expiresAt - now - ACCESS_TOKEN_MAX_AGE_BUFFER_SECONDS, 60)
    : 60 * 60;

  // Expiração absoluta da sessão: usa o valor existente do login ou define uma janela de 8h
  const sessionExpiresAt = session.sessionExpiresAt ?? now + SESSION_MAX_AGE_SECONDS;
  const refreshMaxAge = Math.max(sessionExpiresAt - now, 1);

  cookies.set(ADMIN_ACCESS_TOKEN_COOKIE, session.accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure,
    path: '/',
    maxAge: accessMaxAge,
  });

  cookies.set(ADMIN_REFRESH_TOKEN_COOKIE, session.refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure,
    path: '/',
    maxAge: refreshMaxAge,
  });

  cookies.set(ADMIN_SESSION_EXPIRES_COOKIE, String(sessionExpiresAt), {
    httpOnly: true,
    sameSite: 'lax',
    secure,
    path: '/',
    maxAge: refreshMaxAge,
  });
}

export function clearAdminSessionCookies(cookies: Cookies): void {
  cookies.delete(ADMIN_ACCESS_TOKEN_COOKIE, { path: '/' });
  cookies.delete(ADMIN_REFRESH_TOKEN_COOKIE, { path: '/' });
  cookies.delete(ADMIN_SESSION_EXPIRES_COOKIE, { path: '/' });
}

export async function validateAdminSession(accessToken: string): Promise<AdminSessionUser> {
  return authorizeAdminSession(accessToken);
}

export async function refreshAdminSession(refreshToken: string): Promise<AdminSessionTokens> {
  const supabaseUrl = env.PUBLIC_SUPABASE_URL;
  const publishableKey = env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !publishableKey) {
    throw new Error('Supabase não configurado para renovar a sessão do admin.');
  }

  const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=refresh_token`, {
    method: 'POST',
    headers: {
      apikey: publishableKey,
      authorization: `Bearer ${publishableKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      msg?: string;
      error_description?: string;
    } | null;

    throw new ApiError(
      payload?.msg ?? payload?.error_description ?? 'Não foi possível renovar a sessão do admin.',
      response.status
    );
  }

  const payload = (await response.json()) as RefreshSessionResponse;

  return {
    accessToken: payload.access_token,
    refreshToken: payload.refresh_token,
    expiresAt: Math.floor(Date.now() / 1000) + payload.expires_in,
  };
}

export async function getAuthenticatedAdminSession(
  cookies: Cookies
): Promise<AuthenticatedAdminSession | null> {
  const session = readAdminSessionCookies(cookies);

  if (!session?.refreshToken) {
    return null;
  }

  const now = Math.floor(Date.now() / 1000);
  if (session.sessionExpiresAt && session.sessionExpiresAt <= now) {
    console.log('[admin-session] sessão expirada absolutamente, limpando cookies');
    clearAdminSessionCookies(cookies);
    return null;
  }

  if (session.accessToken) {
    try {
      const user = await validateAdminSession(session.accessToken);
      return {
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        user,
      };
    } catch {
      // access token expired/invalid — fall through to refresh
    }
  }

  try {
    const refreshedSession = await refreshAdminSession(session.refreshToken);
    const user = await validateAdminSession(refreshedSession.accessToken);

    setAdminSessionCookies(cookies, {
      ...refreshedSession,
      sessionExpiresAt: session.sessionExpiresAt,
    });

    return { ...refreshedSession, user };
  } catch (err) {
    console.error('[admin-session] refresh falhou, limpando cookies:', err);
    clearAdminSessionCookies(cookies);
    return null;
  }
}

export async function revokeAdminSession(accessToken: string): Promise<void> {
  const supabaseUrl = env.PUBLIC_SUPABASE_URL;
  const publishableKey = env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !publishableKey) {
    return;
  }

  await fetch(`${supabaseUrl}/auth/v1/logout?scope=global`, {
    method: 'POST',
    headers: {
      apikey: publishableKey,
      authorization: `Bearer ${accessToken}`,
    },
  }).catch(() => undefined);
}
