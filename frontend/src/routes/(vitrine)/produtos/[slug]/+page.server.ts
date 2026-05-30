import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
  const { params, url, request } = event;
  const { slug } = params;
  if (!slug) throw error(404, 'Produto não encontrado');

  const supabaseUrl = env.PUBLIC_SUPABASE_URL;
  const supabaseKey = env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !supabaseKey) throw error(503, 'Serviço indisponível');

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error: fetchError } = await supabase
    .from('products')
    .select(
      'slug, name_pt, name_en, tagline_pt, tagline_en, description_pt, description_en, image_url'
    )
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (fetchError || !data) {
    throw error(404, 'Produto não encontrado');
  }

  const langParam = url.searchParams.get('lang');
  let selectedLang: 'pt' | 'en' = 'pt';
  if (langParam === 'en') {
    selectedLang = 'en';
  } else {
    const accept = request.headers.get('accept-language') ?? '';
    const enQ = parseQValue(accept, 'en');
    const ptQ = parseQValue(accept, 'pt');
    if (enQ > ptQ) selectedLang = 'en';
  }

  const canonicalBase = `${url.origin}/produtos/${slug}`;
  const canonical = selectedLang === 'en' ? `${canonicalBase}?lang=en` : canonicalBase;

  return { product: data, canonical, selectedLang, canonicalBase };
};

function parseQValue(acceptLanguage: string, lang: string): number {
  const re = new RegExp(`(?:^|,)\\s*${lang}(?:-[^,;]*)?(?:;q=([\\d.]+))?`, 'i');
  const match = acceptLanguage.match(re);
  if (!match) return 0;
  return match[1] !== undefined ? parseFloat(match[1]) : 1;
}
