<script lang="ts">
  import { page } from '$app/stores';
  import type { FaqArticle, FaqCategory } from './+page.server';

  let { data } = $props<{
    data: {
      articles: FaqArticle[];
      categories: FaqCategory[];
      error?: string;
    };
  }>();

  const t = {
    eyebrow: { pt: 'Documentação & Ajuda', en: 'Docs & Help' },
    h1: { pt: 'Central de ajuda.', en: 'Help center.' },
    lede: {
      pt: 'Encontre respostas por produto ou pesquise direto.',
      en: 'Find answers per product or search directly.',
    },
    search: { pt: 'Buscar artigos…', en: 'Search articles…' },
    helpful: { pt: 'Foi útil?', en: 'Helpful?' },
    yes: { pt: 'Sim', en: 'Yes' },
    no: { pt: 'Não', en: 'No' },
    notFound: { pt: 'Nada encontrado.', en: 'Nothing found.' },
    allCats: { pt: 'Todos', en: 'All' },
  };

  let lang = $state<'pt' | 'en'>('pt');
  let activeCatId = $state<string | null>(null);
  let searchQuery = $state('');
  let openId = $state<string | null>(null);
  let ratings = $state<Record<string, 'y' | 'n'>>({});
  let ratingLoading = $state<Record<string, boolean>>({});

  const articles = $derived(data.articles);
  const categories = $derived(data.categories);

  const categoriesWithCount = $derived(
    categories.map((c) => ({
      ...c,
      count: articles.filter((a) => a.category_id === c.id).length,
    }))
  );

  const filtered = $derived(() => {
    const q = searchQuery.toLowerCase().trim();
    return articles.filter((a) => {
      const matchCat = !activeCatId || a.category_id === activeCatId;
      const title = lang === 'pt' ? a.title_pt : a.title_en || a.title_pt;
      const body = lang === 'pt' ? a.body_pt : a.body_en || a.body_pt;
      const matchQ = !q || title.toLowerCase().includes(q) || body.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  });

  async function submitRating(articleId: string, rating: 'y' | 'n') {
    if (ratings[articleId] || ratingLoading[articleId]) return;
    ratingLoading = { ...ratingLoading, [articleId]: true };
    try {
      await fetch(`/api/public/faq/ratings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article_id: articleId, rating }),
      });
      ratings = { ...ratings, [articleId]: rating };
    } catch {
      // silently fail — rating is not critical
    } finally {
      ratingLoading = { ...ratingLoading, [articleId]: false };
    }
  }

  function selectCat(id: string | null) {
    activeCatId = id;
    searchQuery = '';
    openId = null;
  }
</script>

<svelte:head>
  <title>FAQ — Crianex</title>
  <meta
    name="description"
    content="Central de ajuda Crianex. Encontre respostas por produto ou pesquise direto."
  />
</svelte:head>

<div class="faq-page page-fade">
  <!-- Hero -->
  <section class="faq-hero">
    <div class="eyebrow">
      <span class="dot"></span>
      {t.eyebrow[lang]}
    </div>
    <h1>{t.h1[lang]}</h1>
    <p class="lede">{t.lede[lang]}</p>

    <div class="lang-switch">
      <button class={lang === 'pt' ? 'on' : ''} onclick={() => (lang = 'pt')}>PT</button>
      <button class={lang === 'en' ? 'on' : ''} onclick={() => (lang = 'en')}>EN</button>
    </div>
  </section>

  {#if data.error}
    <div class="error-banner" role="alert">{data.error}</div>
  {/if}

  <!-- Layout: sidebar + main -->
  <div class="faq-layout">
    <!-- Category sidebar -->
    <nav class="faq-cats" aria-label="Categorias">
      <button
        class="cat {!activeCatId && !searchQuery ? 'on' : ''}"
        onclick={() => selectCat(null)}
      >
        <span>{t.allCats[lang]}</span>
        <span class="ct">{articles.length}</span>
      </button>
      {#each categoriesWithCount as cat}
        {#if cat.count > 0}
          <button
            class="cat {activeCatId === cat.id && !searchQuery ? 'on' : ''}"
            onclick={() => selectCat(cat.id)}
          >
            <span>{lang === 'pt' ? cat.label_pt : cat.label_en}</span>
            <span class="ct">{cat.count}</span>
          </button>
        {/if}
      {/each}
    </nav>

    <!-- Articles -->
    <main class="faq-main">
      <!-- Search -->
      <div class="faq-search">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="search-ico"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="search"
          placeholder={t.search[lang]}
          bind:value={searchQuery}
          oninput={() => (activeCatId = null)}
          aria-label={t.search[lang]}
        />
        <span class="kbd">⌘ K</span>
      </div>

      {#if filtered().length === 0}
        <div class="empty">{t.notFound[lang]}</div>
      {/if}

      <!-- Accordion items -->
      {#each filtered() as article (article.id)}
        {@const isOpen = openId === article.id}
        {@const title = lang === 'pt' ? article.title_pt : article.title_en || article.title_pt}
        {@const body = lang === 'pt' ? article.body_pt : article.body_en || article.body_pt}
        {@const catLabel = (() => {
          const c = categories.find((x) => x.id === article.category_id);
          return c ? (lang === 'pt' ? c.label_pt : c.label_en) : '';
        })()}

        <div class="faq-item {isOpen ? 'open' : ''}">
          <button
            class="faq-q"
            onclick={() => (openId = isOpen ? null : article.id)}
            aria-expanded={isOpen}
          >
            <div class="meta">
              {#if catLabel}
                <span class="cat-badge">{catLabel}</span>
              {/if}
              <span class="q-text">{title}</span>
            </div>
            <span class="plus" aria-hidden="true">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                width="14"
                height="14"
              >
                {#if isOpen}
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                {:else}
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                {/if}
              </svg>
            </span>
          </button>

          {#if isOpen}
            <div class="faq-a">
              <div class="faq-a-inner">
                <p>{body}</p>
                <div class="faq-rate">
                  <span>{t.helpful[lang]}</span>
                  <button
                    class="good {ratings[article.id] === 'y' ? 'on' : ''}"
                    onclick={() => submitRating(article.id, 'y')}
                    disabled={!!ratings[article.id] || ratingLoading[article.id]}
                    aria-label={t.yes[lang]}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      width="12"
                      height="12"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    {t.yes[lang]}
                  </button>
                  <button
                    class="bad {ratings[article.id] === 'n' ? 'on' : ''}"
                    onclick={() => submitRating(article.id, 'n')}
                    disabled={!!ratings[article.id] || ratingLoading[article.id]}
                    aria-label={t.no[lang]}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      width="12"
                      height="12"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    {t.no[lang]}
                  </button>
                </div>
              </div>
            </div>
          {/if}
        </div>
      {/each}
    </main>
  </div>
</div>

<style>
  .faq-page {
    min-height: 100vh;
  }

  /* Hero */
  .faq-hero {
    padding: 64px 40px 16px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-muted);
    font-family: var(--font-mono, monospace);
    margin-bottom: 18px;
  }

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--purple, #7f3fe5);
    flex-shrink: 0;
  }

  h1 {
    font-size: clamp(36px, 5vw, 56px);
    letter-spacing: -0.035em;
    line-height: 1;
    color: var(--text);
    margin: 0 0 16px;
  }

  .lede {
    color: var(--text-muted);
    font-size: 16px;
    line-height: 1.5;
    max-width: 48ch;
    margin: 0 0 24px;
  }

  .lang-switch {
    display: inline-flex;
    gap: 2px;
    background: var(--bg-soft);
    border: 1px solid var(--line);
    border-radius: 8px;
    padding: 3px;
  }

  .lang-switch button {
    padding: 5px 14px;
    font-size: 12px;
    font-weight: 600;
    font-family: var(--font-mono, monospace);
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background: transparent;
    color: var(--text-muted);
    transition:
      background 0.12s,
      color 0.12s;
  }

  .lang-switch button.on {
    background: var(--bg-elev);
    color: var(--text);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.18);
  }

  /* Error banner */
  .error-banner {
    max-width: 1200px;
    margin: 0 auto 16px;
    padding: 12px 40px;
    font-size: 13px;
    color: #ef4444;
    background: rgba(239, 68, 68, 0.06);
    border-radius: 8px;
  }

  /* Layout */
  .faq-layout {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 32px;
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px 40px 80px;
  }

  /* Sidebar */
  .faq-cats {
    display: flex;
    flex-direction: column;
    gap: 2px;
    position: sticky;
    top: 80px;
    align-self: start;
  }

  .faq-cats .cat {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 9px 12px;
    border-radius: 8px;
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 13.5px;
    font-family: inherit;
    color: var(--text-muted);
    text-align: left;
    transition:
      background 0.12s,
      color 0.12s;
  }

  .faq-cats .cat:hover {
    background: var(--bg-soft);
    color: var(--text);
  }

  .faq-cats .cat.on {
    background: rgba(127, 63, 229, 0.1);
    color: var(--purple, #7f3fe5);
    font-weight: 500;
  }

  .faq-cats .ct {
    font-family: var(--font-mono, monospace);
    font-size: 11px;
    color: var(--text-faint);
    background: var(--bg-soft);
    border-radius: 4px;
    padding: 1px 5px;
    min-width: 20px;
    text-align: center;
  }

  .faq-cats .cat.on .ct {
    background: rgba(127, 63, 229, 0.15);
    color: var(--purple, #7f3fe5);
  }

  /* Main */
  .faq-main {
    min-width: 0;
  }

  /* Search */
  .faq-search {
    display: flex;
    align-items: center;
    gap: 10px;
    background: var(--bg-elev);
    border: 1px solid var(--line);
    border-radius: 10px;
    padding: 12px 16px;
    margin-bottom: 20px;
    transition: border-color 0.15s;
  }

  .faq-search:focus-within {
    border-color: var(--purple, #7f3fe5);
  }

  .search-ico {
    width: 16px;
    height: 16px;
    color: var(--text-muted);
    flex-shrink: 0;
  }

  .faq-search input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    font-size: 14px;
    color: var(--text);
    font-family: inherit;
  }

  .faq-search input::placeholder {
    color: var(--text-faint);
  }

  .kbd {
    font-family: var(--font-mono, monospace);
    font-size: 10px;
    color: var(--text-faint);
    background: var(--bg-soft);
    border: 1px solid var(--line);
    border-radius: 4px;
    padding: 2px 6px;
    white-space: nowrap;
    flex-shrink: 0;
  }

  /* Empty state */
  .empty {
    padding: 48px 0;
    text-align: center;
    color: var(--text-muted);
    font-size: 14px;
  }

  /* FAQ accordion */
  .faq-item {
    border: 1px solid var(--line);
    border-radius: 10px;
    margin-bottom: 8px;
    overflow: hidden;
    transition: border-color 0.15s;
  }

  .faq-item.open {
    border-color: rgba(127, 63, 229, 0.3);
  }

  .faq-q {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 16px 18px;
    background: transparent;
    border: none;
    cursor: pointer;
    text-align: left;
    font-family: inherit;
    transition: background 0.1s;
  }

  .faq-q:hover {
    background: var(--bg-soft);
  }

  .faq-item.open .faq-q {
    background: var(--bg-soft);
    border-bottom: 1px solid var(--line);
  }

  .meta {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
    min-width: 0;
  }

  .cat-badge {
    font-family: var(--font-mono, monospace);
    font-size: 9.5px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    padding: 3px 7px;
    background: var(--bg-soft);
    border-radius: 4px;
    color: var(--text-muted);
    white-space: nowrap;
    flex-shrink: 0;
    border: 1px solid var(--line);
  }

  .q-text {
    font-size: 14.5px;
    font-weight: 500;
    color: var(--text);
    line-height: 1.4;
  }

  .plus {
    flex-shrink: 0;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    transition: color 0.15s;
  }

  .faq-item.open .plus {
    color: var(--purple, #7f3fe5);
  }

  .faq-a {
    padding: 0 18px 18px;
    background: var(--bg-soft);
  }

  .faq-a-inner {
    padding-top: 16px;
    border-top: none;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .faq-a-inner p {
    margin: 0;
    font-size: 14px;
    line-height: 1.65;
    color: var(--text-muted);
    white-space: pre-line;
  }

  /* Rating */
  .faq-rate {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: var(--text-faint);
    padding-top: 4px;
    border-top: 1px solid var(--line);
  }

  .faq-rate button {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 11px;
    border-radius: 6px;
    font-size: 12px;
    font-family: inherit;
    cursor: pointer;
    transition:
      background 0.12s,
      color 0.12s,
      border-color 0.12s;
  }

  .good {
    background: transparent;
    border: 1px solid var(--line);
    color: var(--text-muted);
  }

  .good:hover:not(:disabled),
  .good.on {
    background: rgba(102, 223, 122, 0.1);
    border-color: var(--green, #66df7a);
    color: var(--green, #66df7a);
  }

  .bad {
    background: transparent;
    border: 1px solid var(--line);
    color: var(--text-muted);
  }

  .bad:hover:not(:disabled),
  .bad.on {
    background: rgba(239, 68, 68, 0.08);
    border-color: #ef4444;
    color: #ef4444;
  }

  .faq-rate button:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .faq-hero {
      padding: 40px 20px 12px;
    }

    .faq-layout {
      grid-template-columns: 1fr;
      padding: 16px 20px 60px;
      gap: 16px;
    }

    .faq-cats {
      flex-direction: row;
      flex-wrap: wrap;
      position: static;
    }

    .faq-cats .cat {
      flex-direction: row;
      gap: 6px;
    }
  }
</style>
