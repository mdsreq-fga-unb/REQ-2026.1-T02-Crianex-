import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  const oauthError = url.searchParams.get('error') || url.searchParams.get('error_description');

  if (oauthError) {
    throw redirect(
      303,
      `/admin/login?error=${encodeURIComponent('Autenticação com Google cancelada ou falhou.')}`
    );
  }

  return {};
};
