import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public';
import type { LayoutServerLoad } from './$types';

export type FooterProduct = { slug: string; name_pt: string; name_en: string };

const TTL_MS = 60_000;
let cache: { data: FooterProduct[]; expires: number } | null = null;
let inflight: Promise<FooterProduct[]> | null = null;

async function fetchProducts(fetch: typeof globalThis.fetch): Promise<FooterProduct[]> {
  const url = env.PUBLIC_SUPABASE_URL;
  const key = env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return [];

  const supabase = createClient(url, key, {
    global: { fetch },
    auth: { persistSession: false },
  });

  const { data } = await supabase
    .from('products')
    .select('slug, name_pt, name_en')
    .eq('published', true)
    .order('display_order')
    .limit(4);

  return (data ?? []) as FooterProduct[];
}

export const load: LayoutServerLoad = async ({ fetch }) => {
  if (cache && cache.expires > Date.now()) {
    return { footerProducts: cache.data };
  }

  if (!inflight) {
    inflight = fetchProducts(fetch).then((data) => {
      cache = { data, expires: Date.now() + TTL_MS };
      inflight = null;
      return data;
    });
  }

  const footerProducts = await inflight;
  return { footerProducts };
};
