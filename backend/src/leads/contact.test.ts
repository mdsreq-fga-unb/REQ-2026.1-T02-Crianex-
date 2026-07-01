import { afterAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import express from 'express';
import { contactController } from './leads.controller.js';
import { buildNotificationContent } from './leads.service.js';
import { supabase } from '../lib/supabase.js';

// E-mails únicos por execução: isolam as linhas criadas e permitem limpeza
// determinística (clients tem ON DELETE CASCADE para client_cards no banco real).
const RUN = Date.now();
const OK_EMAIL = `lead-ok-${RUN}@example.com`;
const ROLLBACK_EMAIL = `lead-rollback-${RUN}@example.com`;

const app = express();
app.use(express.json());
app.post('/public/contact', contactController);

const validBody = {
  name: 'Ana Lead',
  email: OK_EMAIL,
  message: 'Tenho interesse na plataforma.',
  company: 'Acme',
  product_interest: 'avali',
};

afterAll(async () => {
  // interactions.client_id é ON DELETE RESTRICT: precisa limpar antes dos clients.
  const { data: leftoverClients } = await supabase
    .from('clients')
    .select('id')
    .in('email', [OK_EMAIL, ROLLBACK_EMAIL]);
  const clientIds = (leftoverClients as { id: string }[] | null)?.map((c) => c.id) ?? [];
  if (clientIds.length) {
    await supabase.from('interactions').delete().in('client_id', clientIds);
  }
  await supabase.from('clients').delete().eq('email', OK_EMAIL);
  await supabase.from('clients').delete().eq('email', ROLLBACK_EMAIL);
  await supabase
    .from('notifications')
    .delete()
    .eq('conteudo', buildNotificationContent({ ...validBody }));
});

describe('POST /api/public/contact — captação de lead em transação ACID (#192)', () => {
  it('cria client + client_card (coluna default) + notification e retorna 201', async () => {
    await request(app).post('/public/contact').send(validBody).expect(201);

    // client criado
    const { data: clients } = await supabase
      .from('clients')
      .select('id, nome, email')
      .eq('email', OK_EMAIL);
    expect(clients).toHaveLength(1);
    const clientId = (clients as { id: string }[])[0]!.id;

    // card criado na coluna default do funil (RF37)
    const { data: cards } = await supabase
      .from('client_cards')
      .select('id, client_id, column_id')
      .eq('client_id', clientId);
    expect((cards as unknown[]).length).toBeGreaterThanOrEqual(1);

    const { data: defaultCol } = await supabase
      .from('crm_columns')
      .select('id')
      .eq('is_default', true)
      .maybeSingle();
    expect((cards as { column_id: string }[])[0]!.column_id).toBe(
      (defaultCol as unknown as { id: string }).id
    );

    // notification do novo lead, não lida
    const { data: notifs } = await supabase
      .from('notifications')
      .select('id, tipo, conteudo, status')
      .eq('tipo', 'novo_lead');
    const mine = (notifs as { conteudo: string; status: string }[]).filter((n) =>
      n.conteudo.includes(OK_EMAIL)
    );
    expect(mine).toHaveLength(1);
    expect(mine[0]!.status).toBe('unread');

    // mensagem do formulário vira a interação inicial do histórico do lead
    const { data: rawInteractions } = await supabase
      .from('interactions')
      .select('tipo, conteudo, autor_id')
      .eq('client_id', clientId);
    const interactions = rawInteractions as
      | { tipo: string; conteudo: string; autor_id: string | null }[]
      | null;
    expect(interactions).toHaveLength(1);
    expect(interactions![0]!.tipo).toBe('formulario');
    expect(interactions![0]!.conteudo).toBe(validBody.message);
    expect(interactions![0]!.autor_id).toBeNull();
  });

  it('rollback: falha em qualquer etapa não deixa linha parcial', async () => {
    // conteudo vazio viola o CHECK de notifications. No banco real o client e o
    // card são inseridos antes e sofrem rollback junto; no fake a validação
    // antecede qualquer escrita. Em ambos: nada parcial deve persistir.
    const { error } = await supabase.rpc('capture_lead', {
      p_nome: 'Rollback Lead',
      p_email: ROLLBACK_EMAIL,
      p_conteudo: '',
    } as never);
    expect(error).not.toBeNull();

    const { data: clients } = await supabase
      .from('clients')
      .select('id')
      .eq('email', ROLLBACK_EMAIL);
    expect(clients).toHaveLength(0);
  });

  it('honeypot preenchido retorna 200 sem persistir lead', async () => {
    const email = `honeypot-${RUN}@example.com`;
    await request(app)
      .post('/public/contact')
      .send({ ...validBody, email, website: 'http://spam.bot' })
      .expect(200);

    const { data: clients } = await supabase.from('clients').select('id').eq('email', email);
    expect(clients).toHaveLength(0);
  });

  it('campos obrigatórios inválidos retornam 422 sem persistir', async () => {
    const res = await request(app)
      .post('/public/contact')
      .send({ name: '', email: 'invalido', message: '' })
      .expect(422);
    expect(Array.isArray(res.body.errors)).toBe(true);
  });
});
