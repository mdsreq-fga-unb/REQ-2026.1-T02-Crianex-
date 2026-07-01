import { redirect } from '@sveltejs/kit';
import { apiFetch } from '$lib/api/backend';
import type { PageServerLoad } from './$types';
import type { NotificationEventType } from '$lib/constants/notification-types';

export type NotificationTemplate = {
  id: string;
  tipo_evento: string;
  nome: string;
  conteudo: string;
  color: string;
  is_default: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
};

type TemplatesResponse = { templates: NotificationTemplate[] };
type EventTypesResponse = { eventTypes: NotificationEventType[] };

export const load: PageServerLoad = async ({ cookies, locals }) => {
  if (!locals.adminUser) throw redirect(303, '/admin/login');

  const token = cookies.get('crianex_admin_access_token');
  if (!token) throw redirect(303, '/admin/login');

  try {
    const [templatesData, eventTypesData] = await Promise.all([
      apiFetch<TemplatesResponse>('/admin/notification-templates', { token }),
      apiFetch<EventTypesResponse>('/admin/notification-templates/event-types', { token }),
    ]);
    return {
      templates: templatesData.templates ?? [],
      eventTypes: eventTypesData.eventTypes ?? [],
    };
  } catch (err) {
    const apiError = err as { status?: number; message?: string };
    if (apiError.status === 401) throw redirect(303, '/admin/login');
    if (apiError.status === 403) return { templates: [], eventTypes: [], forbidden: true };
    return {
      templates: [],
      eventTypes: [],
      error: apiError.message || 'Erro ao carregar templates de notificação.',
    };
  }
};
