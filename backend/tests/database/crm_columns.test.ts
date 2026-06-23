import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const migrationPath = resolve(
  import.meta.dirname,
  '../../../supabase/migrations/20260622000100_create_crm_columns_table.sql'
);

const migrationSql = readFileSync(migrationPath, 'utf8');

describe('crm_columns migration', () => {
  it('cria a tabela crm_columns com as colunas obrigatórias', () => {
    expect(migrationSql).toContain('create table public.crm_columns');
    expect(migrationSql).toContain('nome text not null');
    expect(migrationSql).toContain('ordem integer not null');
    expect(migrationSql).toContain('is_default boolean default false not null');
    expect(migrationSql).toContain('created_at timestamp with time zone');
  });

  it('garante no máximo 1 coluna default via índice único parcial', () => {
    expect(migrationSql).toContain('create unique index crm_columns_single_default_idx');
    expect(migrationSql).toContain('on public.crm_columns (is_default)');
    expect(migrationSql).toContain('where is_default = true');
  });

  it('garante as invariantes de "≥1 coluna" e "exatamente 1 default" via trigger', () => {
    expect(migrationSql).toContain('public.check_crm_columns_invariants()');
    expect(migrationSql).toContain('deve existir ao menos 1 coluna');
    expect(migrationSql).toContain('deve existir exatamente 1 coluna marcada como is_default');
    expect(migrationSql).toContain('create constraint trigger crm_columns_invariants_on_update');
    expect(migrationSql).toContain('create constraint trigger crm_columns_invariants_on_delete');
    expect(migrationSql).toContain('deferrable initially immediate');
  });

  it('habilita RLS com policy admin-only e revoga acesso de anon', () => {
    expect(migrationSql).toContain('alter table public.crm_columns enable row level security');
    expect(migrationSql).toContain(
      'Permitir leitura e gerenciamento de colunas do CRM para owners'
    );
    expect(migrationSql).toContain('using (public.is_owner(auth.uid()))');
    expect(migrationSql).toContain('with check (public.is_owner(auth.uid()))');
    expect(migrationSql).toContain('revoke all on table public.crm_columns from anon');
  });

  it('faz seed inicial garantindo ao menos 1 coluna default', () => {
    expect(migrationSql).toContain('insert into public.crm_columns (nome, ordem, is_default)');
    expect(migrationSql).toContain("('Novo Lead', 1, true)");
  });
});
