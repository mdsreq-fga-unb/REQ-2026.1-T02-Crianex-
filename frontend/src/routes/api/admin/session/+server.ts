import { json, type RequestHandler } from '@sveltejs/kit';
import {
  clearAdminSessionCookies,
  setAdminSessionCookies,
  validateAdminSession,
} from '$lib/server/admin-session';

export const POST: RequestHandler = async ({ cookies, request }) => {
  const payload = (await request.json().catch(() => null)) as {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number | null;
  } | null;

  if (!payload?.accessToken || !payload?.refreshToken) {
    clearAdminSessionCookies(cookies);
    return json({ message: 'Sessão inválida.' }, { status: 400 });
  }

  try {
    const user = await validateAdminSession(payload.accessToken);

    setAdminSessionCookies(cookies, {
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
      expiresAt: payload.expiresAt,
    });

    return json({ user });
  } catch (error) {
    clearAdminSessionCookies(cookies);

    if (error instanceof Error) {
      return json({ message: error.message }, { status: 403 });
    }

    return json({ message: 'Não foi possível validar a sessão do admin.' }, { status: 500 });
  }
};
