import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import express from 'express';

// Migrado de integração contra o Supabase real para mocks (#TEMPLATE-CATALOG): com a
// validação de tipo_evento restrita ao catálogo fixo (novo_lead, seguranca_controle),
// testes de integração não podem mais usar tipo_evento arbitrário/único por execução
// sem colidir com o template ativo real que um admin configurou em produção — criar um
// template de teste para 'novo_lead' desativaria o template real durante o CI. Mockar o
// Supabase evita esse efeito colateral e segue o mesmo padrão já usado em
// crm-clients.routes.test.ts.
const mocks = vi.hoisted(() => {
  const maybeSingle = vi.fn();
  const single = vi.fn();
  const query: Record<string, unknown> = {
    delete: vi.fn(),
    eq: vi.fn(),
    insert: vi.fn(),
    maybeSingle,
    neq: vi.fn(),
    order: vi.fn(),
    select: vi.fn(),
    single,
    update: vi.fn(),
  };

  (query['delete'] as ReturnType<typeof vi.fn>).mockReturnValue(query);
  (query['eq'] as ReturnType<typeof vi.fn>).mockReturnValue(query);
  (query['insert'] as ReturnType<typeof vi.fn>).mockReturnValue(query);
  (query['neq'] as ReturnType<typeof vi.fn>).mockReturnValue(query);
  (query['order'] as ReturnType<typeof vi.fn>).mockReturnValue(query);
  (query['select'] as ReturnType<typeof vi.fn>).mockReturnValue(query);
  (query['update'] as ReturnType<typeof vi.fn>).mockReturnValue(query);
  // Torna `query` "thenable": chains que terminam em .eq()/.neq() (ex.:
  // deactivatePreviousActiveForType, sem .single()/.maybeSingle() no fim) resolvem
  // via `await query` direto, como o query builder real do supabase-js faz.
  query['then'] = (resolve: (v: { data: null; error: null }) => void) =>
    resolve({ data: null, error: null });

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

const { notificationTemplatesRouter } = await import('./notification-templates.routes.js');
const { getTemplateForEvent } = await import('./notification-templates.service.js');

const app = express();
app.use(express.json());
app.use('/admin/notification-templates', notificationTemplatesRouter);

const templateId = '44444444-4444-4444-8444-444444444444';

function mockTemplateRow(overrides: Record<string, unknown> = {}) {
  return {
    id: templateId,
    tipo_evento: 'novo_lead',
    nome: 'Novo lead',
    conteudo: 'Chegou um lead novo.',
    color: '#7f3fe5',
    is_default: false,
    active: true,
    created_at: '2026-07-01T12:00:00.000Z',
    updated_at: '2026-07-01T12:00:00.000Z',
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('GET /admin/notification-templates/event-types', () => {
  it('retorna o catálogo fixo com tipos implementados e não implementados', async () => {
    const res = await request(app).get('/admin/notification-templates/event-types').expect(200);

    const values = res.body.eventTypes.map((t: { value: string }) => t.value);
    expect(values).toContain('novo_lead');
    expect(values).toContain('seguranca_controle');

    const financeiro = res.body.eventTypes.find((t: { value: string }) => t.value === 'financeiro');
    expect(financeiro.implemented).toBe(false);
  });
});

describe('POST /admin/notification-templates (RF15)', () => {
  it('cria o template com a cor sugerida do catálogo quando color não é enviado', async () => {
    mocks.single.mockResolvedValueOnce({ data: mockTemplateRow(), error: null });

    const res = await request(app)
      .post('/admin/notification-templates')
      .send({ tipo_evento: 'novo_lead', nome: 'Novo lead', conteudo: 'Chegou um lead novo.' })
      .expect(201);

    expect(res.body.tipo_evento).toBe('novo_lead');
    expect(res.body.color).toBe('#7f3fe5');
    expect(mocks.query.insert).toHaveBeenCalledWith([
      expect.objectContaining({ tipo_evento: 'novo_lead', color: '#7f3fe5' }),
    ]);
  });

  it('cria o template com a cor customizada enviada pelo admin', async () => {
    mocks.single.mockResolvedValueOnce({
      data: mockTemplateRow({ tipo_evento: 'seguranca_controle', color: '#eab308' }),
      error: null,
    });

    const res = await request(app)
      .post('/admin/notification-templates')
      .send({
        tipo_evento: 'seguranca_controle',
        nome: 'Segurança e controle',
        conteudo: 'Alerta de segurança.',
        color: '#eab308',
      })
      .expect(201);

    expect(res.body.color).toBe('#eab308');
  });

  it('desativa qualquer template ativo anterior do mesmo tipo antes de criar o novo (ativação automática)', async () => {
    mocks.single.mockResolvedValueOnce({ data: mockTemplateRow(), error: null });

    await request(app)
      .post('/admin/notification-templates')
      .send({ tipo_evento: 'novo_lead', nome: 'Novo lead', conteudo: 'x' })
      .expect(201);

    expect(mocks.query.update).toHaveBeenCalledWith({ active: false });
    expect(mocks.query.eq).toHaveBeenCalledWith('tipo_evento', 'novo_lead');
    expect(mocks.query.eq).toHaveBeenCalledWith('active', true);
    expect(mocks.query.eq).toHaveBeenCalledWith('is_default', false);
  });

  it('rejeita tipo_evento fora do catálogo fixo (400)', async () => {
    const res = await request(app)
      .post('/admin/notification-templates')
      .send({ tipo_evento: 'tipo_inventado', nome: 'x', conteudo: 'y' })
      .expect(400);

    expect(res.body.message).toMatch(/inválido/i);
    expect(mocks.query.insert).not.toHaveBeenCalled();
  });

  it('rejeita tipo_evento do catálogo ainda não implementado (400)', async () => {
    const res = await request(app)
      .post('/admin/notification-templates')
      .send({ tipo_evento: 'financeiro', nome: 'x', conteudo: 'y' })
      .expect(400);

    expect(res.body.message).toMatch(/não está implementado/i);
    expect(mocks.query.insert).not.toHaveBeenCalled();
  });

  it('rejeita cor em formato inválido (400)', async () => {
    const res = await request(app)
      .post('/admin/notification-templates')
      .send({ tipo_evento: 'novo_lead', nome: 'x', conteudo: 'y', color: 'amarelo' })
      .expect(400);

    expect(res.body.message).toMatch(/hexadecimal/i);
    expect(mocks.query.insert).not.toHaveBeenCalled();
  });

  it('com campos obrigatórios vazios, a validação impede a criação', async () => {
    const res = await request(app)
      .post('/admin/notification-templates')
      .send({ tipo_evento: '', nome: '', conteudo: '' })
      .expect(400);
    expect(res.body).toHaveProperty('message');
    expect(mocks.query.insert).not.toHaveBeenCalled();
  });
});

describe('PATCH /admin/notification-templates/:id (RF56)', () => {
  it('edita nome e cor sem alterar o tipo_evento', async () => {
    mocks.maybeSingle.mockResolvedValueOnce({
      data: mockTemplateRow({ nome: 'Atualizado', color: '#06b6d4' }),
      error: null,
    });

    const res = await request(app)
      .patch(`/admin/notification-templates/${templateId}`)
      .send({ nome: 'Atualizado', color: '#06b6d4' })
      .expect(200);

    expect(res.body.nome).toBe('Atualizado');
    expect(res.body.color).toBe('#06b6d4');
    expect(mocks.query.update).toHaveBeenCalledWith(
      expect.objectContaining({ nome: 'Atualizado', color: '#06b6d4' })
    );
  });

  it('ao alterar o tipo_evento, desativa qualquer outro template ativo desse novo tipo', async () => {
    mocks.maybeSingle.mockResolvedValueOnce({
      data: mockTemplateRow({ tipo_evento: 'seguranca_controle' }),
      error: null,
    });

    await request(app)
      .patch(`/admin/notification-templates/${templateId}`)
      .send({ tipo_evento: 'seguranca_controle' })
      .expect(200);

    expect(mocks.query.update).toHaveBeenCalledWith({ active: false });
    expect(mocks.query.neq).toHaveBeenCalledWith('id', templateId);
  });

  it('template inexistente retorna 404', async () => {
    mocks.maybeSingle.mockResolvedValueOnce({ data: null, error: null });

    const res = await request(app)
      .patch('/admin/notification-templates/00000000-0000-0000-0000-000000000000')
      .send({ nome: 'x' })
      .expect(404);
    expect(res.body).toHaveProperty('message');
  });

  it('com nome vazio, a validação impede a edição', async () => {
    const res = await request(app)
      .patch(`/admin/notification-templates/${templateId}`)
      .send({ nome: '' })
      .expect(400);
    expect(res.body).toHaveProperty('message');
    expect(mocks.query.update).not.toHaveBeenCalled();
  });
});

describe('DELETE /admin/notification-templates/:id (RF57)', () => {
  it('inativa o template e retorna 200 com active=false', async () => {
    mocks.maybeSingle
      .mockResolvedValueOnce({ data: { is_default: false }, error: null })
      .mockResolvedValueOnce({ data: mockTemplateRow({ active: false }), error: null });

    const res = await request(app)
      .delete(`/admin/notification-templates/${templateId}`)
      .expect(200);
    expect(res.body.active).toBe(false);
  });

  it('template já inativo ou inexistente retorna 404', async () => {
    mocks.maybeSingle.mockResolvedValueOnce({ data: null, error: null });

    const res = await request(app)
      .delete(`/admin/notification-templates/${templateId}`)
      .expect(404);
    expect(res.body).toHaveProperty('message');
  });

  it('o template padrão de fallback não pode ser removido (409)', async () => {
    mocks.maybeSingle.mockResolvedValueOnce({ data: { is_default: true }, error: null });

    const res = await request(app)
      .delete(`/admin/notification-templates/${templateId}`)
      .expect(409);
    expect(res.body).toHaveProperty('message');
  });
});

describe('getTemplateForEvent (fallback, RF57 · #203)', () => {
  it('quando não há template ativo específico, resolve para o template padrão', async () => {
    mocks.maybeSingle
      .mockResolvedValueOnce({ data: null, error: null }) // busca específica
      .mockResolvedValueOnce({ data: mockTemplateRow({ is_default: true }), error: null }); // fallback

    const template = await getTemplateForEvent('novo_lead');
    expect(template?.is_default).toBe(true);
  });

  it('quando há template ativo específico, resolve para ele em vez do padrão', async () => {
    mocks.maybeSingle.mockResolvedValueOnce({
      data: mockTemplateRow({ tipo_evento: 'seguranca_controle', is_default: false }),
      error: null,
    });

    const template = await getTemplateForEvent('seguranca_controle');
    expect(template?.tipo_evento).toBe('seguranca_controle');
    expect(template?.is_default).toBe(false);
  });
});
