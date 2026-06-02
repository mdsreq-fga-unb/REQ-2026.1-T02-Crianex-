<script lang="ts">
  import { onMount } from 'svelte';
  import { lang } from '$lib/stores/lang';
  import type { PageData } from './$types';
  import { t, differentiators, ACCENT_COLORS, resolveField } from './home';

  export let data: PageData;

  const products = data.products;
  const total = products.length;

  // ── Hero accent cycling ──────────────────────
  let accentIdx = 0;

  // ── Carousel ────────────────────────────────
  let active = 0;
  let hover = false;
  let carouselTimer: ReturnType<typeof setTimeout>;

  function resetTimer() {
    clearTimeout(carouselTimer);
    if (!hover && total > 0) {
      carouselTimer = setTimeout(() => {
        active = (active + 1) % total;
        resetTimer();
      }, 5000);
    }
  }

  $: (active, hover, resetTimer());

  onMount(() => {
    const accentInterval = setInterval(() => {
      accentIdx = (accentIdx + 1) % ACCENT_COLORS.length;
    }, 2200);
    resetTimer();

    // Se vier do footer com ?produto=slug, ativa o slide e rola até o carrossel
    const slug = new URLSearchParams(window.location.search).get('produto');
    if (slug) {
      const idx = products.findIndex((p) => p.slug === slug);
      if (idx >= 0) active = idx;
      setTimeout(() => {
        document
          .getElementById('products-carousel')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
    }

    return () => {
      clearInterval(accentInterval);
      clearTimeout(carouselTimer);
    };
  });

  function jumpTo(i: number) {
    active = i;
  }
  function prev() {
    active = (active - 1 + total) % total;
  }
  function next() {
    active = (active + 1) % total;
  }

  // ── Helpers ─────────────────────────────────
  function initials(name: string): string {
    return name
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0] ?? '')
      .join('')
      .toUpperCase();
  }

  function accentColor(i: number): string {
    return ACCENT_COLORS[i % ACCENT_COLORS.length] as string;
  }

  // ── SEO ─────────────────────────────────────
  const canonicalUrl = (data as { origin?: string }).origin ?? '';
  const selectedLang = ((data as { selectedLang?: string }).selectedLang ?? 'pt') as 'pt' | 'en';
  const ogImage = `${canonicalUrl}/assets/home/crianexImagemSemFundo.png`;

  $: pageTitle =
    $lang === 'en' ? 'Crianex Hub — B2B Software House' : 'Crianex Hub — Software house B2B';
  $: pageDesc = t.lede[$lang];
  $: ogLocale = $lang === 'en' ? 'en_US' : 'pt_BR';
  $: ogLocaleAlt = $lang === 'en' ? 'pt_BR' : 'en_US';

  const ldJson = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Crianex Hub',
    url: canonicalUrl,
    description: t.lede[selectedLang],
    logo: ogImage,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Av. Paulista, 1842',
      addressLocality: 'São Paulo',
      addressRegion: 'SP',
      addressCountry: 'BR',
    },
    sameAs: ['https://www.linkedin.com/company/crianex'],
  });
  // split closing tag so Svelte parser does not see it literally
  const ldScript = `<script type="application/ld+json">${ldJson}<` + `/script>`;
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDesc} />
  <meta name="robots" content="index, follow" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:site_name" content="Crianex Hub" />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={pageDesc} />
  <meta property="og:locale" content={ogLocale} />
  <meta property="og:locale:alternate" content={ogLocaleAlt} />
  <meta property="og:image" content={ogImage} />
  <meta property="og:image:width" content="580" />
  <meta property="og:image:height" content="430" />
  <meta property="og:image:alt" content="Crianex Hub — plataformas SaaS B2B" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={pageTitle} />
  <meta name="twitter:description" content={pageDesc} />
  <meta name="twitter:image" content={ogImage} />

  <!-- Canonical + hreflang -->
  <link rel="canonical" href={canonicalUrl} />
  <link rel="alternate" hreflang="pt-BR" href={canonicalUrl} />
  <link rel="alternate" hreflang="en" href={`${canonicalUrl}?lang=en`} />
  <link rel="alternate" hreflang="x-default" href={canonicalUrl} />

  <!-- JSON-LD — conteúdo gerado por JSON.stringify, sem input do usuário -->
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html ldScript}
</svelte:head>

