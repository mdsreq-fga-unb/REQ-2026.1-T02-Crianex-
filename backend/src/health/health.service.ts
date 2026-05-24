import { getSupabaseClient } from '../config/supabase.js';

export type HealthResponse = {
  status: 'ok';
  supabase: 'connected';
};

export async function checkHealth(): Promise<HealthResponse> {
  const supabase = getSupabaseClient();

  const { error } = await supabase.from('profiles').select('id').limit(1);

  if (error) {
    throw new Error(`Supabase connection failed: ${error.message}`);
  }

  return {
    status: 'ok',
    supabase: 'connected',
  };
}
