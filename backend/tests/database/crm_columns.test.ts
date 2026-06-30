import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const migrationsDir = resolve(import.meta.dirname, '../../../supabase/migrations');

// Whitespace é normalizado para que os asserts não dependam do alinhamento das colunas.
const norm = (path: string) =>
  readFileSync(resolve(migrationsDir, path), 'utf8').replace(/\s+/g, ' ');

const tableSql = norm('20260625000100_create_crm_columns.sql');
const seedSql = norm('20260625000200_seed_crm_default_column.sql');

describe('crm_columns migration', () => {
  it('cria a tabela crm_columns com as colunas obrigatórias', () => {
    expect(tableSql).toContain('CREATE TABLE IF NOT EXISTS public.crm_columns');
    expect(tableSql).toContain('title text NOT NULL');
    expect(tableSql).toContain('position integer NOT NULL DEFAULT 0');
    expect(tableSql).toContain('is_default boolean NOT NULL DEFAULT false');
    expect(tableSql).toContain('created_at timestamptz NOT NULL DEFAULT now()');
  });

  it('garante no máximo 1 coluna default via índice único parcial', () => {
    expect(tableSql).toContain('CREATE UNIQUE INDEX IF NOT EXISTS crm_columns_one_default_idx');
    expect(tableSql).toContain('ON public.crm_columns (is_default)');
    expect(tableSql).toContain('WHERE is_default = true');
  });

  it('habilita RLS com policy admin-only (owner via JWT)', () => {
    expect(tableSql).toContain('ALTER TABLE public.crm_columns ENABLE ROW LEVEL SECURITY');
    expect(tableSql).toContain('CREATE POLICY "crm_columns_owner_all" ON public.crm_columns');
    expect(tableSql).toContain("'app_metadata' ->> 'role' = 'owner'");
  });

  it('faz seed inicial garantindo ao menos 1 coluna default', () => {
    expect(seedSql).toContain('INSERT INTO public.crm_columns');
    expect(seedSql).toContain("('Novo Lead',");
    // Só insere quando a tabela está vazia — mantém a invariante de ≥1 default.
    expect(seedSql).toContain('WHERE NOT EXISTS (SELECT 1 FROM public.crm_columns)');
  });
});
