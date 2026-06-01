import { describe, it, expect } from 'vitest';
import { aboutContent, REQUIRED_KEYS } from './about';

describe('about i18n content', () => {
  it('exposes both pt and en locales', () => {
    expect(aboutContent.pt).toBeTruthy();
    expect(aboutContent.en).toBeTruthy();
  });

  for (const locale of ['pt', 'en'] as const) {
    describe(`${locale} locale`, () => {
      const c = aboutContent[locale];

      it('has all required top-level keys', () => {
        for (const key of REQUIRED_KEYS) {
          expect(c, `missing ${key}`).toHaveProperty(key);
        }
      });

      it('has exactly 3 values, each with n/title/body', () => {
        expect(c.values).toHaveLength(3);
        for (const v of c.values) {
          expect(v.n).toBeTruthy();
          expect(v.title).toBeTruthy();
          expect(v.body).toBeTruthy();
        }
      });

      it('has exactly 4 stats, each with label/value', () => {
        expect(c.stats).toHaveLength(4);
        for (const s of c.stats) {
          expect(s.label).toBeTruthy();
          expect(s.value).toBeTruthy();
        }
      });

      it('has hero copy (eyebrow, h1, lede)', () => {
        expect(c.eyebrow).toBeTruthy();
        expect(c.h1).toBeTruthy();
        expect(c.lede).toBeTruthy();
      });

      it('has cta block with title, body and label', () => {
        expect(c.cta.title).toBeTruthy();
        expect(c.cta.body).toBeTruthy();
        expect(c.cta.emailLabel).toBeTruthy();
      });

      it('has SEO title following "Sobre/About a Crianex | Crianex Hub" pattern', () => {
        expect(c.seo.title).toMatch(/Crianex Hub/);
        expect(c.seo.ogTitle).toMatch(/Crianex Hub/);
      });
    });
  }

  it('pt and en have distinct copy for the hero h1', () => {
    expect(aboutContent.pt.h1).not.toBe(aboutContent.en.h1);
  });
});
