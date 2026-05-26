import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

export type SupabaseConfig = {
  url: string;
  serviceRoleKey: string;
  anonKey: string;
};

export function getSupabaseConfig(): SupabaseConfig {
  const url = process.env['SUPABASE_URL'] ?? process.env['PUBLIC_SUPABASE_URL'] ?? '';
  const serviceRoleKey = process.env['SUPABASE_SECRET_KEY'] ?? '';
  const anonKey = process.env['PUBLIC_SUPABASE_PUBLISHABLE_KEY'] ?? '';

  if (!url || !serviceRoleKey || !anonKey) {
    throw new Error('Supabase environment variables are not configured');
  }

  return { url, serviceRoleKey, anonKey };
}

export function getSupabaseClient(): SupabaseClient {
  if (supabaseClient) {
    return supabaseClient;
  }

  const { url, serviceRoleKey } = getSupabaseConfig();

  supabaseClient = createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return supabaseClient;
}
