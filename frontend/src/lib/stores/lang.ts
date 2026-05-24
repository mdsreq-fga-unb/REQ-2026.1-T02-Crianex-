import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export type AvailableLang = 'pt' | 'en';
const LANG_KEY = 'crianex_lang';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 ano

function createLangStore() {
  const initial: AvailableLang = browser
    ? ((localStorage.getItem(LANG_KEY) as AvailableLang) ?? 'pt')
    : 'pt';

  const { subscribe, set } = writable<AvailableLang>(initial);

  return {
    subscribe,
    set(tag: AvailableLang) {
      if (browser) {
        localStorage.setItem(LANG_KEY, tag);
        // Cookie para SSR ler na próxima requisição e alinhar o idioma inicial
        document.cookie = `${LANG_KEY}=${tag}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
      }
      set(tag);
    },
    // Sincroniza o store com o valor vindo do servidor (sem side-effects)
    init(tag: AvailableLang) {
      set(tag);
    },
  };
}

export const lang = createLangStore();
