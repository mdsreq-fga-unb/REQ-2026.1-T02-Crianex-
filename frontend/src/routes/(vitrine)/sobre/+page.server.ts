import type { ServerLoad as PageServerLoad } from '@sveltejs/kit';
import { aboutContent } from './about';

export const prerender = false;

export const load: PageServerLoad = ({ locals }) => {
  const lang = locals.lang === 'en' ? 'en' : 'pt';
  return {
    aboutContent,
    initialLang: lang,
  };
};
