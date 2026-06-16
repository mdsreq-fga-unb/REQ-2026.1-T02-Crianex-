<script lang="ts">
  import { page } from '$app/stores';
  import { lang } from '$lib/stores/lang';
  import type { PageData } from './$types';
  import type { FaqPublicArticle, FaqCategory } from './+page.server';
  import FaqRate from '$lib/components/vitrine/FaqRate.svelte';

  let { data }: { data: PageData } = $props();

  // ── i18n ─────────────────────────────────────────
  const t = {
    pageTitle: { pt: 'FAQ — Crianex', en: 'FAQ — Crianex' },
    pageDesc: {
      pt: 'Perguntas frequentes sobre os produtos e serviços da Crianex.',
      en: 'Frequently asked questions about Crianex products and services.',
    },
    eyebrow: { pt: 'Central de Ajuda', en: 'Help Center' },
    heading: { pt: 'Perguntas Frequentes', en: 'Frequently Asked Questions' },
    subheading: {
      pt: 'Encontre respostas rápidas sobre nossos produtos e serviços.',
      en: 'Find quick answers about our products and services.',
    },
    allCategories: { pt: 'Todas', en: 'All' },
    empty: {
      pt: 'Nenhum artigo disponível nesta categoria.',
      en: 'No articles available in this category.',
    },
    emptyAll: {
      pt: 'Nenhum artigo publicado no momento.',
      en: 'No articles published at this time.',
    },
    contact: { pt: 'Falar com suporte', en: 'Contact support' },
  };

  // ── State ────────────────────────────────────────
  // eslint-disable-next-line svelte/valid-compile
  let activeCategory = $state<string | null>(data.activeCategory);
  let expandedId = $state<string | null>(null);

  // ── Derived data ─────────────────────────────────
  let filteredGroups = $derived(
    activeCategory ? data.grouped.filter((g) => g.category.slug === activeCategory) : data.grouped
  );

  let totalArticles = $derived(filteredGroups.reduce((sum, g) => sum + g.articles.length, 0));

  // ── Helpers ──────────────────────────────────────
  function resolveTitle(a: FaqPublicArticle): string {
    if ($lang === 'en' && a.title_en?.trim()) return a.title_en;
    return a.title_pt;
  }

  function resolveBody(a: FaqPublicArticle): string {
    if ($lang === 'en' && a.body_en?.trim()) return a.body_en;
    return a.body_pt;
  }

  function resolveLabel(cat: FaqCategory): string {
    if ($lang === 'en' && cat.label_en?.trim()) return cat.label_en;
    return cat.label_pt;
  }

  function selectCategory(slug: string | null) {
    activeCategory = slug;
    expandedId = null;
    const params = new URLSearchParams($page.url.searchParams);
    if (slug) {
      params.set('categoria', slug);
    } else {
      params.delete('categoria');
    }
    history.replaceState(null, '', `?${params.toString()}`);
  }

  function toggleExpand(id: string) {
    expandedId = expandedId === id ? null : id;
  }

  // ── SEO ──────────────────────────────────────────
  let pageTitle = $derived(t.pageTitle[$lang]);
  let pageDesc = $derived(t.pageDesc[$lang]);
  let ogLocale = $derived($lang === 'en' ? 'en_US' : 'pt_BR');
  let canonicalUrl = $derived(data.origin + '/faq');

  let faqSchema = $derived({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.grouped
      .flatMap((g) => g.articles)
      .filter((a) => a.body_pt?.trim())
      .map((a) => {
        const rawBody = $lang === 'en' && a.body_en?.trim() ? a.body_en : a.body_pt;
        return {
          '@type': 'Question',
          name: $lang === 'en' && a.title_en?.trim() ? a.title_en : a.title_pt,
          acceptedAnswer: {
            '@type': 'Answer',
            text: rawBody?.replace(/<[^>]*>/g, '').trim() ?? '',
          },
        };
      })
      .filter((q) => q.acceptedAnswer.text),
  });

  // tag abertura/fechamento concatenadas para não confundir o parser do Svelte
  let ldScript = $derived(
    '<' + `script type="application/ld+json">${JSON.stringify(faqSchema)}<` + '/script>',
  );
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDesc} />
  <meta name="robots" content="index, follow" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={pageDesc} />
  <meta property="og:locale" content={ogLocale} />
  <link rel="canonical" href={canonicalUrl} />
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html ldScript}
</svelte:head>

