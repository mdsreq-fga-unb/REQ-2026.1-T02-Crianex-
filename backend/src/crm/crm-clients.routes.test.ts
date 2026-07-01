import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import express from 'express';

const mocks = vi.hoisted(() => {
  const maybeSingle = vi.fn();
  const single = vi.fn();
  const query = {
    delete: vi.fn(),
    eq: vi.fn(),
    insert: vi.fn(),
    maybeSingle,
    select: vi.fn(),
    single,
    update: vi.fn(),
  };

  query.delete.mockReturnValue(query);
  query.eq.mockReturnValue(query);
  query.insert.mockReturnValue(query);
  query.select.mockReturnValue(query);
  query.update.mockReturnValue(query);
  const from = vi.fn(() => query);

  return { from, maybeSingle, query, single };
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
const interactionId = '44444444-4444-4444-8444-444444444444';
const authorId = '22222222-2222-4222-8222-222222222222';
const forgedAuthorId = '33333333-3333-4333-8333-333333333333';
const originalDate = '2026-06-30T12:00:00.000Z';

beforeEach(() => {
  vi.clearAllMocks();
  mocks.single.mockResolvedValue({
    data: {
      id: interactionId,
      client_id: clientId,
      autor_id: authorId,
      tipo: 'ligacao',
      conteudo: 'Cliente pediu proposta.',
      data: originalDate,
      removed: false,
    },
    error: null,
  });
  mocks.maybeSingle.mockResolvedValue({
    data: {
      id: interactionId,
      client_id: clientId,
      autor_id: authorId,
      tipo: 'ligacao',
      conteudo: 'Conteúdo editado.',
      data: originalDate,
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
    expect(mocks.query.insert).toHaveBeenCalledWith({
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

    expect(mocks.query.insert).toHaveBeenCalledWith({
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
    expect(mocks.query.insert).not.toHaveBeenCalled();
  });
});

describe('PATCH /crm/clients/:id/interactions/:iid', () => {
  it('atualiza conteúdo preservando autor_id e data originais', async () => {
    const res = await request(app)
      .patch(`/crm/clients/${clientId}/interactions/${interactionId}`)
      .send({
        conteudo: 'Conteúdo editado.',
        autor_id: forgedAuthorId,
        data: '1999-01-01T00:00:00.000Z',
      })
      .expect(200);

    expect(res.body).toMatchObject({
      id: interactionId,
      client_id: clientId,
      autor_id: authorId,
      conteudo: 'Conteúdo editado.',
      data: originalDate,
      removed: false,
    });
    expect(res.body.autor_id).not.toBe(forgedAuthorId);
    expect(mocks.query.update).toHaveBeenCalledWith({ conteudo: 'Conteúdo editado.' });
    expect(mocks.query.update).not.toHaveBeenCalledWith(
      expect.objectContaining({
        autor_id: expect.anything(),
        data: expect.anything(),
      })
    );
    expect(mocks.query.eq).toHaveBeenCalledWith('id', interactionId);
    expect(mocks.query.eq).toHaveBeenCalledWith('client_id', clientId);
    expect(mocks.query.eq).toHaveBeenCalledWith('removed', false);
  });

  it('retorna 400 quando o patch não contém tipo nem conteúdo', async () => {
    const res = await request(app)
      .patch(`/crm/clients/${clientId}/interactions/${interactionId}`)
      .send({ autor_id: forgedAuthorId, data: '1999-01-01T00:00:00.000Z' })
      .expect(400);

    expect(res.body.code).toBe('EMPTY_PATCH');
    expect(mocks.query.update).not.toHaveBeenCalled();
  });
});

describe('DELETE /crm/clients/:id/interactions/:iid', () => {
  it('marca removed=true sem excluir fisicamente a interação', async () => {
    mocks.maybeSingle.mockResolvedValueOnce({
      data: {
        id: interactionId,
        client_id: clientId,
        autor_id: authorId,
        tipo: 'ligacao',
        conteudo: 'Cliente pediu proposta.',
        data: originalDate,
        removed: true,
      },
      error: null,
    });

    const res = await request(app)
      .delete(`/crm/clients/${clientId}/interactions/${interactionId}`)
      .expect(200);

    expect(res.body).toMatchObject({
      id: interactionId,
      client_id: clientId,
      autor_id: authorId,
      data: originalDate,
      removed: true,
    });
    expect(mocks.query.update).toHaveBeenCalledWith({ removed: true });
    expect(mocks.query.delete).not.toHaveBeenCalled();
    expect(mocks.query.eq).toHaveBeenCalledWith('id', interactionId);
    expect(mocks.query.eq).toHaveBeenCalledWith('client_id', clientId);
    expect(mocks.query.eq).toHaveBeenCalledWith('removed', false);
  });
});
