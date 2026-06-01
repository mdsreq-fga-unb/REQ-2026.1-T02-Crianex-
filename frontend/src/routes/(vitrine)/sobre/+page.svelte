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

<article class="about" data-testid="about-page">
  <section class="about-hero">
    <div class="eyebrow">
      <span class="dot"></span>
      {content.eyebrow}
    </div>
    <h1>{content.h1}</h1>
    <p class="lede">{content.lede}</p>
  </section>

  <section class="section mission">
    <div class="section-head">
      <div>
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

  <section class="section numbers">
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

  <section class="section">
    <div class="cta-banner">
      <div>
        <h3>{content.cta.title}</h3>
        <p>{content.cta.body}</p>
      </div>
      <div class="cta-actions">
        <a class="btn primary" href="mailto:comercial@crianex.com.br">
          {content.cta.emailLabel}
        </a>
        <a
          class="btn ghost"
          href="https://linkedin.com/company/crianex"
          target="_blank"
          rel="noopener noreferrer"
        >
          {content.cta.linkedinLabel}
        </a>
      </div>
    </div>
  </section>
</article>

<style>
  .about {
    --r-lg: 18px;
    --line: #e8e6e2;
    --bg-soft: #f5f3ef;
    --text-muted: #6b6862;
    --text-faint: #9a968e;

    max-width: 1200px;
    margin: 0 auto;
    padding: 80px 40px;
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

  .about-hero {
    padding: 32px 0 64px;
    border-bottom: 1px solid var(--line);
  }
  .about-hero h1 {
    font-size: clamp(40px, 6vw, 72px);
    line-height: 1.05;
    letter-spacing: -0.02em;
    margin: 0 0 24px;
    max-width: 18ch;
  }
  .lede {
    font-size: 18px;
    line-height: 1.6;
    color: var(--text-muted);
    max-width: 60ch;
  }

  .section {
    padding: 80px 0;
    border-bottom: 1px solid var(--line);
  }
  .section:last-child {
    border-bottom: none;
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
  }
  .value-card .n {
    font-family: var(--font-mono, monospace);
    font-size: 11px;
    color: var(--text-faint);
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
    background: var(--bg-soft);
    margin: 0 -40px;
    padding-left: 40px;
    padding-right: 40px;
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
    border-top: 1px solid var(--line);
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
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 32px;
    padding: 40px;
    border-radius: var(--r-lg);
    border: 1px solid var(--line);
    background: #ffffff;
  }
  .cta-banner h3 {
    font-size: 24px;
    margin: 0;
    letter-spacing: -0.01em;
  }
  .cta-banner p {
    color: var(--text-muted);
    margin: 14px 0 0;
    font-size: 14px;
    max-width: 44ch;
  }
  .cta-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
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

  @media (max-width: 768px) {
    .about {
      padding: 48px 20px;
    }
    .section-head,
    .values-grid,
    .stats-grid {
      grid-template-columns: 1fr;
      gap: 24px;
    }
    .numbers {
      margin: 0 -20px;
      padding-left: 20px;
      padding-right: 20px;
    }
    .cta-banner {
      grid-template-columns: 1fr;
      padding: 28px;
    }
  }
</style>
