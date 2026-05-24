import { i18n } from '$lib/i18n';
import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';

const langHandle: Handle = async ({ event, resolve }) => {
  const cookie = event.cookies.get('crianex_lang');
  event.locals.lang = cookie === 'en' ? 'en' : 'pt';
  return resolve(event);
};

export const handle = sequence(langHandle, i18n.handle());
