import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import express from 'express';

const mocks = vi.hoisted(() => {
  const single = vi.fn();
  const select = vi.fn(() => ({ single }));
  const insert = vi.fn(() => ({ select }));
  const from = vi.fn(() => ({ insert }));

  return { from, insert, select, single };
});

vi.mock('../config/supabase.js', () => ({
  getSupabaseClient: () => ({ from: mocks.from }),
}));

vi.mock('../middleware/validate-jwt.js', () => ({
  validateJWT: (_req: unknown, res: { locals: Record<string, unknown> }, next: () => void) => {
    res.locals['auth'] = {
      accessToken: 'test-token',
      user: { id: '22222222-2222-4222-8222-222222222222', name: 'Admin', role: 'owner' },
    };
    next();
  },
}));

vi.mock('../middleware/require-role.js', () => ({
  requireRole: () => (_req: unknown, _res: unknown, next: () => void) => next(),
}));

const { crmClientsRouter } = await import('./crm-clients.routes.js');

const app = express();
app.use(express.json());
app.use('/crm/clients', crmClientsRouter);

const clientId = '11111111-1111-4111-8111-111111111111';
const authorId = '22222222-2222-4222-8222-222222222222';
const forgedAuthorId = '33333333-3333-4333-8333-333333333333';

beforeEach(() => {
  vi.clearAllMocks();
  mocks.single.mockResolvedValue({
    data: {
      id: '44444444-4444-4444-8444-444444444444',
      client_id: clientId,
      autor_id: authorId,
      tipo: 'ligacao',
      conteudo: 'Cliente pediu proposta.',
      data: '2026-06-30T12:00:00.000Z',
      removed: false,
    },
    error: null,
  });
});

describe('POST /crm/clients/:id/interactions', () => {
  it('cria interação com autor_id do contexto autenticado e data do servidor', async () => {
    const res = await request(app)
      .post(`/crm/clients/${clientId}/interactions`)
      .send({ tipo: 'ligacao', conteudo: 'Cliente pediu proposta.' })
      .expect(201);

    expect(res.body).toMatchObject({
      client_id: clientId,
      autor_id: authorId,
      tipo: 'ligacao',
      conteudo: 'Cliente pediu proposta.',
      removed: false,
    });
    expect(res.body.data).toBeTruthy();
    expect(mocks.from).toHaveBeenCalledWith('interactions');
    expect(mocks.insert).toHaveBeenCalledWith({
      client_id: clientId,
      autor_id: authorId,
      tipo: 'ligacao',
      conteudo: 'Cliente pediu proposta.',
    });
  });

  it('ignora autor_id e data enviados no payload e sobrescreve pelo JWT/servidor', async () => {
    await request(app)
      .post(`/crm/clients/${clientId}/interactions`)
      .send({
        tipo: 'email',
        conteudo: 'Follow-up enviado.',
        autor_id: forgedAuthorId,
        data: '1999-01-01T00:00:00.000Z',
      })
      .expect(201);

    expect(mocks.insert).toHaveBeenCalledWith({
      client_id: clientId,
      autor_id: authorId,
      tipo: 'email',
      conteudo: 'Follow-up enviado.',
    });
  });

  it('retorna 400 quando tipo ou conteudo está ausente', async () => {
    const res = await request(app)
      .post(`/crm/clients/${clientId}/interactions`)
      .send({ tipo: 'email' })
      .expect(400);

    expect(res.body.code).toBe('INVALID_CONTEUDO');
    expect(mocks.insert).not.toHaveBeenCalled();
  });
});
