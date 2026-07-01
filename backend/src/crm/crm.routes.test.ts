import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import express from 'express';

const mocks = vi.hoisted(() => {
  const maybeSingle = vi.fn();
  const query = {
    eq: vi.fn(),
    maybeSingle,
    select: vi.fn(),
    update: vi.fn(),
  };

  query.eq.mockReturnValue(query);
  query.select.mockReturnValue(query);
  query.update.mockReturnValue(query);
  const from = vi.fn(() => query);

  return { from, maybeSingle, query };
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

const { crmRouter } = await import('./crm.routes.js');

const app = express();
app.use(express.json());
app.use('/crm', crmRouter);

const cardId = '55555555-5555-4555-8555-555555555555';
const columnId = '66666666-6666-4666-8666-666666666666';
const clientId = '11111111-1111-4111-8111-111111111111';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('PATCH /crm/cards/:id', () => {
  it('move o card para outra coluna otimisticamente (RNF25)', async () => {
    mocks.maybeSingle
      .mockResolvedValueOnce({ data: { id: columnId }, error: null }) // column exists check
      .mockResolvedValueOnce({
        data: {
          id: cardId,
          client_id: clientId,
          column_id: columnId,
          produto_vinculado: null,
          responsavel: null,
          created_at: '2026-06-30T12:00:00.000Z',
        },
        error: null,
      });

    const res = await request(app)
      .patch(`/crm/cards/${cardId}`)
      .send({ column_id: columnId })
      .expect(200);

    expect(res.body).toMatchObject({ id: cardId, column_id: columnId });
    expect(mocks.from).toHaveBeenCalledWith('crm_columns');
    expect(mocks.from).toHaveBeenCalledWith('client_cards');
    expect(mocks.query.update).toHaveBeenCalledWith({ column_id: columnId });
    expect(mocks.query.eq).toHaveBeenCalledWith('id', cardId);
  });

  it('retorna 400 quando a coluna de destino não existe (para permitir rollback no cliente)', async () => {
    mocks.maybeSingle.mockResolvedValueOnce({ data: null, error: null });

    const res = await request(app)
      .patch(`/crm/cards/${cardId}`)
      .send({ column_id: columnId })
      .expect(400);

    expect(res.body.message).toBeTruthy();
    expect(mocks.query.update).not.toHaveBeenCalled();
  });

  it('retorna 404 quando o card não existe (para permitir rollback no cliente)', async () => {
    mocks.maybeSingle
      .mockResolvedValueOnce({ data: { id: columnId }, error: null })
      .mockResolvedValueOnce({ data: null, error: null });

    await request(app).patch(`/crm/cards/${cardId}`).send({ column_id: columnId }).expect(404);
  });

  it('retorna 400 quando nenhum campo é enviado', async () => {
    const res = await request(app).patch(`/crm/cards/${cardId}`).send({}).expect(400);

    expect(res.body.message).toBeTruthy();
    expect(mocks.query.update).not.toHaveBeenCalled();
  });
});
