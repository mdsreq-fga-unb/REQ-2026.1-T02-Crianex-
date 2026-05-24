import type { PageServerLoad } from './$types';
import { apiFetch } from '$lib/api/backend';

export const load: PageServerLoad = async () => {
  try {
    // Basta passar o path relativo. O seu backend.ts cuida do resto!
    const produtosDoBanco = await apiFetch<any[]>('/products');
    
    return {
      produtos: produtosDoBanco
    };
  } catch (error) {
    console.error('[FRONTEND LOAD ERROR]:', error);
    return {
      produtos: [],
      error: 'Não foi possível carregar os produtos em tempo real.'
    };
  }
};