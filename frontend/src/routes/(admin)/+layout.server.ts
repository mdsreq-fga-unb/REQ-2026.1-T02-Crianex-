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
};

export const load: LayoutServerLoad = async ({ cookies, locals }) => {
  const adminUser = locals.adminUser ?? (await getAuthenticatedAdminSession(cookies))?.user ?? null;

  if (!adminUser) {
    throw redirect(303, '/admin/login');
  }

  const token = cookies.get('crianex_admin_access_token');

  let profile: ProfileData | null = null;
  if (token) {
    try {
      profile = await apiFetch<ProfileData>('/profile/me', { token });
    } catch {
      // fallback to basic session data
    }
  }

  return {
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
    },
  };
};
