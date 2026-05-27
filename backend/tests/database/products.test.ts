import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const migrationPath = resolve(
  import.meta.dirname,
  '../../../supabase/migrations/20260523000000_create_products_table.sql'
);

const migrationSql = readFileSync(migrationPath, 'utf8');

describe('products migration', () => {
  it('cria a tabela products com as colunas bilíngues e controles obrigatórios', () => {
    expect(migrationSql).toContain('CREATE TABLE public.products');
    expect(migrationSql).toContain('name_pt TEXT NOT NULL');
    expect(migrationSql).toContain('name_en TEXT NOT NULL');
    expect(migrationSql).toContain('slug TEXT NOT NULL UNIQUE');
    expect(migrationSql).toContain('published BOOLEAN DEFAULT false NOT NULL');
    expect(migrationSql).toContain('display_order INTEGER DEFAULT 0 NOT NULL');
  });

  it('cria índice composto e trigger de updated_at', () => {
    expect(migrationSql).toContain(
      'CREATE INDEX idx_products_published_order ON public.products (published, display_order)'
    );
    expect(migrationSql).toContain('handle_products_updated_at');
    expect(migrationSql).toContain('extensions.moddatetime()');
  });

  it('habilita RLS com as policies corretas', () => {
    expect(migrationSql).toContain('ALTER TABLE public.products ENABLE ROW LEVEL SECURITY');
    expect(migrationSql).toContain('Permitir leitura pública de produtos publicados');
    expect(migrationSql).toContain('USING (published = true)');
    expect(migrationSql).toContain('Permitir modificações apenas para usuários autenticados');
    expect(migrationSql).toContain('TO service_role');
  });

  it('configura o bucket product-images com policies de storage', () => {
    expect(migrationSql).toContain(
      'INSERT INTO storage.buckets (id, name, public, allowed_mime_types, file_size_limit)'
    );
    expect(migrationSql).toContain('product-images');
    expect(migrationSql).toContain('Imagens do produto são publicas para visualização');
    expect(migrationSql).toContain('Apenas usuários autenticados fazem upload de imagens');
  });
});
