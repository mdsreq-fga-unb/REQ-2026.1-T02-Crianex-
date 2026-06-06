<script lang="ts">
  import { lang } from '$lib/stores/lang';
  import type { PageData } from './$types';

  export let data: PageData;

  $: content = data.aboutContent[$lang] ?? data.aboutContent[data.initialLang];
</script>

<svelte:head>
  <title>{content.seo.title}</title>
  <meta name="description" content={content.lede} />
  <meta property="og:title" content={content.seo.ogTitle} />
  <meta property="og:description" content={content.lede} />
  <meta property="og:type" content="website" />
</svelte:head>

<article data-testid="about-page">
  <!-- ── Navbar omitido: será implementado na issue de navegação global ──── -->

  <!-- ── Video Hero ──────────────────────────────────────────────────────── -->
  <section class="hero-wrap">
    <video class="hero-video" autoplay muted loop playsinline>
      <source
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4"
        type="video/mp4"
      />
    </video>

    <div class="hero-fg">
      <!-- Bottom-left content -->
      <div class="hero-content">
        <div class="hero-inner">
          <span class="hero-badge">
            {content.heroBadge}
          </span>
          <h1 class="hero-h1">{content.heroH1}</h1>
          <p class="hero-sub">{content.heroSub}</p>
          <div class="hero-ctas">
            <a href="/contato" class="hero-cta primary">
              {content.heroCta}
              <span class="cta-arrow">→</span>
            </a>
            <a href="mailto:{content.heroCtaEmail}" class="hero-cta ghost">
              {content.heroCtaEmail}
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ── Body Content ────────────────────────────────────────────────────── -->
  <div class="about">
    <section class="section mission" id="missao">
      <div class="section-head">
        <div>
          section mission
          <div class="eyebrow">
            <span class="dot pink"></span>
            {content.missionEyebrow}
          </div>
          <h2>{content.missionTitle}</h2>
        </div>
        <p class="desc">{content.missionDesc}</p>
      </div>
      <div class="values-grid">
        {#each content.values as v (v.n)}
          <div class="value-card">
            <span class="n">{v.n}</span>
            <h4>{v.title}</h4>
            <p>{v.body}</p>
          </div>
        {/each}
      </div>
    </section>

    <section class="section numbers" id="numeros">
      <div class="section-head">
        <div>
          <div class="eyebrow">
            <span class="dot green"></span>
            {content.numbersEyebrow}
          </div>
          <h2>{content.numbersTitle}</h2>
        </div>
        <p class="desc">{content.numbersDesc}</p>
      </div>
      <div class="stats-grid">
        {#each content.stats as s (s.label)}
          <div class="stat">
            <span class="label">{s.label}</span>
            <span class="value">{s.value}</span>
          </div>
        {/each}
      </div>
    </section>

    <section class="section" id="contato">
      <div class="cta-banner">
        <div class="cta-image-wrap">
          <img src="/assets/sobre-cta.png" alt="" class="cta-image" />
        </div>
        <div class="cta-content">
          <h3>{content.cta.title}</h3>
          <p>{content.cta.body}</p>
          <div class="cta-actions">
            <a class="btn primary" href="/contato">
              {content.cta.emailLabel}
            </a>
            <a class="btn ghost" href="mailto:contato@crianex.com">contato@crianex.com</a>
          </div>
        </div>
      </div>
    </section>
  </div>
</article>

<style>
  /* ── Hero ──────────────────────────────────────────────────────────────── */
  .hero-wrap {
    position: relative;
    min-height: 100svh;
    overflow: hidden;
    background: #f0eef0;
  }

  .hero-wrap::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 320px;
    background: linear-gradient(to bottom, transparent 0%, rgba(241, 91, 166, 0.06) 100%);
    z-index: 5;
    pointer-events: none;
  }

  .hero-video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .hero-fg {
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    min-height: 100svh;
  }

  /* Bottom-left hero content */
  .hero-content {
    flex: 1;
    display: flex;
    align-items: flex-end;
    padding: 0 1.5rem 3.5rem;
  }

  @media (min-width: 640px) {
    .hero-content {
      padding: 0 3rem 5rem;
    }
  }

  @media (min-width: 1024px) {
    .hero-content {
      padding: 0 7rem 6rem;
    }
  }

  .hero-inner {
    width: 40rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 5rem;
  }

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 12px;
    font-weight: 600;
    color: var(--pink, #e71f84);
    text-decoration: none;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .hero-h1 {
    font-size: 1.875rem;
    line-height: 1.1;
    font-weight: 600;
    color: #111827;
    letter-spacing: -0.02em;
    margin: 0;
    white-space: pre-line;
  }

  @media (min-width: 640px) {
    .hero-h1 {
      font-size: 2.25rem;
    }
  }

  .hero-sub {
    font-size: 14px;
    color: #6b7280;
    font-weight: 400;
    margin: 0;
  }

  .hero-ctas {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
    margin-top: 0.25rem;
  }

  .hero-cta {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 13px;
    font-weight: 500;
    border-radius: 999px;
    padding: 0.625rem 1.375rem;
    text-decoration: none;
    transition:
      background-color 0.2s,
      color 0.2s,
      border-color 0.2s,
      opacity 0.2s;
    width: fit-content;
  }

  .hero-cta.primary {
    background: #060606;
    color: #ffffff;
    border: 1px solid #060606;
  }

  .hero-cta.primary:hover {
    background: var(--pink, #e71f84);
    border-color: var(--pink, #e71f84);
  }

  .hero-cta.primary:hover .cta-arrow {
    transform: translateX(2px);
  }

  .hero-cta.ghost {
    background: transparent;
    color: #6b7280;
    border: 1px solid #d1d5db;
    font-size: 12px;
  }

  .hero-cta.ghost:hover {
    color: #111827;
    border-color: #9ca3af;
  }

  .cta-arrow {
    display: inline-block;
    transition: transform 0.2s;
  }

  /* ── About body ─────────────────────────────────────────────────────────── */
  .about {
    --r-lg: 18px;
    --line: #000000;
    --bg-soft: #f5f3ef;
    --text-muted: #6b6862;
    --text-faint: #9a968e;
    --pad: clamp(40px, 8vw, 160px);

    padding: 80px var(--pad);
    padding-top: 0;
    color: #060606;
  }

  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 14px;
  }
  .dot {
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: var(--venom, #060606);
  }
  .dot.pink {
    background: var(--pink, #e71f84);
  }
  .dot.green {
    background: var(--green, #66df7a);
  }

  .section {
    padding: 80px 0;
    border-bottom: 1px solid var(--line);
  }
  .section:last-child {
    border-bottom: none;
  }

  /* Fades de cor por seção */
  .mission {
    background: linear-gradient(160deg, rgba(231, 43, 137, 0.06));
    margin-left: calc(-1 * var(--pad));
    margin-right: calc(-1 * var(--pad));
    padding-left: var(--pad);
    padding-right: var(--pad);
  }
  .section-head {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 48px;
    margin-bottom: 48px;
  }
  .section-head h2 {
    font-size: clamp(28px, 3.5vw, 40px);
    line-height: 1.1;
    letter-spacing: -0.01em;
    margin: 0;
    max-width: 18ch;
  }
  .desc {
    font-size: 15px;
    line-height: 1.6;
    color: var(--text-muted);
    max-width: 44ch;
    margin: 0;
  }

  .values-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
  .value-card {
    border: 1px solid var(--line);
    border-radius: var(--r-lg);
    padding: 28px;
    background: #ffffff;
    transition: border-color 0.2s;
  }
  .value-card:hover {
    border-color: var(--pink, #e71f84);
  }
  .value-card .n {
    font-family: var(--font-mono, monospace);
    font-size: 11px;
    color: var(--pink, #e71f84);
    letter-spacing: 0.08em;
  }
  .value-card h4 {
    font-size: 20px;
    margin: 16px 0 12px;
    letter-spacing: -0.01em;
  }
  .value-card p {
    font-size: 14px;
    line-height: 1.6;
    color: var(--text-muted);
    margin: 0;
  }

  .numbers {
    background: linear-gradient(
      to bottom,
      rgba(240, 180, 224, 0.07) 0%,
      rgba(255, 255, 255, 0.95) 40%
    );
    margin-left: calc(-1 * var(--pad));
    margin-right: calc(-1 * var(--pad));
    padding-left: var(--pad);
    padding-right: var(--pad);
  }
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;
  }
  .stat {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 24px 0;
    border-top: 2px solid var(--line);
    transition: border-color 0.2s;
  }
  .stat:hover {
    border-top-color: var(--green, #66df7a);
  }
  .stat .label {
    font-family: var(--font-mono, monospace);
    font-size: 11px;
    color: var(--text-faint);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .stat .value {
    font-size: clamp(40px, 5vw, 64px);
    letter-spacing: -0.02em;
    line-height: 1;
  }

  .cta-banner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    gap: 0;
    border-radius: var(--r-lg);
    border: 1px solid var(--line);
    overflow: hidden;
    background: #ffffff;
    min-height: 420px;
  }

  .cta-image-wrap {
    position: relative;
    height: 100%;
    min-height: 420px;
    overflow: hidden;
    background: linear-gradient(135deg, #fce4ef 0%, #f9d0e8 100%);
  }

  .cta-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
    display: block;
  }

  .cta-content {
    padding: 52px 48px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    background: linear-gradient(135deg, rgba(231, 31, 132, 0.03) 0%, #ffffff 60%);
    height: 100%;
    justify-content: center;
  }

  .cta-content h3 {
    font-size: clamp(32px, 3.5vw, 52px);
    margin: 0;
    letter-spacing: -0.025em;
    line-height: 1.05;
  }

  .cta-content p {
    color: var(--text-muted);
    margin: 0;
    font-size: 17px;
    line-height: 1.65;
    max-width: 38ch;
  }

  .cta-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-top: 4px;
  }
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    border-radius: 999px;
    border: 1px solid var(--line);
    font-size: 14px;
    text-decoration: none;
    color: inherit;
    background: #ffffff;
  }
  .btn.primary {
    background: #060606;
    color: #ffffff;
    border-color: #060606;
  }
  .btn.ghost {
    background: transparent;
  }

  /* ── Wide-screen (≥ 1280px) ─────────────────────────────────────────────── */
  @media (min-width: 1280px) {
    .stats-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  /* ── Mobile ─────────────────────────────────────────────────────────────── */
  @media (max-width: 768px) {
    .about {
      padding: 48px 20px;
      --pad: 20px;
    }
    .section-head,
    .values-grid,
    .stats-grid {
      grid-template-columns: 1fr;
      gap: 24px;
    }
    .cta-banner {
      grid-template-columns: 1fr;
    }
    .cta-image-wrap {
      min-height: 280px;
    }
    .cta-content {
      padding: 32px 28px;
    }
  }
</style>
