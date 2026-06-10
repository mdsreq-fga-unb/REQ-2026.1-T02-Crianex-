import type { PageServerLoad } from './$types';

export type FaqCategory = {
  id: string;
  slug: string;
  label_pt: string;
  label_en: string;
  display_order: number;
};

export type FaqPublicArticle = {
  id: string;
  title_pt: string;
  title_en: string;
  body_pt: string;
  body_en: string;
  slug: string;
  helpful_count: number;
  not_helpful_count: number;
  published_at: string | null;
  category: FaqCategory;
};

export const load: PageServerLoad = async ({ url, locals, fetch }) => {
  const backendUrl = process.env['BACKEND_URL'] ?? 'http://localhost:3000';
  const categorySlug = url.searchParams.get('categoria') ?? undefined;
  const origin = url.origin;
  const selectedLang = locals.lang ?? 'pt';

  let articles: FaqPublicArticle[] = [];

  try {
    const apiUrl = categorySlug
      ? `${backendUrl}/api/public/faq/articles?categoria=${encodeURIComponent(categorySlug)}`
      : `${backendUrl}/api/public/faq/articles`;

    const res = await fetch(apiUrl);
    if (res.ok) {
      articles = await res.json();
    }
  } catch (err) {
    console.error('[faq page] failed to fetch articles:', err);
  }

  const categoryMap = new Map<string, { category: FaqCategory; articles: FaqPublicArticle[] }>();
  for (const article of articles) {
    const key = article.category.id;
    if (!categoryMap.has(key)) {
      categoryMap.set(key, { category: article.category, articles: [] });
    }
    categoryMap.get(key)!.articles.push(article);
  }

  const grouped = [...categoryMap.values()].sort(
    (a, b) => a.category.display_order - b.category.display_order
  );

  const allCategories: FaqCategory[] = grouped.map((g) => g.category);

  return {
    grouped,
    allCategories,
    activeCategory: categorySlug ?? null,
    origin,
    selectedLang,
  };
};
