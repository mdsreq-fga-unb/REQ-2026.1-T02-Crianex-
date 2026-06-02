import { describe, it, expect } from 'vitest';
import { t, differentiators, accentForIndex, resolveField, ACCENT_COLORS } from './home';

describe('t — strings i18n da home', () => {
  const bilingualKeys = Object.keys(t).filter((k) => k !== 'h1Parts') as (keyof typeof t)[];

  it.each(bilingualKeys)('"%s" tem pt e en não-vazios', (key) => {
    const entry = t[key] as { pt: string; en: string };
    expect(entry.pt).toBeTruthy();
    expect(entry.en).toBeTruthy();
  });

  it('h1Parts tem 3 partes para pt e en', () => {
    expect(t.h1Parts.pt).toHaveLength(3);
    expect(t.h1Parts.en).toHaveLength(3);
    for (const part of [...t.h1Parts.pt, ...t.h1Parts.en]) {
      expect(part).toBeTruthy();
    }
  });
});

describe('differentiators', () => {
  it('tem exatamente 4 itens', () => {
    expect(differentiators).toHaveLength(4);
  });

  it('ticks são 01 a 04', () => {
    expect(differentiators.map((d) => d.tick)).toEqual(['01', '02', '03', '04']);
  });

  it('cada item tem title e desc em pt e en', () => {
    for (const d of differentiators) {
      expect(d.title.pt).toBeTruthy();
      expect(d.title.en).toBeTruthy();
      expect(d.desc.pt).toBeTruthy();
      expect(d.desc.en).toBeTruthy();
    }
  });
});

describe('accentForIndex', () => {
  it('retorna a primeira cor para index 0', () => {
    expect(accentForIndex(0)).toBe(ACCENT_COLORS[0]);
  });

  it('cicla corretamente', () => {
    expect(accentForIndex(ACCENT_COLORS.length)).toBe(ACCENT_COLORS[0]);
  });

  it('retorna string de cor válida (#hex)', () => {
    for (let i = 0; i < 6; i++) {
      expect(accentForIndex(i)).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });
});

describe('resolveField', () => {
  it('retorna pt quando lang=pt', () => {
    expect(resolveField('Português', 'English', 'pt')).toBe('Português');
  });

  it('retorna en quando lang=en', () => {
    expect(resolveField('Português', 'English', 'en')).toBe('English');
  });

  it('fallback para pt quando en é null', () => {
    expect(resolveField('Português', null, 'en')).toBe('Português');
  });

  it('fallback para en quando pt é null', () => {
    expect(resolveField(null, 'English', 'pt')).toBe('English');
  });

  it('retorna string vazia quando ambos são null', () => {
    expect(resolveField(null, null, 'pt')).toBe('');
  });
});
