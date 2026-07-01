import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import express from 'express';
import { notificationTemplatesRouter } from './notification-templates.routes.js';
import { getSupabaseClient } from '../config/supabase.js';
import { getTemplateForEvent } from './notification-templates.service.js';

const originalBypass = process.env['ADMIN_AUTH_BYPASS'];

// tipo_evento exclusivo desta suíte — permite limpar resíduos sem afetar dados reais.
const TEST_TIPO = `template-ci-${Date.now()}`;

beforeAll(async () => {
  process.env['ADMIN_AUTH_BYPASS'] = 'true';
  const supabase = getSupabaseClient();
  await supabase.from('notification_templates').delete().like('tipo_evento', `${TEST_TIPO}%`);
});

afterAll(async () => {
  const supabase = getSupabaseClient();
  await supabase.from('notification_templates').delete().like('tipo_evento', `${TEST_TIPO}%`);

  if (originalBypass === undefined) {
    delete process.env['ADMIN_AUTH_BYPASS'];
  } else {
    process.env['ADMIN_AUTH_BYPASS'] = originalBypass;
  }
});

const app = express();
app.use(express.json());
app.use('/admin/notification-templates', notificationTemplatesRouter);

describe('Suite de testes de integração — POST /api/admin/notification-templates (RF15 · #202)', () => {
  it('Com dados válidos, cria e persiste o template associado ao tipo de evento', async () => {
    const res = await request(app)
      .post('/admin/notification-templates')
      .send({ tipo_evento: `${TEST_TIPO}-create`, nome: 'Novo lead', conteudo: 'Chegou um lead.' })
      .expect(201);

    expect(res.body.tipo_evento).toBe(`${TEST_TIPO}-create`);
    expect(res.body.active).toBe(true);
  });

  it('Com campos obrigatórios vazios, a validação impede a criação e sinaliza os campos', async () => {
    const res = await request(app)
      .post('/admin/notification-templates')
      .send({ tipo_evento: '', nome: '', conteudo: '' })
      .expect(400);
    expect(res.body).toHaveProperty('message');
  });

  it('Para um tipo de evento que já possui template ativo, impede a duplicidade', async () => {
    const tipo = `${TEST_TIPO}-dup`;
    await request(app)
      .post('/admin/notification-templates')
      .send({ tipo_evento: tipo, nome: 'Primeiro', conteudo: 'x' })
      .expect(201);

    const res = await request(app)
      .post('/admin/notification-templates')
      .send({ tipo_evento: tipo, nome: 'Segundo', conteudo: 'y' })
      .expect(409);
    expect(res.body).toHaveProperty('message');
  });

  it('Sem token válido retorna 401 sem executar a query', async () => {
    const saved = process.env['ADMIN_AUTH_BYPASS'];
    delete process.env['ADMIN_AUTH_BYPASS'];
    try {
      const res = await request(app)
        .post('/admin/notification-templates')
        .send({ tipo_evento: 'x', nome: 'y', conteudo: 'z' })
        .expect(401);
      expect(res.body).toEqual({ error: 'Unauthorized' });
    } finally {
      process.env['ADMIN_AUTH_BYPASS'] = saved;
    }
  });
});

describe('Suite de testes de integração — PATCH /api/admin/notification-templates/:id (RF56 · #202)', () => {
  let id: string;

  beforeAll(async () => {
    const res = await request(app)
      .post('/admin/notification-templates')
      .send({ tipo_evento: `${TEST_TIPO}-edit`, nome: 'Original', conteudo: 'Original.' })
      .expect(201);
    id = res.body.id;
  });

  it('Edita o template existente sem duplicar o registro', async () => {
    const res = await request(app)
      .patch(`/admin/notification-templates/${id}`)
      .send({ nome: 'Atualizado' })
      .expect(200);

    expect(res.body.id).toBe(id);
    expect(res.body.nome).toBe('Atualizado');

    const supabase = getSupabaseClient();
    const { count } = await supabase
      .from('notification_templates')
      .select('*', { count: 'exact', head: true })
      .eq('tipo_evento', `${TEST_TIPO}-edit`);
    expect(count).toBe(1);
  });

  it('Com campos inválidos na edição, a validação impede e a versão anterior é mantida', async () => {
    const res = await request(app)
      .patch(`/admin/notification-templates/${id}`)
      .send({ nome: '' })
      .expect(400);
    expect(res.body).toHaveProperty('message');

    const supabase = getSupabaseClient();
    const { data } = await supabase
      .from('notification_templates')
      .select('nome')
      .eq('id', id)
      .single();
    expect(data?.nome).toBe('Atualizado');
  });

  it('Template inexistente retorna 404 sem efeito', async () => {
    const res = await request(app)
      .patch('/admin/notification-templates/00000000-0000-0000-0000-000000000000')
      .send({ nome: 'x' })
      .expect(404);
    expect(res.body).toHaveProperty('message');
  });
});

describe('Suite de testes de integração — DELETE /api/admin/notification-templates/:id (RF57 · #203)', () => {
  let id: string;

  beforeAll(async () => {
    const res = await request(app)
      .post('/admin/notification-templates')
      .send({ tipo_evento: `${TEST_TIPO}-delete`, nome: 'A remover', conteudo: 'x' })
      .expect(201);
    id = res.body.id;
  });

  it('Remove (inativa) o template e retorna 200 com active=false', async () => {
    const res = await request(app).delete(`/admin/notification-templates/${id}`).expect(200);
    expect(res.body.active).toBe(false);
  });

  it('Template já removido retorna 404 de forma idempotente', async () => {
    const res = await request(app).delete(`/admin/notification-templates/${id}`).expect(404);
    expect(res.body).toHaveProperty('message');
  });

  it('id inexistente retorna 404', async () => {
    const res = await request(app)
      .delete('/admin/notification-templates/00000000-0000-0000-0000-000000000000')
      .expect(404);
    expect(res.body).toHaveProperty('message');
  });

  it('O template padrão de fallback não pode ser removido (409)', async () => {
    const supabase = getSupabaseClient();
    const { data: fallback } = await supabase
      .from('notification_templates')
      .select('id')
      .eq('is_default', true)
      .single();

    const res = await request(app)
      .delete(`/admin/notification-templates/${fallback?.id}`)
      .expect(409);
    expect(res.body).toHaveProperty('message');
  });
});

describe('Suite de testes de integração — getTemplateForEvent (fallback, RF57 · #203)', () => {
  it('Quando não há template ativo para o tipo de evento, resolve para o template padrão', async () => {
    const template = await getTemplateForEvent(`${TEST_TIPO}-sem-template`);
    expect(template?.is_default).toBe(true);
  });

  it('Quando há template ativo específico, resolve para ele em vez do padrão', async () => {
    const tipo = `${TEST_TIPO}-fallback-especifico`;
    await request(app)
      .post('/admin/notification-templates')
      .send({ tipo_evento: tipo, nome: 'Específico', conteudo: 'Específico.' })
      .expect(201);

    const template = await getTemplateForEvent(tipo);
    expect(template?.tipo_evento).toBe(tipo);
    expect(template?.is_default).toBe(false);
  });
});
