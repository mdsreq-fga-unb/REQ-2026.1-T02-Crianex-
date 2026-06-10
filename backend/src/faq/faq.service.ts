import { getSupabaseClient } from '../config/supabase.js';

// --- Types ---

export type FaqCategory = {
  id: string;
  label_pt: string;
  label_en: string;
  product_id: string | null;
  display_order: number;
  slug: string;
  is_protected: boolean;
  created_at: string;
};

export type FaqCategoryInput = {
  label_pt: string;
  label_en: string;
  product_id?: string | null;
  display_order?: number;
};

export type FaqArticle = {
  id: string;
  title_pt: string;
  title_en: string;
  body_pt: string;
  body_en: string;
  category_id: string;
  published: boolean;
  published_at: string | null;
  helpful_count: number;
  not_helpful_count: number;
  slug: string;
  created_at: string;
  updated_at: string;
};

export type FaqArticleInput = {
  title_pt: string;
  title_en?: string;
  body_pt?: string;
  body_en?: string;
  category_id: string;
  published?: boolean;
};

export type FaqArticleUpdateInput = Partial<FaqArticleInput> & { published?: boolean };

export class FaqServiceError extends Error {
  constructor(
    message: string,
    public readonly code: 'NOT_FOUND' | 'PUBLISHED' | 'SLUG_CONFLICT' | 'PROTECTED'
  ) {
    super(message);
    this.name = 'FaqServiceError';
  }
}

// --- Internal helpers ---

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function generateUniqueSlug(
  table: 'faq_articles' | 'faq_categories',
  base: string,
  excludeId?: string
): Promise<string> {
  const supabase = getSupabaseClient();
  const slugBase = slugify(base);
  let candidate = slugBase;
  let counter = 1;

  for (;;) {
    let query = supabase.from(table).select('id').eq('slug', candidate);
    if (excludeId) query = query.neq('id', excludeId);
    const { data } = await query.maybeSingle();
    if (!data) return candidate;
    candidate = `${slugBase}-${counter++}`;
  }
}

function handleSupabaseError(err: unknown, entity: string): never {
  const e = err as { code?: string };
  if (e.code === 'PGRST116') throw new FaqServiceError(`${entity} não encontrado(a).`, 'NOT_FOUND');
  if (e.code === '23505')
    throw new FaqServiceError('Conflito de slug. Use um título diferente.', 'SLUG_CONFLICT');
  throw err;
}

// --- Categories ---

export async function listCategories(): Promise<FaqCategory[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('faq_categories')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data as FaqCategory[];
}

export async function createCategory(input: FaqCategoryInput): Promise<FaqCategory> {
  const supabase = getSupabaseClient();
  const slug = await generateUniqueSlug('faq_categories', input.label_pt);

  const { data, error } = await supabase
    .from('faq_categories')
    .insert([
      {
        label_pt: input.label_pt,
        label_en: input.label_en,
        product_id: input.product_id ?? null,
        display_order: input.display_order ?? 0,
        slug,
      },
    ])
    .select()
    .single();

  if (error) handleSupabaseError(error, 'Categoria');
  return data as FaqCategory;
}

export async function updateCategory(
  id: string,
  input: Partial<FaqCategoryInput>
): Promise<FaqCategory> {
  const supabase = getSupabaseClient();

  const payload: Record<string, unknown> = { ...input };
  if (input.label_pt) {
    payload['slug'] = await generateUniqueSlug('faq_categories', input.label_pt, id);
  }

  const { data, error } = await supabase
    .from('faq_categories')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) handleSupabaseError(error, 'Categoria');
  return data as FaqCategory;
}

