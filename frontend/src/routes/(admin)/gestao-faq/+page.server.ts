import { redirect } from '@sveltejs/kit';
import { apiFetch } from '$lib/api/backend';

import type { PageServerLoad } from './$types';

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

export type FaqCategory = {
  id: string;
  label_pt: string;
  label_en: string;
  product_id: string | null;
  display_order: number;
  slug: string;
  created_at: string;
};

export const load: PageServerLoad = async ({ cookies }) => {
  const token = cookies.get('crianex_admin_access_token');

  try {
    const [articles, categories] = await Promise.all([
      apiFetch<FaqArticle[]>('/admin/faq/articles', { token }),
      apiFetch<FaqCategory[]>('/admin/faq/categories', { token }),
    ]);
    return { articles, categories };
  } catch (err) {
    console.error('[gestao-faq load] Failed to fetch FAQ data:', err);
    const apiError = err as { status?: number; message?: string };
    if (apiError.status === 401) {
      throw redirect(303, '/admin/login');
    }
    return {
      articles: [],
      categories: [],
      error: apiError.message || 'Erro ao carregar dados do servidor.',
    };
  }
};
