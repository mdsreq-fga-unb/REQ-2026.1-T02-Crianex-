import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import express from 'express';
import { clientsRouter } from './clients.routes.js';
import { getSupabaseClient } from '../config/supabase.js';

const originalBypass = process.env['ADMIN_AUTH_BYPASS'];

// e-mail exclusivo desta suíte para isolar resíduos de dados reais.
const SUITE_TAG = `crm-ci-${Date.now()}`;
const clientEmail = (suffix: string) => `${SUITE_TAG}-${suffix}@example.test`;

const app = express();
app.use(express.json());
app.use('/crm/clients', clientsRouter);

type ClientDto = {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  status: 'ativo' | 'inativo';
  created_at: string;
};

async function seedClient(suffix: string, nome = 'Cliente Teste'): Promise<ClientDto> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('clients')
    .insert({ nome, email: clientEmail(suffix), telefone: '+5561999990000', status: 'ativo' })
    .select('id, nome, email, telefone, status, created_at')
    .single();
  if (error) throw error;
  return data as ClientDto;
}

beforeAll(() => {
  process.env['ADMIN_AUTH_BYPASS'] = 'true';
});

afterAll(async () => {
  const supabase = getSupabaseClient();
  await supabase.from('clients').delete().like('email', `${SUITE_TAG}-%`);

  if (originalBypass === undefined) {
    delete process.env['ADMIN_AUTH_BYPASS'];
  } else {
    process.env['ADMIN_AUTH_BYPASS'] = originalBypass;
  }
});

describe('Suite de integração — PATCH /api/crm/clients/:id (#191 · F19 · RF35, RF36)', () => {
  let client: ClientDto;

  beforeEach(async () => {
    client = await seedClient(`edit-${Math.random().toString(36).slice(2, 8)}`);
  });

  it('AC1: admin autenticado edita dados e recebe 200 atualizado em até 2s (RNF03)', async () => {
    const startedAt = Date.now();
    const res = await request(app)
      .patch(`/crm/clients/${client.id}`)
      .send({ nome: 'Nome Atualizado', telefone: '+5561988887777' })
      .expect(200);
    const elapsedMs = Date.now() - startedAt;

    expect(res.body.id).toBe(client.id);
    expect(res.body.nome).toBe('Nome Atualizado');
    expect(res.body.telefone).toBe('+5561988887777');
    expect(elapsedMs).toBeLessThan(2000);
  });

  it('AC2: status=inativo marca como inativo sem remover do histórico', async () => {
    const res = await request(app)
      .patch(`/crm/clients/${client.id}`)
      .send({ status: 'inativo' })
      .expect(200);

    expect(res.body.status).toBe('inativo');

    // O registro continua existindo (não foi deletado) — preserva o histórico.
    const supabase = getSupabaseClient();
    const { data } = await supabase
      .from('clients')
      .select('id, status')
      .eq('id', client.id)
      .maybeSingle();

    expect(data).not.toBeNull();
    expect((data as { status: string }).status).toBe('inativo');
  });

  it('AC3: token inválido retorna 401 sem expor detalhes internos', async () => {
    const saved = process.env['ADMIN_AUTH_BYPASS'];
    delete process.env['ADMIN_AUTH_BYPASS'];
    try {
      const res = await request(app)
        .patch(`/crm/clients/${client.id}`)
        .send({ nome: 'Não deve aplicar' })
        .expect(401);
      expect(res.body).toEqual({ error: 'Unauthorized' });
    } finally {
      process.env['ADMIN_AUTH_BYPASS'] = saved;
    }
  });

  it('id inexistente retorna 404', async () => {
    const res = await request(app)
      .patch('/crm/clients/00000000-0000-0000-0000-000000000000')
      .send({ nome: 'Fantasma' })
      .expect(404);
    expect(res.body).toHaveProperty('message');
  });

  it('status inválido retorna 400 com { message }', async () => {
    const res = await request(app)
      .patch(`/crm/clients/${client.id}`)
      .send({ status: 'arquivado' })
      .expect(400);
    expect(res.body).toHaveProperty('message');
  });

  it('e-mail inválido retorna 400 com { message }', async () => {
    const res = await request(app)
      .patch(`/crm/clients/${client.id}`)
      .send({ email: 'sem-arroba' })
      .expect(400);
    expect(res.body).toHaveProperty('message');
  });
});
