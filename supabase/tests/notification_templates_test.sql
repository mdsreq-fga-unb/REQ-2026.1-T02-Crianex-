-- pgTAP tests for notification_templates table (F08 · issue #180, sub-issue #201)
-- Run with: supabase test db
BEGIN;

SELECT plan(19);

-- ── Schema: notification_templates ──────────────────────────────────────────────
SELECT has_table('public', 'notification_templates', 'notification_templates table exists');

SELECT has_column('public', 'notification_templates', 'id',          'has id');
SELECT has_column('public', 'notification_templates', 'tipo_evento', 'has tipo_evento');
SELECT has_column('public', 'notification_templates', 'nome',        'has nome');
SELECT has_column('public', 'notification_templates', 'conteudo',    'has conteudo');
SELECT has_column('public', 'notification_templates', 'is_default',  'has is_default');
SELECT has_column('public', 'notification_templates', 'active',      'has active');

SELECT col_not_null('public', 'notification_templates', 'tipo_evento', 'tipo_evento is NOT NULL');
SELECT col_not_null('public', 'notification_templates', 'nome',        'nome is NOT NULL');
SELECT col_not_null('public', 'notification_templates', 'conteudo',    'conteudo is NOT NULL');

SELECT col_default_is('public', 'notification_templates', 'active', 'true',
  'active defaults to true');
SELECT col_default_is('public', 'notification_templates', 'is_default', 'false',
  'is_default defaults to false');

-- ── RLS enabled ──────────────────────────────────────────────────────────────────
SELECT ok(
  (SELECT relrowsecurity FROM pg_class
   WHERE relname = 'notification_templates' AND relnamespace = 'public'::regnamespace),
  'RLS is enabled on notification_templates'
);

-- ── Policy & privileges (RNF09 — admin-only) ─────────────────────────────────────
SELECT ok(
  EXISTS (SELECT 1 FROM pg_policies
          WHERE schemaname = 'public' AND tablename = 'notification_templates'
            AND policyname = 'notification_templates_owner_all'),
  'owner-only policy exists on notification_templates'
);

SELECT ok(NOT has_table_privilege('anon', 'public.notification_templates', 'SELECT'),
  'anon has no SELECT on notification_templates');
SELECT ok(has_table_privilege('authenticated', 'public.notification_templates', 'INSERT'),
  'authenticated has INSERT on notification_templates');

-- ── Constraints ───────────────────────────────────────────────────────────────────
SELECT throws_ok(
  $$INSERT INTO public.notification_templates (tipo_evento, nome, conteudo)
    VALUES ('', 'x', 'y')$$,
  '23514',
  NULL,
  'empty tipo_evento rejected by CHECK constraint'
);

-- ── Duplicidade (RF15): no máximo 1 ativo por tipo_evento ────────────────────────
INSERT INTO public.notification_templates (tipo_evento, nome, conteudo)
VALUES ('novo_lead', 'Novo lead', 'Um novo lead chegou.');

SELECT throws_ok(
  $$INSERT INTO public.notification_templates (tipo_evento, nome, conteudo)
    VALUES ('novo_lead', 'Duplicado', 'Outro texto')$$,
  '23505',
  NULL,
  'segundo template ativo para o mesmo tipo_evento é rejeitado'
);

-- inativar o template libera o tipo_evento para um novo ativo
UPDATE public.notification_templates SET active = false WHERE tipo_evento = 'novo_lead';

INSERT INTO public.notification_templates (tipo_evento, nome, conteudo)
VALUES ('novo_lead', 'Novo lead v2', 'Texto atualizado.');

SELECT is(
  (SELECT count(*)::int FROM public.notification_templates
   WHERE tipo_evento = 'novo_lead' AND active = true),
  1,
  'após inativar o antigo, um novo template ativo pode ser criado para o mesmo evento'
);

SELECT * FROM finish();
ROLLBACK;
