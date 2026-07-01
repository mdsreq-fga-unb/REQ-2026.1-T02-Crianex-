import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { getAuthenticatedAdminSession } from '$lib/server/admin-session';
import { apiFetch } from '$lib/api/backend';

type ProfileData = {
  id: string;
  name: string;
  email: string;
  role: string;
  display_role: string | null;
  status: string;
  phone: string | null;
  bio: string | null;
  avatar_url: string | null;
  permissions: Record<string, string[]> | null;
};

export const load: LayoutServerLoad = async ({ cookies, locals }) => {
  const adminUser = locals.adminUser ?? (await getAuthenticatedAdminSession(cookies))?.user ?? null;

  if (!adminUser) {
    throw redirect(303, '/admin/login');
  }

  const token = cookies.get('crianex_admin_access_token');

  let profile: ProfileData | null = null;
  let unreadCount = 0;
  if (token) {
    // Disparadas em paralelo — são independentes uma da outra, e cada `await`
    // sequencial aqui somava um round-trip inteiro ao tempo do primeiro
    // carregamento do shell admin.
    const [profileResult, notifResult] = await Promise.allSettled([
      apiFetch<ProfileData>('/profile/me', { token }),
      apiFetch<{ unreadCount: number }>('/admin/notifications', { token }),
    ]);

    if (profileResult.status === 'fulfilled') {
      profile = profileResult.value;
    } // fallback to basic session data

    if (notifResult.status === 'fulfilled') {
      unreadCount = notifResult.value.unreadCount ?? 0;
    } // sem permissão / endpoint indisponível → badge fica em 0, não quebra o shell
  }

  return {
    unreadCount,
    adminUser: {
      id: profile?.id ?? adminUser.id ?? '',
      name: profile?.name ?? adminUser.name ?? 'Admin',
      email: profile?.email ?? '',
      role: profile?.role ?? adminUser.role ?? 'member',
      display_role: profile?.display_role ?? null,
      status: profile?.status ?? 'active',
      phone: profile?.phone ?? null,
      bio: profile?.bio ?? null,
      avatar_url: profile?.avatar_url ?? null,
      permissions: profile?.permissions ?? null,
    },
  };
};
