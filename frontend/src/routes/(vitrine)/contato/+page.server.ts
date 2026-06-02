import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public';
import type { ServerLoad as PageServerLoad } from '@sveltejs/kit';
import type { Product } from './contact';

export const load: PageServerLoad = async ({ fetch }) => {
  const url = env.PUBLIC_SUPABASE_URL;
  const key = env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) return { products: [] };

  const supabase = createClient(url, key, {
    global: { fetch },
    auth: { persistSession: false },
  });

  const { data } = await supabase
    .from('products')
    .select('id, slug, name_pt, name_en, category_pt, category_en')
    .eq('published', true)
    .order('display_order');

  return { products: (data ?? []) as Product[] };
};
