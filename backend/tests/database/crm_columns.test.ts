import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

// Canonical crm_columns schema (F20). The earlier #181 migration
// (20260622000100, nome/ordem) was superseded and removed because it conflicted
// with this one and broke `supabase db reset`. The seed lives in a sibling file.
const migrationPath = resolve(
  import.meta.dirname,
  '../../../supabase/migrations/20260625000100_create_crm_columns.sql'
);
const seedPath = resolve(
  import.meta.dirname,
  '../../../supabase/migrations/20260625000200_seed_crm_default_column.sql'
);

const migrationSql = readFileSync(migrationPath, 'utf8');
const seedSql = readFileSync(seedPath, 'utf8');

describe('crm_columns migration (F20)', () => {
  it('cria a tabela crm_columns com as colunas obrigatórias', () => {
    expect(migrationSql).toContain('CREATE TABLE IF NOT EXISTS public.crm_columns');
    expect(migrationSql).toMatch(/title\s+text\s+NOT NULL/);
    expect(migrationSql).toMatch(/color\s+text\s+NOT NULL DEFAULT '#7f3fe5'/);
    expect(migrationSql).toMatch(/position\s+integer\s+NOT NULL/);
    expect(migrationSql).toMatch(/is_default\s+boolean\s+NOT NULL DEFAULT false/);
    expect(migrationSql).toMatch(/created_at\s+timestamptz\s+NOT NULL/);
    expect(migrationSql).toMatch(/updated_at\s+timestamptz\s+NOT NULL/);
  });

  it('garante no máximo 1 coluna default via índice único parcial', () => {
    expect(migrationSql).toContain('CREATE UNIQUE INDEX IF NOT EXISTS crm_columns_one_default_idx');
    expect(migrationSql).toMatch(/ON public\.crm_columns \(is_default\)/);
    expect(migrationSql).toContain('WHERE is_default = true');
  });

  it('mantém updated_at via trigger moddatetime', () => {
    expect(migrationSql).toContain('CREATE TRIGGER crm_columns_updated_at');
    expect(migrationSql).toMatch(/BEFORE UPDATE ON public\.crm_columns/);
    expect(migrationSql).toContain('extensions.moddatetime(updated_at)');
  });

  it('habilita RLS com policy admin-only (role owner) e grants restritos', () => {
    expect(migrationSql).toContain('ALTER TABLE public.crm_columns ENABLE ROW LEVEL SECURITY');
    expect(migrationSql).toContain('crm_columns_owner_all');
    expect(migrationSql).toContain("'app_metadata' ->> 'role' = 'owner'");
    expect(migrationSql).toContain('GRANT ALL ON public.crm_columns TO service_role');
    expect(migrationSql).toMatch(/GRANT SELECT, INSERT, UPDATE, DELETE ON public\.crm_columns/);
  });

  it('faz seed inicial garantindo ao menos 1 coluna default', () => {
    expect(seedSql).toContain('INSERT INTO public.crm_columns');
    expect(seedSql).toContain("'Novo Lead'");
    expect(seedSql).toMatch(/true/);
    expect(seedSql).toContain('WHERE NOT EXISTS');
  });
});
