import { apiFetch } from '$lib/api/backend';
import type { PageServerLoad } from './$types';

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

export const load: PageServerLoad = async () => {
  try {
    const [articles, categories] = await Promise.all([
      apiFetch<FaqArticle[]>('/public/faq/articles'),
      apiFetch<FaqCategory[]>('/public/faq/categories'),
    ]);
    return { articles, categories };
  } catch (err) {
    console.error('[faq load] Failed to fetch FAQ data:', err);
    return { articles: [], categories: [], error: 'Erro ao carregar a base de conhecimento.' };
  }
};
