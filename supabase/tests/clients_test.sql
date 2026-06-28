-- pgTAP tests for clients and client_cards tables (issue #191 / CP1)
-- Run with: supabase test db
BEGIN;

SELECT plan(33);

-- ── Schema: clients ──────────────────────────────────────────────────────────
SELECT has_table('public', 'clients', 'clients table exists');

SELECT has_column('public', 'clients', 'id',         'clients has id');
SELECT has_column('public', 'clients', 'nome',       'clients has nome');
SELECT has_column('public', 'clients', 'email',      'clients has email');
SELECT has_column('public', 'clients', 'telefone',   'clients has telefone');
SELECT has_column('public', 'clients', 'status',     'clients has status');
SELECT has_column('public', 'clients', 'created_at', 'clients has created_at');

SELECT col_not_null('public', 'clients', 'nome',       'clients.nome is NOT NULL');
SELECT col_not_null('public', 'clients', 'email',      'clients.email is NOT NULL');
SELECT col_not_null('public', 'clients', 'status',     'clients.status is NOT NULL');
SELECT col_not_null('public', 'clients', 'created_at', 'clients.created_at is NOT NULL');

-- ── Schema: client_cards ─────────────────────────────────────────────────────
SELECT has_table('public', 'client_cards', 'client_cards table exists');

SELECT has_column('public', 'client_cards', 'id',                'client_cards has id');
SELECT has_column('public', 'client_cards', 'client_id',         'client_cards has client_id');
SELECT has_column('public', 'client_cards', 'column_id',         'client_cards has column_id');
SELECT has_column('public', 'client_cards', 'produto_vinculado', 'client_cards has produto_vinculado');
SELECT has_column('public', 'client_cards', 'responsavel',       'client_cards has responsavel');
SELECT has_column('public', 'client_cards', 'created_at',        'client_cards has created_at');

-- ── Foreign keys ─────────────────────────────────────────────────────────────
SELECT col_is_fk('public', 'client_cards', 'client_id',         'client_cards.client_id is a FK');
SELECT col_is_fk('public', 'client_cards', 'column_id',         'client_cards.column_id is a FK');
SELECT col_is_fk('public', 'client_cards', 'produto_vinculado', 'client_cards.produto_vinculado is a FK');

SELECT fk_ok('public', 'client_cards', 'column_id', 'public', 'crm_columns', 'id',
  'client_cards.column_id references crm_columns(id)');

-- ── RLS enabled ──────────────────────────────────────────────────────────────
SELECT ok(
  (SELECT relrowsecurity FROM pg_class
   WHERE relname = 'clients' AND relnamespace = 'public'::regnamespace),
  'RLS is enabled on clients'
);
SELECT ok(
  (SELECT relrowsecurity FROM pg_class
   WHERE relname = 'client_cards' AND relnamespace = 'public'::regnamespace),
  'RLS is enabled on client_cards'
);

-- ── Policies & privileges (RNF09 — admin-only) ───────────────────────────────
SELECT ok(
  EXISTS (SELECT 1 FROM pg_policies
          WHERE schemaname = 'public' AND tablename = 'clients'
            AND policyname = 'clients_owner_all'),
  'owner-only policy exists on clients'
);
SELECT ok(
  EXISTS (SELECT 1 FROM pg_policies
          WHERE schemaname = 'public' AND tablename = 'client_cards'
            AND policyname = 'client_cards_owner_all'),
  'owner-only policy exists on client_cards'
);

SELECT ok(NOT has_table_privilege('anon', 'public.clients', 'SELECT'),
  'anon has no SELECT on clients');
SELECT ok(NOT has_table_privilege('anon', 'public.client_cards', 'SELECT'),
  'anon has no SELECT on client_cards');

-- ── Constraints ──────────────────────────────────────────────────────────────
SELECT throws_ok(
  $$INSERT INTO public.clients (nome, email, status) VALUES ('T', 'e@e.com', 'invalido')$$,
  '23514',
  NULL,
  'invalid clients.status rejected by CHECK constraint'
);

SELECT col_is_unique('public', 'clients', 'email', 'clients.email has UNIQUE constraint');

SELECT throws_ok(
  $$INSERT INTO public.clients (nome, email) VALUES ('A', 'dup@e.com');
    INSERT INTO public.clients (nome, email) VALUES ('B', 'dup@e.com')$$,
  '23505',
  NULL,
  'duplicate clients.email rejected by UNIQUE constraint'
);

-- RF37: a card with no column_id is routed to the default crm_columns stage.
SELECT lives_ok(
  $$WITH c AS (INSERT INTO public.clients (nome, email) VALUES ('RF37', 'rf37@e.com') RETURNING id)
    INSERT INTO public.client_cards (client_id) SELECT id FROM c$$,
  'inserting a card without column_id succeeds (default stage trigger)'
);

SELECT is(
  (SELECT cc.column_id
   FROM public.client_cards cc
   JOIN public.clients cl ON cl.id = cc.client_id
   WHERE cl.email = 'rf37@e.com'),
  (SELECT id FROM public.crm_columns WHERE is_default = true LIMIT 1),
  'card without column_id lands on the default crm_columns stage (RF37)'
);

SELECT * FROM finish();
ROLLBACK;
