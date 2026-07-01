import { redirect } from '@sveltejs/kit';
import { apiFetch } from '$lib/api/backend';
import type { PageServerLoad } from './$types';

export type NotificationTemplate = {
  id: string;
  tipo_evento: string;
  nome: string;
  conteudo: string;
  is_default: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
};

type TemplatesResponse = { templates: NotificationTemplate[] };

export const load: PageServerLoad = async ({ cookies, locals }) => {
  if (!locals.adminUser) throw redirect(303, '/admin/login');

  const token = cookies.get('crianex_admin_access_token');
  if (!token) throw redirect(303, '/admin/login');

  try {
    const data = await apiFetch<TemplatesResponse>('/admin/notification-templates', { token });
    return { templates: data.templates ?? [] };
  } catch (err) {
    const apiError = err as { status?: number; message?: string };
    if (apiError.status === 401) throw redirect(303, '/admin/login');
    if (apiError.status === 403) return { templates: [], forbidden: true };
    return {
      templates: [],
      error: apiError.message || 'Erro ao carregar templates de notificação.',
    };
  }
};
