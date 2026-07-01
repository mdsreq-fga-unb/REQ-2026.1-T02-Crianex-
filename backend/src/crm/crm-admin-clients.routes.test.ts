import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import express from 'express';

const mocks = vi.hoisted(() => {
  const maybeSingle = vi.fn();
  const single = vi.fn();
  const query: Record<string, unknown> = {
    delete: vi.fn(),
    eq: vi.fn(),
    in: vi.fn(),
    insert: vi.fn(),
    limit: vi.fn(),
    maybeSingle,
    order: vi.fn(),
    select: vi.fn(),
    single,
    update: vi.fn(),
  };

  (query['delete'] as ReturnType<typeof vi.fn>).mockReturnValue(query);
  (query['eq'] as ReturnType<typeof vi.fn>).mockReturnValue(query);
  (query['in'] as ReturnType<typeof vi.fn>).mockResolvedValue({ data: [], error: null });
  (query['insert'] as ReturnType<typeof vi.fn>).mockReturnValue(query);
  (query['limit'] as ReturnType<typeof vi.fn>).mockReturnValue(query);
  (query['order'] as ReturnType<typeof vi.fn>).mockReturnValue(query);
  (query['select'] as ReturnType<typeof vi.fn>).mockReturnValue(query);
  (query['update'] as ReturnType<typeof vi.fn>).mockReturnValue(query);
  // Torna `query` "thenable": chains sem .single()/.maybeSingle() no fim (ex.: insert
  // de client_cards, count de interactions) resolvem via `await query` direto, como o
  // query builder real do supabase-js faz.
  query['then'] = (resolve: (v: { data: null; error: null; count: number }) => void) =>
    resolve({ data: null, error: null, count: 0 });

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

const { crmAdminClientsRouter } = await import('./crm-admin-clients.routes.js');

const app = express();
app.use(express.json());
app.use('/admin/crm/clients', crmAdminClientsRouter);

const clientId = '11111111-1111-4111-8111-111111111111';

beforeEach(() => {
  vi.clearAllMocks();
  // mockClear (via clearAllMocks) resets call history but NOT queued
  // mockResolvedValueOnce values — reset those explicitly so a test's queued
  // resolutions never bleed into the next test.
  mocks.maybeSingle.mockReset();
  mocks.single.mockReset();
});

describe('POST /admin/crm/clients — telefone', () => {
  it('persiste o telefone enviado ao criar o lead', async () => {
    mocks.single.mockResolvedValueOnce({ data: { id: clientId }, error: null });
    mocks.maybeSingle
      .mockResolvedValueOnce({
        data: {
          id: clientId,
          nome: 'Novo Lead',
          email: 'x@y.com',
          telefone: '+5511999990000',
          status: 'ativo',
        },
        error: null,
      }) // clients lookup em buildClientView
      .mockResolvedValueOnce({ data: null, error: null }) // client_cards lookup em buildClientView
      .mockResolvedValueOnce({ data: null, error: null }); // lastInter lookup em buildClientView

    const res = await request(app)
      .post('/admin/crm/clients')
      .send({ name: 'Novo Lead', email: 'x@y.com', phone: '+5511999990000' })
      .expect(201);

    expect(res.body.phone).toBe('+5511999990000');
    expect(mocks.query.insert).toHaveBeenCalledWith(
      expect.objectContaining({ telefone: '+5511999990000' })
    );
  });
});

describe('DELETE /admin/crm/clients/:id', () => {
  it('marca o cliente como inativo (soft-delete) e retorna 204', async () => {
    mocks.maybeSingle.mockResolvedValueOnce({ data: { id: clientId }, error: null });

    await request(app).delete(`/admin/crm/clients/${clientId}`).expect(204);

    expect(mocks.query.update).toHaveBeenCalledWith({ status: 'inativo' });
    expect(mocks.query.eq).toHaveBeenCalledWith('id', clientId);
    expect(mocks.query.eq).toHaveBeenCalledWith('status', 'ativo');
  });

  it('cliente inexistente ou já inativo retorna 404', async () => {
    mocks.maybeSingle.mockResolvedValueOnce({ data: null, error: null });

    const res = await request(app).delete(`/admin/crm/clients/${clientId}`).expect(404);
    expect(res.body).toHaveProperty('message');
  });
});

describe('GET /admin/crm/clients/inactive', () => {
  it('lista clientes com status=inativo', async () => {
    await request(app).get('/admin/crm/clients/inactive').expect(200);

    expect(mocks.query.eq).toHaveBeenCalledWith('status', 'inativo');
  });
});

describe('POST /admin/crm/clients/:id/reactivate', () => {
  it('marca o cliente inativo como ativo novamente e retorna o cliente atualizado', async () => {
    mocks.maybeSingle
      .mockResolvedValueOnce({ data: { id: clientId }, error: null }) // update status=ativo
      .mockResolvedValueOnce({
        data: {
          id: clientId,
          nome: 'Lead Reativado',
          email: 'lead@reativado.com',
          telefone: null,
          status: 'ativo',
        },
        error: null,
      }) // clients lookup em buildClientView
      .mockResolvedValueOnce({ data: null, error: null }) // client_cards lookup em buildClientView
      .mockResolvedValueOnce({ data: null, error: null }); // lastInter lookup em buildClientView

    const res = await request(app)
      .post(`/admin/crm/clients/${clientId}/reactivate`)
      .expect(200);

    expect(mocks.query.update).toHaveBeenCalledWith({ status: 'ativo' });
    expect(mocks.query.eq).toHaveBeenCalledWith('status', 'inativo');
    expect(res.body.status).toBe('ativo');
  });

  it('cliente inexistente ou já ativo retorna 404', async () => {
    mocks.maybeSingle.mockResolvedValueOnce({ data: null, error: null });

    const res = await request(app)
      .post(`/admin/crm/clients/${clientId}/reactivate`)
      .expect(404);
    expect(res.body).toHaveProperty('message');
  });
});
