import { redirect } from '@sveltejs/kit';
import { apiFetch } from '$lib/api/backend';
import type { PageServerLoad } from './$types';

export type FaqArticle = {
  id: string;
  title_pt: string;
  category: string;
  status: 'published' | 'draft';
  ratings_positive: number;
  ratings_negative: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export const load: PageServerLoad = async ({ cookies, locals }) => {
  if (!locals.adminUser) {
    throw redirect(303, '/admin/login');
  }

  const token = cookies.get('crianex_admin_access_token');

  if (!token) {
    throw redirect(303, '/admin/login');
  }

  try {
    const articles = await apiFetch<FaqArticle[]>('/api/admin/faq', { token });
    return { articles };
  } catch (err) {
    console.error('[gestao-faq load] Failed to fetch FAQ articles:', err);
    const apiError = err as { status?: number; message?: string };
    if (apiError.status === 401) {
      throw redirect(303, '/admin/login');
    }
    return { articles: [], error: apiError.message || 'Erro ao carregar artigos do servidor.' };
  }
};
