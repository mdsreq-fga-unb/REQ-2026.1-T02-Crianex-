import { redirect } from '@sveltejs/kit';
import { apiFetch } from '$lib/api/backend';
import type { PageServerLoad } from './$types';

export type CrmColumn = {
  id: string;
  title: string;
  color: string;
  position: number;
  is_default: boolean;
  entry_hint: string | null;
  exit_hint: string | null;
  created_at: string;
  updated_at: string;
};

export const load: PageServerLoad = async ({ cookies, locals }) => {
  if (!locals.adminUser) throw redirect(303, '/admin/login');

  const token = cookies.get('crianex_admin_access_token');
  if (!token) throw redirect(303, '/admin/login');

  try {
    const columns = await apiFetch<CrmColumn[]>('/admin/crm/columns', { token });
    return { columns };
  } catch (err) {
    const apiError = err as { status?: number; message?: string };
    if (apiError.status === 401) throw redirect(303, '/admin/login');
    if (apiError.status === 403) return { columns: [], forbidden: true };
    return { columns: [], error: apiError.message || 'Erro ao carregar colunas do CRM.' };
  }
};