export async function deleteCategory(id: string): Promise<void> {
  const supabase = getSupabaseClient();

  const { data: category, error: fetchError } = await supabase
    .from('faq_categories')
    .select('is_protected')
    .eq('id', id)
    .maybeSingle();

  if (fetchError) throw fetchError;
  if (!category) throw new FaqServiceError('Categoria não encontrada.', 'NOT_FOUND');
  if (category.is_protected) {
    throw new FaqServiceError('Categoria protegida não pode ser removida.', 'PROTECTED');
  }

  // Reassigna artigos órfãos para a categoria "Geral" antes de deletar
  const { data: geral, error: geralError } = await supabase
    .from('faq_categories')
    .select('id')
    .eq('slug', 'geral')
    .maybeSingle();

  if (geralError) throw geralError;
  if (!geral) throw new Error('Categoria "Geral" não encontrada. Execute as migrações pendentes.');

  const { error: reassignError } = await supabase
    .from('faq_articles')
    .update({ category_id: geral.id })
    .eq('category_id', id);

  if (reassignError) throw reassignError;

  const { error } = await supabase.from('faq_categories').delete().eq('id', id);
  if (error) throw error;
}

// --- Articles ---

export async function listArticles(categoryId?: string): Promise<FaqArticle[]> {
  const supabase = getSupabaseClient();
  let query = supabase.from('faq_articles').select('*').order('created_at', { ascending: false });

  if (categoryId) query = query.eq('category_id', categoryId);

  const { data, error } = await query;
  if (error) throw error;
  return data as FaqArticle[];
}

export async function createArticle(input: FaqArticleInput): Promise<FaqArticle> {
  const supabase = getSupabaseClient();
  const slug = await generateUniqueSlug('faq_articles', input.title_pt);

  const { data, error } = await supabase
    .from('faq_articles')
    .insert([
      {
        title_pt: input.title_pt,
        title_en: input.title_en ?? '',
        body_pt: input.body_pt ?? '',
        body_en: input.body_en ?? '',
        category_id: input.category_id,
        published: input.published ?? false,
        slug,
      },
    ])
    .select()
    .single();

  if (error) handleSupabaseError(error, 'Artigo');
  return data as FaqArticle;
}

export async function updateArticle(id: string, input: FaqArticleUpdateInput): Promise<FaqArticle> {
  const supabase = getSupabaseClient();

  const payload: Record<string, unknown> = { ...input };

  // Regenerate slug when title_pt changes (AC: slug must reflect current title)
  if (input.title_pt) {
    payload['slug'] = await generateUniqueSlug('faq_articles', input.title_pt, id);
  }

  const { data, error } = await supabase
    .from('faq_articles')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) handleSupabaseError(error, 'Artigo');
  return data as FaqArticle;
}

export async function deleteArticle(id: string): Promise<void> {
  const supabase = getSupabaseClient();

  const { data: article, error: fetchError } = await supabase
    .from('faq_articles')
    .select('published')
    .eq('id', id)
    .maybeSingle();

  if (fetchError) throw fetchError;
  if (!article) throw new FaqServiceError('Artigo não encontrado.', 'NOT_FOUND');
  // AC: bloquear deleção se artigo estiver publicado → 409
  if (article.published) {
    throw new FaqServiceError(
      'Artigo publicado não pode ser deletado. Despublique-o primeiro.',
      'PUBLISHED'
    );
  }

  const { error } = await supabase.from('faq_articles').delete().eq('id', id);
  if (error) throw error;
}

export type FaqPublicArticle = {
  id: string;
  title_pt: string;
  title_en: string;
  body_pt: string;
  body_en: string;
  slug: string;
  helpful_count: number;
  not_helpful_count: number;
  published_at: string | null;
  category: {
    id: string;
    slug: string;
    label_pt: string;
    label_en: string;
    display_order: number;
  };
};

export async function listPublishedArticles(categorySlug?: string): Promise<FaqPublicArticle[]> {
  const supabase = getSupabaseClient();

  let query = supabase
    .from('faq_articles')
    .select(
      `
      id,
      title_pt,
      title_en,
      body_pt,
      body_en,
      slug,
      helpful_count,
      not_helpful_count,
      published_at,
      category:faq_categories (
        id,
        slug,
        label_pt,
        label_en,
        display_order
      )
    `
    )
    .eq('published', true)
    .order('published_at', { ascending: false });

  if (categorySlug) {
    const { data: cat } = await supabase
      .from('faq_categories')
      .select('id')
      .eq('slug', categorySlug)
      .maybeSingle();

    if (cat) {
      query = query.eq('category_id', cat.id);
    } else {
      return [];
    }
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as unknown as FaqPublicArticle[];
}