import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

function readSupabaseConfig() {
  const url = process.env['PUBLIC_SUPABASE_URL'] ?? process.env['SUPABASE_URL'] ?? '';
  const serviceRoleKey =
    process.env['SUPABASE_SECRET_KEY'] ?? process.env['SUPABASE_SERVICE_ROLE_KEY'] ?? '';

  if (!url || !serviceRoleKey) {
    throw new Error('Supabase environment variables are not configured');
  }

  return { url, serviceRoleKey };
}

export function getSupabaseClient(): SupabaseClient {
  if (supabaseClient) {
    return supabaseClient;
  }

  const { url, serviceRoleKey } = readSupabaseConfig();

  supabaseClient = createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return supabaseClient;
}
