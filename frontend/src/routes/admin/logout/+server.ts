import { redirect, type Cookies, type RequestHandler } from '@sveltejs/kit';
import {
  clearAdminSessionCookies,
  readAdminSessionCookies,
  revokeAdminSession,
} from '$lib/server/admin-session';

async function handleLogout(cookies: Cookies): Promise<never> {
  const session = readAdminSessionCookies(cookies);

  if (session?.accessToken) {
    await revokeAdminSession(session.accessToken);
  }

  clearAdminSessionCookies(cookies);
  throw redirect(303, '/admin/login');
}

export const GET: RequestHandler = async ({ cookies }) => handleLogout(cookies);

export const POST: RequestHandler = async ({ cookies }) => handleLogout(cookies);
