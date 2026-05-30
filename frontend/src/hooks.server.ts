import { i18n } from '$lib/i18n';
import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';
import { getAuthenticatedAdminSession } from '$lib/server/admin-session';

const langHandle: Handle = async ({ event, resolve }) => {
  const cookie = event.cookies.get('crianex_lang');
  event.locals.lang = cookie === 'en' ? 'en' : 'pt';
  return resolve(event);
};

const adminAuthHandle: Handle = async ({ event, resolve }) => {
  const pathname = event.url.pathname;

  // Public admin paths that don't require redirect
  const publicAdminPaths = ['/admin/login', '/admin/login/callback', '/admin/logout'];

  if (!pathname.startsWith('/admin')) {
    return resolve(event);
  }

  // If user is trying to access login routes but already authenticated, redirect to /admin
  const session = await getAuthenticatedAdminSession(event.cookies);

  if (publicAdminPaths.includes(pathname)) {
    if (session) {
      event.locals.adminUser = session.user;
      return new Response(null, { status: 303, headers: { location: '/admin' } });
    }
    // allow rendering login pages
    return resolve(event);
  }

  // Protected admin route: require authentication
  if (!session) {
    return new Response(null, { status: 303, headers: { location: '/admin/login' } });
  }

  event.locals.adminUser = session.user;
  return resolve(event);
};

export const handle = sequence(langHandle, adminAuthHandle, i18n.handle());