<div class="page-fade">
  <!-- ── Hero ───────────────────────────────────────── -->
  <section class="hero hero-canvas-section">
    <div class="hero-bg">
      <div class="hero-orb a"></div>
      <div class="hero-orb b"></div>
      <div class="hero-orb c"></div>
    </div>
    <div class="hero-content">
      <div class="hero-grid">
        <div class="hero-meta">
          <div class="eyebrow" style="margin-bottom: 28px;">
            <span class="dot"></span>
            {t.eyebrow[$lang]}
          </div>

          <h1 class="display">
            {t.h1Parts[$lang][0]}&nbsp;<span class="underline"
              ><span class="swatch" style="background: {ACCENT_COLORS[accentIdx]};"></span>{t
                .h1Parts[$lang][1]}</span
            >&nbsp;{t.h1Parts[$lang][2]}
          </h1>

          <p class="hero-lede" style="margin-top: 28px;">{t.lede[$lang]}</p>

          <div class="hero-cta" style="margin-top: 28px;">
            <a href="/contato" class="btn">
              {t.ctaPrimary[$lang]}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="arrow"
                aria-hidden="true"
              >
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
            <button
              class="btn ghost"
              onclick={() => {
                jumpTo(0);
                document
                  .getElementById('products-carousel')
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              {t.ctaSecondary[$lang]}
            </button>
          </div>

          <div class="hero-stats" style="margin-top: 36px;">
            <div>
              <span class="n">6</span>
              <span class="l">{t.statsProducts[$lang]}</span>
            </div>
            <div>
              <span class="n">184</span>
              <span class="l">{t.statsClients[$lang]}</span>
            </div>
            <div>
              <span class="n">99.94%</span>
              <span class="l">{t.statsUptime[$lang]}</span>
            </div>
          </div>
        </div>

        <div class="hero-art">
          <div class="hero-illustration">
            <img
              src="/assets/home/crianexImagemSemFundo.png"
              alt="Crianex — plataformas, integrações e API"
              width="580"
              height="430"
              loading="eager"
              fetchpriority="high"
            />
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ── Product chips strip ───────────────────── -->
  {#if total > 0}
    <div class="products-chips-strip">
      <span class="strip-label">
        {$lang === 'pt' ? 'Conheça nossos produtos' : 'Our products'}
      </span>
      <div class="chips-row">
        {#each products as p, i}
          <button class="product-chip {active === i ? 'on' : ''}" onclick={() => jumpTo(i)}>
            <span class="dot" style="background: {accentColor(i)};"></span>
            <span class="name">{resolveField(p.name_pt, p.name_en, $lang)}</span>
            <span class="cat">{resolveField(p.category_pt, p.category_en, $lang)}</span>
          </button>
        {/each}
      </div>
    </div>
  {/if}

  <!-- ── Social proof rail ─────────────────────── -->
  <div class="hero-rail">
    <span>{$lang === 'pt' ? 'Em uso por times de' : 'Used by teams at'}</span>
    <span class="line"></span>
    <span>NIVERA</span>
    <span>·</span>
    <span>Folha Sistemas</span>
    <span>·</span>
    <span>Editora Versa</span>
    <span>·</span>
    <span>Quantum Lab</span>
    <span>·</span>
    <span>Aletheia</span>
  </div>

  <!-- ── Products carousel ─────────────────────── -->
  {#if total > 0}
    <section class="section carousel-section" id="products-carousel">
      <div class="section-head">
        <div>
          <div class="eyebrow" style="margin-bottom: 14px;">
            <span class="dot" style="background: var(--pink);"></span>
            {t.productsEyebrow[$lang]}
          </div>
          <h2>{t.productsTitle[$lang]}</h2>
        </div>
        <p class="desc">{t.productsDesc[$lang]}</p>
      </div>

      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        class="product-carousel"
        onmouseenter={() => (hover = true)}
        onmouseleave={() => (hover = false)}
      >
        <div class="carousel-slides">
          {#each products as p, i}
            {@const name = resolveField(p.name_pt, p.name_en, $lang)}
            {@const tagline = resolveField(p.tagline_pt, p.tagline_en, $lang)}
            {@const category = resolveField(p.category_pt, p.category_en, $lang)}
            {@const color = accentColor(i)}
            <div class="carousel-slide {i === active ? 'on' : ''}">
              <div class="cs-visual" style="background: {color};">
                <div class="cs-icon-text">{initials(name)}</div>
                <div class="cs-num">
                  {String(i + 1).padStart(2, '0')}&nbsp;<span style="opacity: 0.5;"
                    >/ {String(total).padStart(2, '0')}</span
                  >
                </div>
                <div class="cs-tag">{category}</div>
              </div>
              <div class="cs-content">
                <div class="eyebrow" style="margin-bottom: 6px;">
                  <span class="dot" style="background: {color};"></span>
                  {$lang === 'pt'
                    ? 'Produto ' + String(i + 1).padStart(2, '0')
                    : 'Product ' + String(i + 1).padStart(2, '0')}
                </div>
                <h3>{name}</h3>
                <p class="lede">{tagline}</p>
                <div class="actions">
                  <a href="/produtos/{p.slug}" class="btn">
                    {t.learnMore[$lang]}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="arrow"
                      aria-hidden="true"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </a>
                  <a href="/contato" class="btn ghost">Demo</a>
                </div>
              </div>
            </div>
          {/each}
        </div>

        <div class="carousel-foot">
          <div class="progress">
            {#each products as _, i}
              <button
                class="pdot {i === active ? 'on' : ''}"
                onclick={() => jumpTo(i)}
                aria-label={`Produto ${i + 1}`}
              >
                <span class="bar" style="animation-play-state: {hover ? 'paused' : 'running'};"
                ></span>
              </button>
            {/each}
          </div>
          <div class="counter mono">
            {String(active + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </div>
          <div class="nav">
            <button onclick={prev} aria-label={$lang === 'pt' ? 'anterior' : 'previous'}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
                style="transform: rotate(180deg);"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
            <button onclick={next} aria-label={$lang === 'pt' ? 'próximo' : 'next'}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  {/if}

  <!-- ── Differentiators (dark) ────────────────── -->
  <section class="section diff-section">
    <div class="section-head">
      <div>
        <div class="eyebrow" style="margin-bottom: 14px;">
          <span class="dot"></span>
          {t.diffEyebrow[$lang]}
        </div>
        <h2>{t.diffTitle[$lang]}</h2>
      </div>
      <p class="desc">{t.diffDesc[$lang]}</p>
    </div>

    <div class="diff-grid">
      {#each differentiators as d}
        <div class="diff-item">
          <span class="tick">{d.tick}</span>
          <h4>{d.title[$lang]}</h4>
          <p>{d.desc[$lang]}</p>
        </div>
      {/each}
    </div>
  </section>

  <!-- ── CTA Banner ────────────────────────────── -->
  <section class="section" style="padding-top: 0;">
    <div class="cta-banner">
      <div>
        <h3>{t.ctaBannerTitle[$lang]}</h3>
        <p style="color: var(--text-muted); margin-top: 14px; font-size: 14px;">
          {t.ctaBannerDesc[$lang]}
        </p>
      </div>
      <div class="end">
        <a href="/contato" class="btn">
          {t.ctaBannerBtn[$lang]}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="arrow"
            aria-hidden="true"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </a>
        <a href="/sobre" class="btn ghost">{t.ctaBannerSecondary[$lang]}</a>
      </div>
    </div>
  </section>
</div>

<style>
  /* ── Design tokens (vitrine surface) ──────────── */
  :global(.vitrine-root) {
    --bg: #fcfcfc;
    --bg-elev: #ffffff;
    --bg-soft: #f4f3f1;
    --bg-tint: #f8f5fb;
    --line: #e8e6e2;
    --line-strong: #d4d1cc;
    --text: #060606;
    --text-muted: #6b6862;
    --text-faint: #9a968e;
    --r-lg: 18px;
    --r: 8px;
    --shadow-2: 0 4px 14px rgba(6, 6, 6, 0.06), 0 1px 2px rgba(6, 6, 6, 0.04);
    --shadow-3: 0 18px 40px -16px rgba(6, 6, 6, 0.18), 0 4px 10px rgba(6, 6, 6, 0.05);
  }

  /* ── Buttons ──────────────────────────────────── */
  :global(.btn) {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 11px 18px;
    border-radius: 100px;
    background: var(--text);
    color: var(--bg);
    border: 1px solid var(--text);
    font-weight: 500;
    font-size: 14px;
    letter-spacing: -0.005em;
    cursor: pointer;
    text-decoration: none;
    font-family: inherit;
    transition:
      transform 0.15s,
      background 0.15s;
  }
  :global(.btn:hover) {
    background: var(--purple);
    border-color: var(--purple);
    transform: translateY(-1px);
  }
  :global(.btn.ghost) {
    background: transparent;
    color: var(--text);
  }
  :global(.btn.ghost:hover) {
    background: var(--text);
    color: var(--bg);
  }
  :global(.btn .arrow) {
    transition: transform 0.2s;
  }
  :global(.btn:hover .arrow) {
    transform: translate(2px, -2px);
  }

  /* ── Eyebrow ───────────────────────────────────── */
  :global(.eyebrow) {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-muted);
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  :global(.eyebrow .dot) {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--purple);
  }

  /* ── Page fade ─────────────────────────────────── */
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

  /* ── Hero ──────────────────────────────────────── */
  .hero {
    position: relative;
    overflow: hidden;
    max-width: 100%;
  }
  .hero-canvas-section {
    padding: 100px 40px 148px;
    overflow: hidden;
    background: var(--bg);
  }
  .hero-bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    z-index: 0;
  }
  .hero-bg::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(6, 6, 6, 0.045) 1px, transparent 1px),
      linear-gradient(90deg, rgba(6, 6, 6, 0.045) 1px, transparent 1px);
    background-size: 32px 32px;
    background-position: -1px -1px;
    mask-image: radial-gradient(ellipse 70% 80% at 70% 50%, #000 0%, transparent 80%);
    -webkit-mask-image: radial-gradient(ellipse 70% 80% at 70% 50%, #000 0%, transparent 80%);
  }
  .hero-orb {
    position: absolute;
    width: 380px;
    height: 380px;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.4;
    mix-blend-mode: multiply;
  }
  .hero-orb.a {
    background: #e71f84;
    top: -120px;
    right: 5%;
    animation: orbDriftA 16s ease-in-out infinite;
  }
  .hero-orb.b {
    background: #7f3fe5;
    top: 30%;
    right: 20%;
    animation: orbDriftB 22s ease-in-out infinite;
    opacity: 0.32;
  }
  .hero-orb.c {
    background: #66df7a;
    bottom: -100px;
    right: 35%;
    animation: orbDriftC 18s ease-in-out infinite;
    opacity: 0.28;
  }
  @keyframes orbDriftA {
    0%,
    100% {
      transform: translate(0, 0) scale(1);
    }
    50% {
      transform: translate(-40px, 30px) scale(1.1);
    }
  }
  @keyframes orbDriftB {
    0%,
    100% {
      transform: translate(0, 0) scale(1);
    }
    50% {
      transform: translate(50px, -40px) scale(0.92);
    }
  }
  @keyframes orbDriftC {
    0%,
    100% {
      transform: translate(0, 0) scale(1);
    }
    50% {
      transform: translate(-30px, -50px) scale(1.05);
    }
  }

  .hero-content {
    position: relative;
    z-index: 2;
  }
  .hero-grid {
    display: grid;
    grid-template-columns: 1.6fr 1.4fr;
    gap: 48px;
    align-items: center;
  }
  .hero-meta {
    display: flex;
    flex-direction: column;
  }

  /* H1 display */
  .display {
    font-size: clamp(30px, 8.5vw, 70px);
    line-height: 0.94;
    letter-spacing: -0.04em;
    font-weight: 500;
    margin: 0;
    max-width: 60rem;
  }
  .underline {
    position: relative;
    white-space: nowrap;
  }
  .swatch {
    display: inline-block;
    vertical-align: -0.04em;
    width: 0.78em;
    height: 0.78em;
    border-radius: 50%;
    margin-right: 0.12em;
    transition: background 0.4s;
  }

  .hero-lede {
    font-size: 17px;
    line-height: 1.55;
    color: var(--text-muted);
    max-width: 40ch;
    margin: 0;
  }
  .hero-cta {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  .hero-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0;
    border-top: 1px solid var(--line);
    padding-top: 25px;
  }
  .hero-stats > div {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .hero-stats .n {
    font-size: 26px;
    letter-spacing: -0.03em;
    font-weight: 500;
  }
  .hero-stats .l {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .hero-art {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .hero-illustration {
    width: 100%;
    background: transparent;
    border: 0;
  }
  .hero-illustration img {
    display: block;
    width: 100%;
    height: auto;
    object-fit: contain;
  }

  /* ── Products chips strip ─────────────────────── */
  .products-chips-strip {
    display: flex;
    align-items: center;
    gap: 28px;
    padding: 22px 40px;
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
    background: var(--bg-elev);
  }
  .products-chips-strip .strip-label {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-muted);
    white-space: nowrap;
    flex-shrink: 0;
  }
  .products-chips-strip .chips-row {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .product-chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    background: var(--bg);
    border: 1px solid var(--line);
    border-radius: 100px;
    font-family: inherit;
    font-size: 13px;
    font-weight: 500;
    color: var(--text);
    cursor: pointer;
    transition:
      background 0.18s,
      border-color 0.18s,
      transform 0.15s;
    white-space: nowrap;
  }
  .product-chip:hover {
    border-color: var(--line-strong);
    transform: translateY(-1px);
  }
  .product-chip .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .product-chip .name {
    font-weight: 500;
  }
  .product-chip .cat {
    font-family: var(--font-mono);
    font-size: 10.5px;
    color: var(--text-muted);
    letter-spacing: 0.04em;
    margin-left: 4px;
    padding-left: 10px;
    border-left: 1px solid var(--line-strong);
  }
  .product-chip.on {
    background: var(--text);
    color: var(--bg);
    border-color: var(--text);
  }
  .product-chip.on .cat {
    color: rgba(252, 252, 252, 0.6);
    border-left-color: rgba(252, 252, 252, 0.2);
  }

  /* ── Hero rail ────────────────────────────────── */
  .hero-rail {
    display: flex;
    gap: 16px;
    margin-top: 0;
    padding: 22px 40px;
    align-items: center;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-faint);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .hero-rail .line {
    flex: 1;
    height: 1px;
    background: var(--line);
  }

  /* ── Sections ─────────────────────────────────── */
  .section {
    padding: 80px 40px;
  }
  .section-head {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 40px;
    margin-bottom: 40px;
    align-items: end;
  }
  .section-head h2 {
    font-size: clamp(28px, 4vw, 44px);
    letter-spacing: -0.03em;
    line-height: 1.02;
    max-width: 16ch;
    margin: 0;
  }
  .section-head .desc {
    color: var(--text-muted);
    font-size: 15px;
    line-height: 1.55;
    max-width: 50ch;
    margin: 0;
  }

  /* ── Carousel ─────────────────────────────────── */
  .carousel-section {
    padding-top: 64px;
  }
  .product-carousel {
    position: relative;
    background: var(--bg-elev);
    border: 1px solid var(--line);
    border-radius: var(--r-lg);
    overflow: hidden;
  }
  .carousel-slides {
    position: relative;
    height: 440px;
  }
  .carousel-slide {
    position: absolute;
    inset: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.55s cubic-bezier(0.2, 0, 0.1, 1);
  }
  .carousel-slide.on {
    opacity: 1;
    pointer-events: auto;
  }
  .cs-visual {
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .cs-visual::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(circle at 22% 28%, rgba(255, 255, 255, 0.22) 0%, transparent 55%),
      radial-gradient(circle at 78% 82%, rgba(0, 0, 0, 0.22) 0%, transparent 55%);
  }
  .cs-icon-text {
    font-family: var(--font-mono);
    font-weight: 700;
    font-size: 180px;
    color: rgba(255, 255, 255, 0.95);
    letter-spacing: -0.06em;
    position: relative;
    z-index: 2;
    line-height: 0.9;
    filter: drop-shadow(0 4px 24px rgba(0, 0, 0, 0.15));
    user-select: none;
  }
  .cs-num {
    position: absolute;
    top: 22px;
    left: 26px;
    font-family: var(--font-mono);
    font-size: 13px;
    color: rgba(255, 255, 255, 0.85);
    letter-spacing: 0.08em;
    z-index: 3;
  }
  .cs-tag {
    position: absolute;
    bottom: 22px;
    left: 26px;
    font-family: var(--font-mono);
    font-size: 11px;
    color: rgba(255, 255, 255, 0.95);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 5px 11px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 100px;
    background: rgba(0, 0, 0, 0.18);
    backdrop-filter: blur(6px);
    z-index: 3;
  }
  .cs-content {
    padding: 56px 56px 48px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    justify-content: center;
  }
  .cs-content h3 {
    font-size: 48px;
    letter-spacing: -0.035em;
    line-height: 1;
    font-weight: 500;
    margin: 0;
  }
  .cs-content .lede {
    font-size: 16px;
    line-height: 1.5;
    color: var(--text-muted);
    max-width: 42ch;
    margin: 0;
  }
  .cs-content .actions {
    display: flex;
    gap: 10px;
    margin-top: 14px;
  }

  /* Carousel footer */
  .carousel-foot {
    display: flex;
    align-items: center;
    gap: 18px;
    padding: 18px 24px;
    border-top: 1px solid var(--line);
    background: var(--bg);
  }
  .carousel-foot .progress {
    flex: 1;
    display: flex;
    gap: 8px;
  }
  .carousel-foot .pdot {
    flex: 1;
    height: 3px;
    background: var(--bg-soft);
    border: 0;
    padding: 0;
    border-radius: 100px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: background 0.15s;
  }
  .carousel-foot .pdot:hover {
    background: var(--line-strong);
  }
  .carousel-foot .pdot .bar {
    display: block;
    height: 100%;
    background: var(--text);
    width: 0;
    border-radius: 100px;
  }
  .carousel-foot .pdot.on .bar {
    animation: pdotFill 5s linear forwards;
  }
  @keyframes pdotFill {
    from {
      width: 0;
    }
    to {
      width: 100%;
    }
  }
  .carousel-foot .counter {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-faint);
    letter-spacing: 0.08em;
    min-width: 48px;
    text-align: center;
  }
  .carousel-foot .nav {
    display: flex;
    gap: 6px;
  }
  .carousel-foot .nav button {
    width: 32px;
    height: 32px;
    border-radius: 100px;
    border: 1px solid var(--line);
    background: var(--bg-elev);
    cursor: pointer;
    display: grid;
    place-items: center;
    color: var(--text-muted);
    font-family: inherit;
    transition:
      border-color 0.15s,
      color 0.15s;
  }
  .carousel-foot .nav button:hover {
    border-color: var(--text);
    color: var(--text);
  }

  /* ── Differentiators (dark) ───────────────────── */
  .diff-section {
    background: var(--venom, #060606);
    color: var(--imaculate, #fcfcfc);
    position: relative;
    overflow: hidden;
  }
  .diff-section .section-head h2 {
    color: var(--imaculate, #fcfcfc);
  }
  .diff-section .section-head .desc {
    color: rgba(252, 252, 252, 0.6);
  }
  .diff-section :global(.eyebrow) {
    color: rgba(252, 252, 252, 0.55);
  }
  .diff-section :global(.eyebrow .dot) {
    background: var(--green);
  }
  .diff-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background: rgba(252, 252, 252, 0.08);
    border: 1px solid rgba(252, 252, 252, 0.08);
    border-radius: var(--r-lg);
    overflow: hidden;
  }
  .diff-item {
    background: var(--venom, #060606);
    padding: 28px 24px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    position: relative;
  }
  .diff-item .tick {
    position: absolute;
    top: 16px;
    right: 16px;
    font-family: var(--font-mono);
    font-size: 10px;
    color: rgba(252, 252, 252, 0.35);
    letter-spacing: 0.06em;
  }
  .diff-item h4 {
    font-size: 16px;
    font-weight: 600;
    letter-spacing: -0.015em;
    margin: 0;
  }
  .diff-item p {
    color: rgba(252, 252, 252, 0.6);
    font-size: 13.5px;
    line-height: 1.5;
    margin: 0;
  }

  /* ── CTA Banner ───────────────────────────────── */
  .cta-banner {
    background: var(--bg-elev);
    border: 2px solid var(--line);
    border-radius: var(--r-lg);
    padding: 48px;
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: 32px;
    align-items: center;
    position: relative;
    overflow: hidden;
    margin-top: 40px;
  }
  .cta-banner h3 {
    font-size: 32px;
    letter-spacing: -0.03em;
    line-height: 1.05;
    max-width: 18ch;
    margin: 0;
  }
  .cta-banner .end {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    flex-wrap: wrap;
  }

  /* ── Responsive — tablet ───────────────────────── */
  @media (max-width: 820px) {
    .hero-canvas-section,
    .section,
    .hero-rail {
      padding-left: 28px;
      padding-right: 28px;
    }
    .hero-canvas-section {
      padding-top: 100px;
      padding-bottom: 88px;
    }
    .hero-grid {
      grid-template-columns: 1fr;
      gap: 36px;
    }
    .hero-illustration {
      max-width: 520px;
      margin: 0 auto;
    }
    .section-head {
      grid-template-columns: 1fr;
      gap: 16px;
    }
    .products-chips-strip {
      padding: 18px 28px;
      gap: 18px;
    }
    .carousel-slides {
      height: auto;
      min-height: 540px;
    }
    .carousel-slide {
      grid-template-columns: 1fr;
      grid-template-rows: 220px 1fr;
    }
    .cs-icon-text {
      font-size: 140px;
    }
    .cs-content {
      padding: 32px 28px;
    }
    .cs-content h3 {
      font-size: 36px;
    }
    .diff-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    .cta-banner {
      grid-template-columns: 1fr;
      padding: 32px;
    }
    .cta-banner .end {
      justify-content: flex-start;
    }
  }

  /* ── Responsive — mobile ───────────────────────── */
  @media (max-width: 480px) {
    .hero-canvas-section {
      padding: 80px 20px 56px;
    }
    .section {
      padding: 48px 20px;
    }
    .hero-rail {
      display: none;
    }
    .hero-grid {
      grid-template-columns: 1fr;
      gap: 32px;
    }
    .hero-art {
      display: none;
    }
    .display {
      font-size: clamp(28px, 8vw, 38px);
      line-height: 1.05;
      overflow-wrap: break-word;
      word-break: break-word;
    }
    .underline {
      white-space: normal;
    }
    .hero-lede {
      font-size: 15px;
      max-width: 100%;
      overflow-wrap: break-word;
    }
    .hero-cta {
      flex-direction: column;
    }
    .hero-cta .btn {
      width: 100%;
      justify-content: center;
    }
    .hero-stats {
      padding-top: 16px;
    }
    .hero-stats .n {
      font-size: 20px;
    }
    .hero-stats .l {
      font-size: 9px;
    }
    .hero-illustration {
      max-width: 280px;
      margin: 0 auto;
    }
    .section-head {
      grid-template-columns: 1fr;
      gap: 12px;
    }
    .section-head h2 {
      font-size: 26px;
    }
    .section-head .desc {
      font-size: 14px;
    }
    .products-chips-strip {
      padding: 14px 20px;
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }
    .products-chips-strip .chips-row {
      width: 100%;
      overflow-x: auto;
      flex-wrap: nowrap;
      padding-bottom: 4px;
      scrollbar-width: thin;
    }
    .product-chip {
      flex-shrink: 0;
      padding: 7px 12px;
      font-size: 12.5px;
    }
    .product-chip .cat {
      display: none;
    }
    .carousel-section {
      padding: 32px 20px;
    }
    .carousel-slides {
      height: 360px;
    }
    .carousel-slide {
      grid-template-columns: 1fr;
      grid-template-rows: 88px 1fr;
    }
    .cs-visual {
      min-height: 0;
      height: 15rem;
    }
    .cs-icon-text {
      font-size: 52px;
    }
    .cs-num {
      top: 12px;
      left: 16px;
      font-size: 11px;
    }
    .cs-tag {
      bottom: 12px;
      left: 16px;
      font-size: 10px;
      padding: 3px 8px;
    }
    .cs-content {
      padding: 100px 20px 20px;
      gap: 8px;
    }
    .cs-content h3 {
      font-size: 22px;
    }
    .cs-content .lede {
      font-size: 13px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      overflow: hidden;
    }
    .cs-content .actions {
      flex-direction: row;
      margin-top: 4px;
      gap: 8px;
    }
    .cs-content .actions a {
      flex: 1;
      justify-content: center;
      font-size: 13px;
      padding: 9px 12px;
    }
    .carousel-foot {
      padding: 14px 16px;
      gap: 10px;
    }
    .carousel-foot .counter {
      display: none;
    }
    .carousel-foot .nav button {
      width: 28px;
      height: 28px;
    }
    .diff-section .section-head h2 {
      font-size: 26px;
    }
    .diff-grid {
      grid-template-columns: 1fr;
    }
    .diff-item {
      padding: 20px 18px;
    }
    .cta-banner {
      grid-template-columns: 1fr;
      padding: 24px 20px;
    }
    .cta-banner h3 {
      font-size: 22px;
    }
    .cta-banner .end {
      flex-direction: column;
      justify-content: flex-start;
    }
    .cta-banner .end a {
      width: 100%;
      justify-content: center;
    }
  }
</style>
