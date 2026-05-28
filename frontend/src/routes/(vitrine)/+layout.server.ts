import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public';
import type { LayoutServerLoad } from './$types';

export type FooterProduct = { slug: string; name_pt: string; name_en: string };

const TTL_MS = 60_000;
let cache: { data: FooterProduct[]; expires: number } | null = null;

export const load: LayoutServerLoad = async () => {
  if (cache && cache.expires > Date.now()) {
    return { footerProducts: cache.data };
  }

  const url = env.PUBLIC_SUPABASE_URL;
  const key = env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return { footerProducts: [] as FooterProduct[] };

  const supabase = createClient(url, key);
  const { data } = await supabase
    .from('products')
    .select('slug, name_pt, name_en')
    .eq('published', true)
    .order('display_order')
    .limit(4);

  const footerProducts = (data ?? []) as FooterProduct[];
  cache = { data: footerProducts, expires: Date.now() + TTL_MS };
  return { footerProducts };
};
