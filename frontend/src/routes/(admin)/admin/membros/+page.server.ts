import { redirect } from '@sveltejs/kit';
import { apiFetch } from '$lib/api/backend';
import type { PageServerLoad } from './$types';
import type { Member } from '$lib/utils/membros';

export const load: PageServerLoad = async ({ cookies }) => {
  const token = cookies.get('access_token');

  if (!token) {
    throw redirect(303, '/login');
  }

  try {
    const members = await apiFetch<Member[]>('/api/admin/members', { token });
    return { members };
  } catch (err) {
    console.error('[membros load] Failed to fetch members:', err);
    const apiError = err as { status?: number; message?: string };
    if (apiError.status === 401) {
      throw redirect(303, '/login');
    }
    return { members: [], error: apiError.message || 'Erro ao carregar membros do servidor.' };
  }
};
