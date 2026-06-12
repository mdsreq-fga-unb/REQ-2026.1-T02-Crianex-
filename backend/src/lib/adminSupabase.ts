import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { supabase } from './supabase.js';

let adminSupabaseClient: SupabaseClient | null = null;

export function getAdminSupabase(): SupabaseClient {
  // In production, always use a dedicated service-role client with proper server options.
  if (process.env.NODE_ENV === 'production') {
    if (adminSupabaseClient) return adminSupabaseClient;

    const supabaseUrl = process.env.PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SECRET_KEY ??
      process.env.SUPABASE_SERVICE_ROLE_KEY ??
      process.env.SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('[adminSupabase] Supabase URL and secret key are required in production.');
    }

    adminSupabaseClient = createClient(supabaseUrl, supabaseKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    return adminSupabaseClient;
  }

  // In dev/test: reuse the lib/supabase.ts singleton, which already handles
  // the ping-and-fallback logic (real Supabase when reachable, in-memory otherwise).
  // This ensures tests work consistently whether or not a local Supabase instance
  // is running, and avoids creating a separate real client that bypasses the fallback.
  return supabase;
}
