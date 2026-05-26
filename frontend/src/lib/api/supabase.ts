import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public';
import { browser } from '$app/environment';

// Cliente público — somente criado no cliente (navegador).
// Durante SSR exportamos `null` para evitar criar o cliente sem as variáveis.
let _supabase = null as ReturnType<typeof createClient> | null;
if (browser && env.PUBLIC_SUPABASE_URL && env.PUBLIC_SUPABASE_ANON_KEY) {
	_supabase = createClient(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY);
}

export const supabase = _supabase;
