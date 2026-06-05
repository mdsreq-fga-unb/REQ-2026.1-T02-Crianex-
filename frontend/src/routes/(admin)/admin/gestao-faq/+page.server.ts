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
  is_protected: boolean;
  created_at: string;
};

export type Product = {
  id: string;
  name_pt: string;
  name_en: string;
  slug: string;
  published: boolean;
  display_order: number;
  icon_text: string | null;
  color: string | null;
};

export const load: PageServerLoad = async ({ cookies }) => {
  const token = cookies.get('crianex_admin_access_token');

  try {
    const [articles, categories, products] = await Promise.all([
      apiFetch<FaqArticle[]>('/admin/faq/articles', { token }),
      apiFetch<FaqCategory[]>('/admin/faq/categories', { token }),
      apiFetch<Product[]>('/admin/products', { token }),
    ]);
    return { articles, categories, products };
  } catch (err) {
    console.error('[gestao-faq load] Failed to fetch FAQ data:', err);
    const apiError = err as { status?: number; message?: string };
    if (apiError.status === 401) {
      throw redirect(303, '/admin/login');
    }
    return {
      articles: [],
      categories: [],
      products: [],
      error: apiError.message || 'Erro ao carregar dados do servidor.',
    };
  }
};
