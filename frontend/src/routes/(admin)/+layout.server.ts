import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { getAuthenticatedAdminSession } from '$lib/server/admin-session';

export const load: LayoutServerLoad = async ({ cookies, locals }) => {
  const adminUser = locals.adminUser ?? (await getAuthenticatedAdminSession(cookies))?.user ?? null;

  if (!adminUser) {
    throw redirect(303, '/admin/login');
  }

  return {
    adminUser: {
      name: adminUser.name ?? 'Admin',
      role: adminUser.role ?? 'admin',
    },
  };
};
