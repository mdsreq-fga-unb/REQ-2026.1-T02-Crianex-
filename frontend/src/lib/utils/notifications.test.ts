import { describe, it, expect } from 'vitest';
import {
  groupByDay,
  formatDayLabel,
  relativeTime,
  iconForTipo,
  type Notification,
} from './notifications';

const mk = (
  id: string,
  created_at: string,
  status: 'unread' | 'read' = 'unread'
): Notification => ({
  id,
  tipo: 'novo_lead',
  conteudo: `conteudo ${id}`,
  status,
  created_at,
});

describe('groupByDay', () => {
  it('agrupa itens do mesmo dia e ordena dias/itens em ordem decrescente', () => {
    const items = [
      mk('a', '2026-06-10T09:00:00.000Z'),
      mk('b', '2026-06-12T08:00:00.000Z'),
      mk('c', '2026-06-12T20:00:00.000Z'),
    ];
    const groups = groupByDay(items);

    expect(groups).toHaveLength(2);
    // dia mais recente primeiro
    expect(groups[0]!.key).toBe('2026-06-12');
    expect(groups[1]!.key).toBe('2026-06-10');
    // dentro do dia, item mais recente primeiro
    expect(groups[0]!.items.map((n) => n.id)).toEqual(['c', 'b']);
  });

  it('retorna [] para entrada vazia', () => {
    expect(groupByDay([])).toEqual([]);
  });
});

describe('formatDayLabel', () => {
  const now = new Date('2026-06-30T12:00:00.000Z');

  it('rotula hoje e ontem', () => {
    expect(formatDayLabel('2026-06-30T08:00:00.000Z', now)).toBe('Hoje');
    expect(formatDayLabel('2026-06-29T08:00:00.000Z', now)).toBe('Ontem');
  });

  it('formata outras datas com o ano', () => {
    expect(formatDayLabel('2026-06-10T08:00:00.000Z', now)).toContain('2026');
  });
});

describe('relativeTime', () => {
  const now = new Date('2026-06-30T12:00:00.000Z');

  it('cobre agora/minutos/horas/dias', () => {
    expect(relativeTime('2026-06-30T11:59:40.000Z', now)).toBe('agora');
    expect(relativeTime('2026-06-30T11:46:00.000Z', now)).toBe('14m');
    expect(relativeTime('2026-06-30T10:00:00.000Z', now)).toBe('2h');
    expect(relativeTime('2026-06-27T12:00:00.000Z', now)).toBe('3d');
  });
});

describe('iconForTipo', () => {
  it('mapeia novo_lead e tem fallback', () => {
    expect(iconForTipo('novo_lead')).toEqual({ icon: 'users', color: '#7f3fe5' });
    expect(iconForTipo('qualquer_outro').icon).toBe('bell');
  });
});