<div class="page-fade faq-page">
  <!-- ── Hero ────────────────────────────────────── -->
  <section class="faq-hero">
    <div class="eyebrow">
      <span class="dot"></span>
      {t.eyebrow[$lang]}
    </div>
    <h1>{t.heading[$lang]}</h1>
    <p class="sub">{t.subheading[$lang]}</p>
  </section>

  <!-- ── Body ────────────────────────────────────── -->
  <div class="faq-body">
    <!-- Sidebar: category filter -->
    <aside class="faq-sidebar" aria-label="Filtrar por categoria">
      <nav>
        <button class="cat-btn" class:on={!activeCategory} onclick={() => selectCategory(null)}>
          {t.allCategories[$lang]}
          <span class="count">{data.grouped.reduce((s, g) => s + g.articles.length, 0)}</span>
        </button>
        {#each data.allCategories as cat (cat.id)}
          <button
            class="cat-btn"
            class:on={activeCategory === cat.slug}
            onclick={() => selectCategory(cat.slug)}
          >
            {resolveLabel(cat)}
            <span class="count"
              >{data.grouped.find((g) => g.category.id === cat.id)?.articles.length ?? 0}</span
            >
          </button>
        {/each}
      </nav>
    </aside>

    <!-- Main: article list -->
    <main class="faq-main">
      {#if totalArticles === 0}
        <div class="empty-state">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="empty-icon"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <p>{activeCategory ? t.empty[$lang] : t.emptyAll[$lang]}</p>
          <a href="/contato" class="btn ghost">{t.contact[$lang]}</a>
        </div>
      {:else}
        {#each filteredGroups as group (group.category.id)}
          <section class="cat-section" aria-labelledby="cat-{group.category.slug}">
            <h2 class="cat-heading" id="cat-{group.category.slug}">
              {resolveLabel(group.category)}
            </h2>
            <div class="article-list">
              {#each group.articles as article (article.id)}
                {@const isOpen = expandedId === article.id}
                <article class="faq-item" class:open={isOpen}>
                  <button
                    class="faq-question"
                    aria-expanded={isOpen}
                    aria-controls="body-{article.id}"
                    onclick={() => toggleExpand(article.id)}
                  >
                    <span class="q-text">{resolveTitle(article)}</span>
                    <span class="q-icon" aria-hidden="true">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        width="16"
                        height="16"
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
                    <div
                      class="faq-body-content"
                      id="body-{article.id}"
                      role="region"
                      aria-labelledby="q-{article.id}"
                    >
                      <div class="faq-text">
                        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                        {@html resolveBody(article)}
                      </div>
                      <FaqRate
                        articleId={article.id}
                        helpfulCount={article.helpful_count}
                        notHelpfulCount={article.not_helpful_count}
                        apiBaseUrl={data.apiBaseUrl}
                        showCounts={false}
                      />
                    </div>
                  {/if}
                </article>
              {/each}
            </div>
          </section>
        {/each}
      {/if}
    </main>
  </div>
</div>

<style>
  .page-fade {
    animation: pageFade 0.36s cubic-bezier(0.2, 0, 0.1, 1);
  }

  @keyframes pageFade {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .faq-hero {
    padding: 100px 40px 64px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    border-bottom: 1px solid var(--line);
  }

  .faq-hero .eyebrow {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-muted);
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .faq-hero .eyebrow .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--purple);
  }

  .faq-hero h1 {
    font-size: clamp(32px, 5vw, 56px);
    letter-spacing: -0.03em;
    line-height: 1.02;
    margin: 0;
    max-width: 18ch;
  }

  .faq-hero .sub {
    font-size: 16px;
    color: var(--text-muted);
    line-height: 1.5;
    max-width: 50ch;
    margin: 0;
  }

  .faq-body {
    display: grid;
    grid-template-columns: 220px 1fr;
    gap: 0;
    min-height: 60vh;
  }

  .faq-sidebar {
    padding: 32px 24px;
    border-right: 1px solid var(--line);
    position: sticky;
    top: 0;
    align-self: start;
    max-height: 100vh;
    overflow-y: auto;
  }

  .faq-sidebar nav {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .cat-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    width: 100%;
    padding: 8px 12px;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 8px;
    font-family: inherit;
    font-size: 13.5px;
    font-weight: 500;
    color: var(--text-muted);
    cursor: pointer;
    text-align: left;
    transition:
      background 0.15s,
      color 0.15s,
      border-color 0.15s;
  }

  .cat-btn:hover {
    background: var(--bg-soft);
    color: var(--text);
  }

  .cat-btn.on {
    background: rgba(168, 85, 247, 0.08);
    color: var(--purple);
    border-color: rgba(168, 85, 247, 0.2);
  }

  .cat-btn .count {
    font-family: var(--font-mono);
    font-size: 10.5px;
    color: var(--text-faint);
    background: var(--bg-soft);
    padding: 1px 6px;
    border-radius: 100px;
  }

  .cat-btn.on .count {
    background: rgba(168, 85, 247, 0.12);
    color: var(--purple);
  }

  .faq-main {
    padding: 40px;
    display: flex;
    flex-direction: column;
    gap: 48px;
  }

  .cat-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .cat-heading {
    font-family: var(--font-mono);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text-muted);
    margin: 0 0 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--line);
  }

  .article-list {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .faq-item {
    border-bottom: 1px solid var(--line);
  }

  .faq-item:first-child {
    border-top: 1px solid var(--line);
  }

  .faq-question {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    width: 100%;
    padding: 18px 4px;
    background: transparent;
    border: 0;
    font-family: inherit;
    font-size: 15px;
    font-weight: 500;
    color: var(--text);
    cursor: pointer;
    text-align: left;
    transition: color 0.15s;
  }

  .faq-question:hover {
    color: var(--purple);
  }
  .faq-item.open .faq-question {
    color: var(--purple);
  }

  .q-text {
    flex: 1;
    line-height: 1.4;
  }

  .q-icon {
    flex-shrink: 0;
    color: var(--text-muted);
    transition: color 0.15s;
  }

  .faq-item.open .q-icon {
    color: var(--purple);
  }

  .faq-body-content {
    padding: 0 4px 24px;
    animation: expandIn 0.2s ease-out;
  }

  @keyframes expandIn {
    from {
      opacity: 0;
      transform: translateY(-6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .faq-text {
    font-size: 14.5px;
    line-height: 1.7;
    color: var(--text-muted);
    max-width: 72ch;
  }

  .faq-text :global(p) {
    margin: 0 0 12px;
  }
  .faq-text :global(p:last-child) {
    margin-bottom: 0;
  }
  .faq-text :global(a) {
    color: var(--purple);
    text-decoration: underline;
  }
  .faq-text :global(ul),
  .faq-text :global(ol) {
    padding-left: 20px;
    margin: 8px 0;
  }
  .faq-text :global(li) {
    margin-bottom: 4px;
  }

  .empty-state {
    padding: 80px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    text-align: center;
  }

  .empty-icon {
    width: 48px;
    height: 48px;
    color: var(--text-faint);
  }
  .empty-state p {
    font-size: 15px;
    color: var(--text-muted);
  }

  .btn.ghost {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    border-radius: 100px;
    background: transparent;
    color: var(--text);
    border: 1px solid var(--line);
    font-weight: 500;
    font-size: 14px;
    cursor: pointer;
    text-decoration: none;
    font-family: inherit;
    transition:
      border-color 0.15s,
      background 0.15s;
  }

  .btn.ghost:hover {
    border-color: var(--text);
    background: var(--bg-soft);
  }

  @media (max-width: 820px) {
    .faq-hero {
      padding: 80px 28px 48px;
    }
    .faq-body {
      grid-template-columns: 1fr;
    }
    .faq-sidebar {
      position: static;
      border-right: none;
      border-bottom: 1px solid var(--line);
      padding: 20px 28px;
      max-height: none;
    }
    .faq-sidebar nav {
      flex-direction: row;
      flex-wrap: wrap;
      gap: 6px;
    }
    .cat-btn {
      width: auto;
      padding: 6px 12px;
      font-size: 13px;
    }
    .faq-main {
      padding: 32px 28px;
    }
  }

  @media (max-width: 480px) {
    .faq-hero {
      padding: 72px 20px 40px;
    }
    .faq-sidebar {
      padding: 16px 20px;
    }
    .faq-main {
      padding: 24px 20px;
    }
    .faq-question {
      font-size: 14px;
    }
  }
</style>
