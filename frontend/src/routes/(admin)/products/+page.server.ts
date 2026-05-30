import type { PageServerLoad } from './$types';
import { apiFetch } from '$lib/api/backend';

type Product = {
  id: string;
  name_pt: string;
  name_en: string;
  slug: string;
  tagline_pt?: string | null;
  tagline_en?: string | null;
  description_pt?: string | null;
  description_en?: string | null;
  category_pt?: string | null;
  category_en?: string | null;
  icon_text?: string | null;
  color?: string | null;
  image_url?: string | null;
  published: boolean;
  display_order?: number | null;
  updated_at?: string | null;
};

export const load: PageServerLoad = async () => {
  try {
    const produtosDoBanco = await apiFetch<Product[]>('/products/admin');
    return { produtos: produtosDoBanco };
  } catch (error) {
    console.error('[FRONTEND LOAD ERROR]:', error);
    return {
      produtos: [] as Product[],
      error: 'Não foi possível carregar os produtos em tempo real.',
    };
  }
};
