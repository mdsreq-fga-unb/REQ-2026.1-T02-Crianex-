-- pgTAP tests for crm_columns table (issue #181 / CP1)
-- Run with: supabase test db
BEGIN;

SELECT plan(21);

-- ── Schema ────────────────────────────────────────────────────────────────────

SELECT has_table('public', 'crm_columns', 'crm_columns table exists');

SELECT has_column('public', 'crm_columns', 'id',         'has id');
SELECT has_column('public', 'crm_columns', 'nome',       'has nome');
SELECT has_column('public', 'crm_columns', 'ordem',      'has ordem');
SELECT has_column('public', 'crm_columns', 'is_default', 'has is_default');
SELECT has_column('public', 'crm_columns', 'created_at', 'has created_at');

SELECT col_not_null('public', 'crm_columns', 'nome',       'nome is NOT NULL');
SELECT col_not_null('public', 'crm_columns', 'ordem',      'ordem is NOT NULL');
SELECT col_not_null('public', 'crm_columns', 'is_default', 'is_default is NOT NULL');
SELECT col_not_null('public', 'crm_columns', 'created_at', 'created_at is NOT NULL');

-- ── RLS & policies ───────────────────────────────────────────────────────────

SELECT ok(
  (SELECT relrowsecurity FROM pg_class
   WHERE relname = 'crm_columns' AND relnamespace = 'public'::regnamespace),
  'RLS is enabled on crm_columns'
);

SELECT ok(
  EXISTS (SELECT 1 FROM pg_policies
          WHERE schemaname = 'public' AND tablename = 'crm_columns'
            AND policyname = 'Permitir leitura e gerenciamento de colunas do CRM para owners'),
  'admin-only policy exists'
);

SELECT ok(
  NOT has_table_privilege('anon', 'public.crm_columns', 'SELECT'),
  'anon does not have SELECT privilege'
);

-- ── Seed ──────────────────────────────────────────────────────────────────────

SELECT ok(
  (SELECT count(*) FROM public.crm_columns) >= 1,
  'seed inicial garante ao menos 1 coluna'
);

SELECT ok(
  (SELECT count(*) FROM public.crm_columns WHERE is_default = true) = 1,
  'seed inicial garante exatamente 1 coluna default'
);

-- ── Invariant: no máximo 1 default (índice único parcial, imediato) ──────────

SELECT throws_ok(
  $$INSERT INTO public.crm_columns (nome, ordem, is_default) VALUES ('Duplicada', 99, true)$$,
  '23505',
  NULL,
  'inserir uma segunda coluna default é rejeitado pelo índice único parcial'
);

-- ── Invariant: exatamente 1 default (trigger, ao final do statement) ─────────

SELECT throws_ok(
  $$UPDATE public.crm_columns SET is_default = false WHERE is_default = true$$,
  NULL,
  'crm_columns: deve existir exatamente 1 coluna marcada como is_default',
  'remover o único default sem substituí-lo é rejeitado pelo trigger'
);

-- Troca de default dentro da mesma transação deve ser permitida
SELECT lives_ok(
  $$UPDATE public.crm_columns
    SET is_default = (nome = 'Em Contato')
    WHERE nome IN ('Novo Lead', 'Em Contato')$$,
  'trocar a coluna default em um único statement é permitido'
);

SELECT ok(
  (SELECT is_default FROM public.crm_columns WHERE nome = 'Em Contato') = true,
  'nova coluna default foi aplicada corretamente'
);

-- ── Invariant: ao menos 1 coluna (trigger) ────────────────────────────────────

SELECT throws_ok(
  $$DELETE FROM public.crm_columns$$,
  NULL,
  'crm_columns: deve existir ao menos 1 coluna',
  'remover todas as colunas é rejeitado pelo trigger'
);

SELECT throws_ok(
  $$DELETE FROM public.crm_columns WHERE is_default = true$$,
  NULL,
  'crm_columns: deve existir exatamente 1 coluna marcada como is_default',
  'remover a coluna default (deixando 0 defaults) é rejeitado pelo trigger'
);

SELECT * FROM finish();
ROLLBACK;
