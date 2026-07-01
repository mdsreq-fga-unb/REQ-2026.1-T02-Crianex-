-- pgTAP tests for interactions table (F21 / CP1)
-- Run with: supabase test db
BEGIN;

SELECT plan(34);

-- Schema: interactions -------------------------------------------------------
SELECT has_table('public', 'interactions', 'interactions table exists');

SELECT has_column('public', 'interactions', 'id',        'interactions has id');
SELECT has_column('public', 'interactions', 'client_id', 'interactions has client_id');
SELECT has_column('public', 'interactions', 'autor_id',  'interactions has autor_id');
SELECT has_column('public', 'interactions', 'tipo',      'interactions has tipo');
SELECT has_column('public', 'interactions', 'conteudo',  'interactions has conteudo');
SELECT has_column('public', 'interactions', 'data',      'interactions has data');
SELECT has_column('public', 'interactions', 'removed',   'interactions has removed');

SELECT col_not_null('public', 'interactions', 'client_id', 'interactions.client_id is NOT NULL');
SELECT col_not_null('public', 'interactions', 'autor_id',  'interactions.autor_id is NOT NULL');
SELECT col_not_null('public', 'interactions', 'tipo',      'interactions.tipo is NOT NULL');
SELECT col_not_null('public', 'interactions', 'conteudo',  'interactions.conteudo is NOT NULL');
SELECT col_not_null('public', 'interactions', 'data',      'interactions.data is NOT NULL');
SELECT col_not_null('public', 'interactions', 'removed',   'interactions.removed is NOT NULL');

SELECT col_default_is('public', 'interactions', 'removed', 'false',
  'interactions.removed defaults to false');

-- Foreign keys ---------------------------------------------------------------
SELECT col_is_fk('public', 'interactions', 'client_id', 'interactions.client_id is a FK');
SELECT col_is_fk('public', 'interactions', 'autor_id',  'interactions.autor_id is a FK');

SELECT fk_ok('public', 'interactions', 'client_id', 'public', 'clients', 'id',
  'interactions.client_id references clients(id)');
SELECT fk_ok('public', 'interactions', 'autor_id', 'public', 'profiles', 'id',
  'interactions.autor_id references profiles(id)');

-- Index and default listing view --------------------------------------------
SELECT ok(
  EXISTS (SELECT 1 FROM pg_indexes
          WHERE schemaname = 'public' AND tablename = 'interactions'
            AND indexname = 'interactions_client_data_idx'),
  'partial index for active client timeline exists'
);

SELECT has_view('public', 'active_interactions', 'active_interactions view exists');

-- RLS enabled ----------------------------------------------------------------
SELECT ok(
  (SELECT relrowsecurity FROM pg_class
   WHERE relname = 'interactions' AND relnamespace = 'public'::regnamespace),
  'RLS is enabled on interactions'
);

-- Policies & privileges (RNF09 - admin-only) --------------------------------
SELECT ok(
  EXISTS (SELECT 1 FROM pg_policies
          WHERE schemaname = 'public' AND tablename = 'interactions'
            AND policyname = 'interactions_owner_all'),
  'owner-only policy exists on interactions'
);

SELECT ok(NOT has_table_privilege('anon', 'public.interactions', 'SELECT'),
  'anon has no SELECT on interactions');
SELECT ok(NOT has_table_privilege('anon', 'public.active_interactions', 'SELECT'),
  'anon has no SELECT on active_interactions');
SELECT ok(has_table_privilege('authenticated', 'public.interactions', 'SELECT'),
  'authenticated has SELECT on interactions');
SELECT ok(has_table_privilege('authenticated', 'public.interactions', 'UPDATE'),
  'authenticated has UPDATE on interactions for soft-delete');
SELECT ok(NOT has_table_privilege('authenticated', 'public.interactions', 'DELETE'),
  'authenticated has no DELETE on interactions');

-- Fixtures -------------------------------------------------------------------
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000002101',
  'authenticated',
  'authenticated',
  'f21-owner@crianex.test',
  'test-password-hash',
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"F21 Owner"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);

UPDATE public.profiles
SET name = 'F21 Owner', role = 'owner', status = 'active'
WHERE id = '00000000-0000-0000-0000-000000002101';

INSERT INTO public.clients (id, nome, email)
VALUES ('00000000-0000-0000-0000-000000002102', 'Cliente F21', 'cliente-f21@crianex.test');

-- Constraints ----------------------------------------------------------------
SELECT throws_ok(
  $$INSERT INTO public.interactions (client_id, autor_id, tipo, conteudo)
    VALUES (gen_random_uuid(), gen_random_uuid(), 'call', 'x')$$,
  '23503',
  NULL,
  'invalid interaction FKs are rejected'
);

SELECT throws_ok(
  $$INSERT INTO public.interactions (client_id, autor_id, tipo, conteudo)
    VALUES (
      '00000000-0000-0000-0000-000000002102',
      '00000000-0000-0000-0000-000000002101',
      '',
      'x'
    )$$,
  '23514',
  NULL,
  'empty interactions.tipo rejected by CHECK constraint'
);

SELECT throws_ok(
  $$INSERT INTO public.interactions (client_id, autor_id, tipo, conteudo)
    VALUES (
      '00000000-0000-0000-0000-000000002102',
      '00000000-0000-0000-0000-000000002101',
      'call',
      ''
    )$$,
  '23514',
  NULL,
  'empty interactions.conteudo rejected by CHECK constraint'
);

-- Soft-delete behavior -------------------------------------------------------
INSERT INTO public.interactions (id, client_id, autor_id, tipo, conteudo)
VALUES (
  '00000000-0000-0000-0000-000000002103',
  '00000000-0000-0000-0000-000000002102',
  '00000000-0000-0000-0000-000000002101',
  'call',
  'Primeiro contato'
);

SELECT is(
  (SELECT count(*)::integer FROM public.active_interactions
   WHERE client_id = '00000000-0000-0000-0000-000000002102'),
  1,
  'active_interactions lists non-removed interactions'
);

UPDATE public.interactions
SET removed = true
WHERE id = '00000000-0000-0000-0000-000000002103';

SELECT is(
  (SELECT count(*)::integer FROM public.active_interactions
   WHERE client_id = '00000000-0000-0000-0000-000000002102'),
  0,
  'active_interactions hides soft-deleted interactions'
);

SELECT is(
  (SELECT count(*)::integer FROM public.interactions
   WHERE id = '00000000-0000-0000-0000-000000002103' AND removed = true),
  1,
  'soft-deleted interaction remains in interactions for audit'
);

SELECT * FROM finish();
ROLLBACK;
