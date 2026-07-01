import { i18n } from '$lib/i18n';
import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';
import { getAuthenticatedAdminSession } from '$lib/server/admin-session';

const langHandle: Handle = async ({ event, resolve }) => {
  const cookie = event.cookies.get('crianex_lang');
  event.locals.lang = cookie === 'en' ? 'en' : 'pt';
  return resolve(event);
};

// Content-Security-Policy: 'unsafe-inline' is kept for script/style because the
// app relies on SvelteKit's inline hydration bootstrap and heavy inline style
// attributes; the policy still hardens the high-risk vectors (clickjacking via
// frame-ancestors, <base> injection, plugin/object embedding, form hijacking).
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https:",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  'upgrade-insecure-requests',
].join('; ');

const securityHeadersHandle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);

  // Skipped only under `vite dev` (NODE_ENV=development) so the HMR websocket and
  // inline dev scripts aren't blocked. A runtime env check is used instead of the
  // build-time `dev` constant, which Vite was constant-folding away in the bundle.
  if (process.env.NODE_ENV !== 'development') {
    response.headers.set('Content-Security-Policy', CSP);
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  return response;
};

const adminAuthHandle: Handle = async ({ event, resolve }) => {
  const pathname = event.url.pathname;

  // Public admin paths that don't require redirect
  const publicAdminPaths = [
    '/admin/login',
    '/admin/login/callback',
    '/admin/login/esqueci-senha',
    '/admin/login/redefinir-senha',
    '/admin/logout',
  ];

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

export const handle = sequence(securityHeadersHandle, langHandle, adminAuthHandle, i18n.handle());
