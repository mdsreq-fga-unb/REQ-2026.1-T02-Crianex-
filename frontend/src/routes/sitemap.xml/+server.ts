import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public';

export async function GET(event: { url: URL }) {
  const origin = event.url.origin;

  try {
    const staticUrls = [
      { loc: `${origin}/`, lastmod: new Date().toISOString() },
      { loc: `${origin}/produtos`, lastmod: new Date().toISOString() },
      { loc: `${origin}/sobre`, lastmod: new Date().toISOString() },
      { loc: `${origin}/faq`, lastmod: new Date().toISOString() },
      { loc: `${origin}/contato`, lastmod: new Date().toISOString() },
    ];

    const supabaseUrl = env.PUBLIC_SUPABASE_URL;
    const supabaseKey = env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    let productUrls: { loc: string; lastmod: string }[] = [];

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data: products, error } = await supabase
        .from('products')
        .select('slug, updated_at')
        .eq('published', true)
        .order('display_order');

      if (!error && products) {
        productUrls = products.map((p: { slug: string; updated_at: string | null }) => ({
          loc: `${origin}/produtos/${p.slug}`,
          lastmod: p.updated_at ? new Date(p.updated_at).toISOString() : new Date().toISOString(),
        }));
      }
    }

    const allUrls = [...staticUrls, ...productUrls];

    const urlset = allUrls
      .map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n  </url>`)
      .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlset}\n</urlset>`;

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (err: unknown) {
    console.error('[sitemap] unexpected error:', err instanceof Error ? err.message : err);
    const isDev = process.env.NODE_ENV !== 'production';
    const body = isDev
      ? JSON.stringify({ message: 'sitemap error', error: String(err) })
      : JSON.stringify({ message: 'Internal Error' });
    return new Response(body, { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
