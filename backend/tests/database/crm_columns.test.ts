import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const migrationPath = resolve(
  import.meta.dirname,
  '../../../supabase/migrations/20260625000100_create_crm_columns.sql'
);

const migrationSql = readFileSync(migrationPath, 'utf8');

describe('crm_columns migration', () => {
  it('cria a tabela crm_columns com as colunas obrigatórias', () => {
    expect(migrationSql).toContain('CREATE TABLE IF NOT EXISTS public.crm_columns');
    expect(migrationSql).toContain('title       text        NOT NULL');
    expect(migrationSql).toContain('position    integer     NOT NULL DEFAULT 0');
    expect(migrationSql).toContain('is_default  boolean     NOT NULL DEFAULT false');
    expect(migrationSql).toContain('created_at  timestamptz NOT NULL DEFAULT now()');
  });

  it('garante no máximo 1 coluna default via índice único parcial', () => {
    expect(migrationSql).toContain('CREATE UNIQUE INDEX IF NOT EXISTS crm_columns_one_default_idx');
    expect(migrationSql).toContain('ON public.crm_columns (is_default)');
    expect(migrationSql).toContain('WHERE is_default = true');
  });

  it('habilita RLS com policy owner-only', () => {
    expect(migrationSql).toContain('ALTER TABLE public.crm_columns ENABLE ROW LEVEL SECURITY');
    expect(migrationSql).toContain('CREATE POLICY "crm_columns_owner_all" ON public.crm_columns');
    expect(migrationSql).toContain("auth.jwt()) -> 'app_metadata' ->> 'role' = 'owner'");
  });

  it('cria trigger de updated_at e índice de position', () => {
    expect(migrationSql).toContain('CREATE TRIGGER crm_columns_updated_at');
    expect(migrationSql).toContain('extensions.moddatetime(updated_at)');
    expect(migrationSql).toContain('CREATE INDEX IF NOT EXISTS crm_columns_position_idx');
  });
});

describe('seed da coluna default do crm_columns', () => {
  const seedPath = resolve(
    import.meta.dirname,
    '../../../supabase/migrations/20260625000200_seed_crm_default_column.sql'
  );
  const seedSql = readFileSync(seedPath, 'utf8');

  it('garante ao menos 1 coluna default via seed', () => {
    expect(seedSql.toLowerCase()).toContain('insert into public.crm_columns');
    expect(seedSql).toContain('is_default');
  });
});
