import ptCookies from '../../i18n/pt/cookies.json';
import enCookies from '../../i18n/en/cookies.json';

export type CookieConsent = 'accepted' | 'rejected';

export type CookieI18n = {
  messagePre: string;
  linkText: string;
  messagePost: string;
  accept: string;
  reject: string;
};

export const CONSENT_KEY = 'cookie_consent';

export const cookieI18n: Record<'pt' | 'en', CookieI18n> = {
  pt: ptCookies,
  en: enCookies,
};

export function getConsent(storage: Pick<Storage, 'getItem'> | null): CookieConsent | null {
  const v = storage?.getItem(CONSENT_KEY);
  if (v === 'accepted' || v === 'rejected') return v as CookieConsent;
  return null;
}

export function setConsent(storage: Pick<Storage, 'setItem'> | null, value: CookieConsent): void {
  storage?.setItem(CONSENT_KEY, value);
}
