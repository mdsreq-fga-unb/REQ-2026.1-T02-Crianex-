import type { ServerLoad as PageServerLoad } from '@sveltejs/kit';
import { apiFetch } from '$lib/api/backend';

export const load: PageServerLoad = async () => {
  try {
    // Carrega produtos (o endpoint atual retorna todos, incluindo rascunhos)
    const produtosDoBanco = await apiFetch<any[]>('/products');

    return {
      produtos: produtosDoBanco,
    };
  } catch (error) {
    console.error('[FRONTEND LOAD ERROR]:', error);
    return {
      produtos: [],
      error: 'Não foi possível carregar os produtos em tempo real.',
    };
  }
};
