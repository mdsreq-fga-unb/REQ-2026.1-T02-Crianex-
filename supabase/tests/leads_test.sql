-- pgTAP tests for leads table (issue #85 / CP6)
-- Run with: supabase test db
BEGIN;

SELECT plan(24);

-- ── Schema ────────────────────────────────────────────────────────────────────

SELECT has_table('public', 'leads', 'leads table exists');

SELECT has_column('public', 'leads', 'id',               'has id');
SELECT has_column('public', 'leads', 'name',             'has name');
SELECT has_column('public', 'leads', 'email',            'has email');
SELECT has_column('public', 'leads', 'company',          'has company');
SELECT has_column('public', 'leads', 'product_interest', 'has product_interest');
SELECT has_column('public', 'leads', 'message',          'has message');
SELECT has_column('public', 'leads', 'status',           'has status');
SELECT has_column('public', 'leads', 'ip_hash',          'has ip_hash');
SELECT has_column('public', 'leads', 'created_at',       'has created_at');

-- ── NOT NULL constraints ──────────────────────────────────────────────────────

SELECT col_not_null('public', 'leads', 'name',       'name is NOT NULL');
SELECT col_not_null('public', 'leads', 'email',      'email is NOT NULL');
SELECT col_not_null('public', 'leads', 'message',    'message is NOT NULL');
SELECT col_not_null('public', 'leads', 'ip_hash',    'ip_hash is NOT NULL');
SELECT col_not_null('public', 'leads', 'status',     'status is NOT NULL');
SELECT col_not_null('public', 'leads', 'created_at', 'created_at is NOT NULL');

-- ── RLS & policies ───────────────────────────────────────────────────────────

SELECT ok(
  (SELECT relrowsecurity FROM pg_class
   WHERE relname = 'leads' AND relnamespace = 'public'::regnamespace),
  'RLS is enabled on leads'
);

SELECT ok(
  EXISTS (SELECT 1 FROM pg_policies
          WHERE schemaname = 'public' AND tablename = 'leads'
            AND policyname = 'leads_insert_public'),
  'policy leads_insert_public exists'
);

SELECT ok(
  EXISTS (SELECT 1 FROM pg_policies
          WHERE schemaname = 'public' AND tablename = 'leads'
            AND policyname = 'leads_select_owner'),
  'policy leads_select_owner exists'
);

-- ── Privileges ───────────────────────────────────────────────────────────────

SELECT ok(
   has_table_privilege('anon', 'public.leads', 'INSERT'),
  'anon has INSERT privilege'
);

SELECT ok(
  NOT has_table_privilege('anon', 'public.leads', 'SELECT'),
  'anon does not have SELECT privilege'
);

SELECT ok(
  NOT has_table_privilege('authenticated', 'public.leads', 'SELECT'),
  'authenticated does not have SELECT privilege'
);

-- ── Constraint enforcement ───────────────────────────────────────────────────

SELECT throws_ok(
  $$INSERT INTO leads (name, email, message) VALUES ('T', 'e@e.com', 'msg')$$,
  '23502',
  NULL,
  'ip_hash NOT NULL is enforced'
);

SELECT throws_ok(
  $$INSERT INTO leads (name, email, message, ip_hash, status)
    VALUES ('T', 'e@e.com', 'msg', repeat('a', 64), 'invalid_status')$$,
  '23514',
  NULL,
  'invalid status rejected by CHECK constraint'
);

SELECT * FROM finish();
ROLLBACK;
