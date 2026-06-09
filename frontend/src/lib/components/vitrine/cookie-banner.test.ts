import { describe, it, expect } from 'vitest';
import { CONSENT_KEY, cookieI18n, getConsent, setConsent } from './cookie-banner';

describe('cookieI18n', () => {
  it.each(['pt', 'en'] as const)(
    '%s tem messagePre, linkText, accept e reject não-vazios',
    (locale) => {
      const c = cookieI18n[locale];
      expect(c.messagePre).toBeTruthy();
      expect(c.linkText).toBeTruthy();
      expect(c.accept).toBeTruthy();
      expect(c.reject).toBeTruthy();
    }
  );

  it('pt e en têm textos de botão distintos', () => {
    expect(cookieI18n.pt.accept).not.toBe(cookieI18n.en.accept);
    expect(cookieI18n.pt.reject).not.toBe(cookieI18n.en.reject);
  });

  it('messagePre são strings não-vazias com pelo menos 10 chars', () => {
    expect(cookieI18n.pt.messagePre.length).toBeGreaterThan(10);
    expect(cookieI18n.en.messagePre.length).toBeGreaterThan(10);
  });
});

describe('getConsent', () => {
  it('retorna null quando storage não tem a chave', () => {
    expect(getConsent({ getItem: () => null })).toBeNull();
  });

  it('retorna "accepted" quando valor é "accepted"', () => {
    expect(getConsent({ getItem: () => 'accepted' })).toBe('accepted');
  });

  it('retorna "rejected" quando valor é "rejected"', () => {
    expect(getConsent({ getItem: () => 'rejected' })).toBe('rejected');
  });

  it('retorna null para valor inválido', () => {
    expect(getConsent({ getItem: () => 'yes' })).toBeNull();
  });

  it('retorna null quando storage é null (SSR)', () => {
    expect(getConsent(null)).toBeNull();
  });
});

describe('setConsent', () => {
  it('grava CONSENT_KEY com valor "accepted"', () => {
    const store: Record<string, string> = {};
    setConsent(
      {
        setItem: (k, v) => {
          store[k] = v;
        },
      },
      'accepted'
    );
    expect(store[CONSENT_KEY]).toBe('accepted');
  });

  it('grava CONSENT_KEY com valor "rejected"', () => {
    const store: Record<string, string> = {};
    setConsent(
      {
        setItem: (k, v) => {
          store[k] = v;
        },
      },
      'rejected'
    );
    expect(store[CONSENT_KEY]).toBe('rejected');
  });

  it('não lança quando storage é null (SSR)', () => {
    expect(() => setConsent(null, 'accepted')).not.toThrow();
  });
});

describe('fluxo completo: set → get', () => {
  it('getConsent lê o que setConsent gravou', () => {
    const store: Record<string, string> = {};
    const storage = {
      getItem: (k: string) => store[k] ?? null,
      setItem: (k: string, v: string) => {
        store[k] = v;
      },
    };

    expect(getConsent(storage)).toBeNull();
    setConsent(storage, 'accepted');
    expect(getConsent(storage)).toBe('accepted');
  });
});
