import { env } from '$env/dynamic/public';
import { ApiError } from '$lib/api/backend';
import { authorizeAdminSession, type AdminSessionUser } from '$lib/api/admin-auth';
import type { Cookies } from '@sveltejs/kit';

export const ADMIN_ACCESS_TOKEN_COOKIE = 'crianex_admin_access_token';
export const ADMIN_REFRESH_TOKEN_COOKIE = 'crianex_admin_refresh_token';

const ACCESS_TOKEN_MAX_AGE_BUFFER_SECONDS = 60;
const REFRESH_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export type AdminSessionTokens = {
  accessToken: string;
  refreshToken: string;
  expiresAt?: number | null;
};

export type AdminSessionCookieState = {
  accessToken?: string;
  refreshToken?: string;
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

  if (!accessToken && !refreshToken) {
    return null;
  }

  return {
    accessToken,
    refreshToken,
  };
}

export function setAdminSessionCookies(cookies: Cookies, session: AdminSessionTokens): void {
  const secure = process.env.NODE_ENV === 'production';
  const maxAge = session.expiresAt
    ? Math.max(session.expiresAt - Math.floor(Date.now() / 1000) - ACCESS_TOKEN_MAX_AGE_BUFFER_SECONDS, 60)
    : 60 * 60;

  cookies.set(ADMIN_ACCESS_TOKEN_COOKIE, session.accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure,
    path: '/',
    maxAge,
  });

  cookies.set(ADMIN_REFRESH_TOKEN_COOKIE, session.refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure,
    path: '/',
    maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS,
  });
}

export function clearAdminSessionCookies(cookies: Cookies): void {
  cookies.delete(ADMIN_ACCESS_TOKEN_COOKIE, { path: '/' });
  cookies.delete(ADMIN_REFRESH_TOKEN_COOKIE, { path: '/' });
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
    const payload = (await response.json().catch(() => null)) as { msg?: string; error_description?: string } | null;

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

  if (session.accessToken) {
    try {
      const user = await validateAdminSession(session.accessToken);
      return {
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        user,
      };
    } catch {
      // Se o access token falhou, tenta renovar com o refresh token.
    }
  }

  try {
    const refreshedSession = await refreshAdminSession(session.refreshToken);
    const user = await validateAdminSession(refreshedSession.accessToken);

    setAdminSessionCookies(cookies, refreshedSession);

    return {
      ...refreshedSession,
      user,
    };
  } catch {
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