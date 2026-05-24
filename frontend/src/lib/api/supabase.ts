import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public';

// Cliente público — somente leitura de dados sem RLS restriction
// Para operações privilegiadas use o service role no backend (Express)
export const supabase = createClient(
  env.PUBLIC_SUPABASE_URL ?? '',
  env.PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? ''
);
