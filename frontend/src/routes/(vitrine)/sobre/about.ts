import ptAbout from '../../../lib/i18n/pt/about.json';
import enAbout from '../../../lib/i18n/en/about.json';

export type AboutValue = { n: string; title: string; body: string };
export type AboutStat = { value: string; label: string };

export type AboutContent = {
  eyebrow: string;
  h1: string;
  lede: string;
  heroBadge: string;
  heroH1: string;
  heroSub: string;
  heroCta: string;
  heroCtaEmail: string;
  missionEyebrow: string;
  missionTitle: string;
  missionDesc: string;
  values: AboutValue[];
  numbersEyebrow: string;
  numbersTitle: string;
  numbersDesc: string;
  stats: AboutStat[];
  cta: {
    title: string;
    body: string;
    emailLabel: string;
  };
  seo: { title: string; ogTitle: string };
};

export const aboutContent: Record<'pt' | 'en', AboutContent> = {
  pt: ptAbout as AboutContent,
  en: enAbout as AboutContent,
};

export const REQUIRED_KEYS = [
  'eyebrow',
  'h1',
  'lede',
  'missionEyebrow',
  'missionTitle',
  'values',
  'stats',
  'cta',
] as const;
