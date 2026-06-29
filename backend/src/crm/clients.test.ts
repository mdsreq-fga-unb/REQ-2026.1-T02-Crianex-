import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import express from 'express';
import { clientsRouter } from './clients.routes.js';
import { getSupabaseClient } from '../config/supabase.js';

const originalBypass = process.env['ADMIN_AUTH_BYPASS'];

// App with auth bypassed — exercises the business logic (RF35, RF36).
const app = express();
app.use(express.json());
app.use('/admin/crm/clients', clientsRouter);

// App WITHOUT bypass — exercises the token guard (AC3).
const guardedApp = express();
guardedApp.use(express.json());

const supabase = getSupabaseClient();
let clientId: string;
const testEmail = `client-ci-${Date.now()}@crianex.test`;

beforeAll(async () => {
  // Seed a client directly (this issue ships only the PATCH endpoint).
  const { data, error } = await supabase
    .from('clients')
    .insert({ nome: 'Cliente CI', email: testEmail, telefone: '+55 11 90000-0000' })
    .select('id')
    .single();
  if (error) throw error;
  clientId = data.id as string;
});

afterAll(async () => {
  await supabase.from('clients').delete().eq('id', clientId);
});

describe('Suite de integração — PATCH /admin/crm/clients/:id', () => {
  // AC1 — admin autenticado edita dados do cliente
  it('Dado dados válidos, deve atualizar o cliente e retornar 200 em até 2s (RNF03)', async () => {
    process.env['ADMIN_AUTH_BYPASS'] = 'true';
    const start = Date.now();
    const res = await request(app)
      .patch(`/admin/crm/clients/${clientId}`)
      .send({ nome: 'Cliente CI Atualizado', telefone: '+55 11 91111-1111' })
      .expect(200);
    const elapsed = Date.now() - start;

    expect(res.body.nome).toBe('Cliente CI Atualizado');
    expect(res.body.telefone).toBe('+55 11 91111-1111');
    expect(res.body.status).toBe('ativo');
    expect(elapsed).toBeLessThan(2000);
  });

  // AC2 — inativação por status, sem remover do histórico
  it('Dado status=inativo, deve marcar como inativo sem remover o registro', async () => {
    process.env['ADMIN_AUTH_BYPASS'] = 'true';
    const res = await request(app)
      .patch(`/admin/crm/clients/${clientId}`)
      .send({ status: 'inativo' })
      .expect(200);

    expect(res.body.status).toBe('inativo');

    // O registro continua existindo (histórico preservado).
    const { data } = await supabase
      .from('clients')
      .select('id, status')
      .eq('id', clientId)
      .maybeSingle();
    expect(data).not.toBeNull();
    expect(data?.status).toBe('inativo');
  });

  it('Dado status inválido, deve retornar 400', async () => {
    process.env['ADMIN_AUTH_BYPASS'] = 'true';
    const res = await request(app)
      .patch(`/admin/crm/clients/${clientId}`)
      .send({ status: 'arquivado' })
      .expect(400);
    expect(res.body).toHaveProperty('message');
  });

  it('Dado um id inexistente, deve retornar 404', async () => {
    process.env['ADMIN_AUTH_BYPASS'] = 'true';
    const res = await request(app)
      .patch('/admin/crm/clients/00000000-0000-0000-0000-000000000000')
      .send({ nome: 'Fantasma' })
      .expect(404);
    expect(res.body).toHaveProperty('message');
  });

  // AC3 — token inválido/ausente → 401 sem expor detalhes internos
  it('Dado token ausente, deve retornar 401 sem expor detalhes internos', async () => {
    delete process.env['ADMIN_AUTH_BYPASS'];
    // Router montado em app sem bypass, garantindo que o guard de JWT atue.
    guardedApp.use('/admin/crm/clients', clientsRouter);

    const res = await request(guardedApp)
      .patch(`/admin/crm/clients/${clientId}`)
      .send({ nome: 'Sem Token' })
      .expect(401);

    expect(res.body).toEqual({ error: 'Unauthorized' });
  });
});

afterAll(() => {
  if (originalBypass === undefined) {
    delete process.env['ADMIN_AUTH_BYPASS'];
  } else {
    process.env['ADMIN_AUTH_BYPASS'] = originalBypass;
  }
});
