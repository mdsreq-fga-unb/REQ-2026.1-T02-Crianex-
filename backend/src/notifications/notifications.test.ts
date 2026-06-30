import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import express from 'express';
import { notificationsRouter } from './notifications.routes.js';
import { getSupabaseClient } from '../config/supabase.js';

const originalBypass = process.env['ADMIN_AUTH_BYPASS'];

// tipo exclusivo desta suíte — permite limpar resíduos sem afetar dados reais.
const TEST_TIPO = `notif-ci-${Date.now()}`;

// created_at controlados para validar a ordenação DESC de forma determinística.
const OLDER = '2026-01-01T10:00:00.000Z';
const NEWER = '2026-01-01T12:00:00.000Z';

beforeAll(async () => {
  process.env['ADMIN_AUTH_BYPASS'] = 'true';

  const supabase = getSupabaseClient();
  await supabase.from('notifications').delete().eq('tipo', TEST_TIPO);

  const { error } = await supabase.from('notifications').insert([
    { tipo: TEST_TIPO, conteudo: 'unread antiga', status: 'unread', created_at: OLDER },
    { tipo: TEST_TIPO, conteudo: 'unread recente', status: 'unread', created_at: NEWER },
    { tipo: TEST_TIPO, conteudo: 'lida', status: 'read', created_at: OLDER },
  ]);
  if (error) throw error;
});

afterAll(async () => {
  const supabase = getSupabaseClient();
  await supabase.from('notifications').delete().eq('tipo', TEST_TIPO);

  if (originalBypass === undefined) {
    delete process.env['ADMIN_AUTH_BYPASS'];
  } else {
    process.env['ADMIN_AUTH_BYPASS'] = originalBypass;
  }
});

const app = express();
app.use(express.json());
app.use('/admin/notifications', notificationsRouter);

type NotificationDto = {
  id: string;
  tipo: string;
  conteudo: string;
  status: string;
  created_at: string;
};
const fromSuite = (list: NotificationDto[]) => list.filter((n) => n.tipo === TEST_TIPO);

describe('Suite de testes de integração — GET /api/admin/notifications', () => {
  it('Sem filtro, retorna { notifications, unreadCount } com lista (array) e contador de não lidas', async () => {
    const res = await request(app).get('/admin/notifications').expect(200);

    expect(Array.isArray(res.body.notifications)).toBe(true);
    expect(typeof res.body.unreadCount).toBe('number');
    expect(res.body.unreadCount).toBeGreaterThanOrEqual(2);

    const mine = fromSuite(res.body.notifications);
    expect(mine).toHaveLength(3);
  });

  it('?status=unread retorna só as não lidas, ordenadas por created_at DESC (RNF03)', async () => {
    const res = await request(app).get('/admin/notifications?status=unread').expect(200);

    const all: NotificationDto[] = res.body.notifications;
    expect(all.every((n) => n.status === 'unread')).toBe(true);

    // ordenação global decrescente
    for (let i = 1; i < all.length; i += 1) {
      expect(all[i - 1]!.created_at >= all[i]!.created_at).toBe(true);
    }

    // entre as desta suíte, a recente vem antes da antiga
    const mine = fromSuite(all);
    expect(mine.map((n) => n.conteudo)).toEqual(['unread recente', 'unread antiga']);
  });

  it('?status=read retorna só as lidas', async () => {
    const res = await request(app).get('/admin/notifications?status=read').expect(200);

    const all: NotificationDto[] = res.body.notifications;
    expect(all.every((n) => n.status === 'read')).toBe(true);
    expect(fromSuite(all)).toHaveLength(1);
  });

  it('?status inválido retorna 400 com { message }', async () => {
    const res = await request(app).get('/admin/notifications?status=foo').expect(400);
    expect(res.body).toHaveProperty('message');
  });

  it('Sem token válido retorna 401 sem executar a query', async () => {
    const saved = process.env['ADMIN_AUTH_BYPASS'];
    delete process.env['ADMIN_AUTH_BYPASS'];
    try {
      const res = await request(app).get('/admin/notifications').expect(401);
      expect(res.body).toEqual({ error: 'Unauthorized' });
    } finally {
      process.env['ADMIN_AUTH_BYPASS'] = saved;
    }
  });
});
