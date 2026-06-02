import { redirect } from '@sveltejs/kit';
import { apiFetch } from '$lib/api/backend';
import type { PageServerLoad } from './$types';
import type { Member } from '$lib/utils/membros';

export const load: PageServerLoad = async ({ cookies, locals }) => {
  if (!locals.adminUser) {
    throw redirect(303, '/admin/login');
  }

  const token = cookies.get('crianex_admin_access_token');

  if (!token) {
    throw redirect(303, '/admin/login');
  }

  try {
    const members = await apiFetch<Member[]>('/api/admin/members', { token });
    return { members };
  } catch (err) {
    console.error('[membros load] Failed to fetch members:', err);
    const apiError = err as { status?: number; message?: string };
    if (apiError.status === 401) {
      throw redirect(303, '/admin/login');
    }
    return { members: [], error: apiError.message || 'Erro ao carregar membros do servidor.' };
  }
};
