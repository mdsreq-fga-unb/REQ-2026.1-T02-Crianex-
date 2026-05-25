import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let adminSupabaseClient: SupabaseClient | null = null;

export function getAdminSupabase(): SupabaseClient {
  if (adminSupabaseClient) {
    return adminSupabaseClient;
  }

  const supabaseUrl = process.env.PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? '';
  const supabaseKey =
    process.env.SUPABASE_SECRET_KEY ??
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SERVICE_ROLE_KEY ??
    '';

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Variáveis de ambiente do Supabase ausentes. Verifique PUBLIC_SUPABASE_URL e SUPABASE_SECRET_KEY.');
  }

  adminSupabaseClient = createClient(supabaseUrl, supabaseKey);
  return adminSupabaseClient;
}