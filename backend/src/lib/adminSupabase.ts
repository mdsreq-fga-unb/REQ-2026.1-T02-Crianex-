import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { supabase as inMemorySupabase } from './supabase.js';

let adminSupabaseClient: SupabaseClient | null = null;

export function getAdminSupabase(): SupabaseClient {
  if (adminSupabaseClient) {
    return adminSupabaseClient;
  }

  const supabaseUrl = process.env.PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SECRET_KEY ??
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    // Never serve the in-memory fake in production — it has no RLS and loses data.
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        '[adminSupabase] Supabase URL and secret key are required in production.'
      );
    }
    return inMemorySupabase;
  }

  adminSupabaseClient = createClient(supabaseUrl, supabaseKey);
  return adminSupabaseClient;
}
