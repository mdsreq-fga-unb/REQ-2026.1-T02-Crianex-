<script lang="ts">
  import { onMount } from 'svelte';
  import { lang } from '$lib/stores/lang';
  import type { PageData } from './$types';

  export let data: PageData;

  $: content = data.aboutContent[$lang] ?? data.aboutContent[data.initialLang];

  let jsReady = false;
  let activePerson = 0;

  const DELAYS = [0, 80, 140, 220] as const;

  onMount(() => {
    jsReady = true;

    const reveals = document.querySelectorAll<HTMLElement>('.reveal');
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    for (const el of reveals) io.observe(el);
    return () => io.disconnect();
  });
</script>

<svelte:head>
  <title>{content.seo.title}</title>
  <meta name="description" content={content.lede} />
  <meta property="og:title" content={content.seo.ogTitle} />
  <meta property="og:description" content={content.lede} />
  <meta property="og:type" content="website" />
</svelte:head>

<article data-testid="about-page" class:js-ready={jsReady}>
  <!-- ── Video Hero ──────────────────────────────────────────────────────── -->
  <section class="hero-wrap about-hero">
    <video class="hero-video" autoplay muted loop playsinline>
      <source
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4"
        type="video/mp4"
      />
    </video>

    <div class="hero-fg">
      <div class="hero-content">
        <div class="hero-inner">
          <span class="hero-badge reveal" style="--delay: {DELAYS[0]}ms">
            {content.heroBadge}
          </span>
          <h1 class="hero-h1 reveal" style="--delay: {DELAYS[1]}ms">{content.heroH1}</h1>
          <p class="hero-sub reveal" style="--delay: {DELAYS[2]}ms">{content.heroSub}</p>
          <div class="hero-ctas reveal" style="--delay: {DELAYS[3]}ms">
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
    <!-- Mission -->
    <section class="section mission" id="missao">
      <div class="section-head reveal" style="--delay: {DELAYS[0]}ms">
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
        {#each content.values as v, i (v.n)}
          <div class="value-card reveal" style="--delay: {DELAYS[i] ?? 0}ms">
            <span class="n">{v.n}</span>
            <h4>{v.title}</h4>
            <p>{v.body}</p>
          </div>
        {/each}
      </div>
    </section>

    <!-- Numbers -->
    <section class="section numbers" id="numeros">
      <div class="section-head reveal" style="--delay: {DELAYS[0]}ms">
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
        {#each content.stats as s, i (s.label)}
          <div class="stat reveal" style="--delay: {DELAYS[i] ?? 0}ms">
            <span class="label">{s.label}</span>
            <span class="value">{s.value}</span>
          </div>
        {/each}
      </div>
    </section>

    <!-- Team -->
    <section class="section team" id="equipe">
      <div class="section-head reveal" style="--delay: {DELAYS[0]}ms">
        <div>
          <div class="eyebrow">
            <span class="dot"></span>
            {content.peopleEyebrow}
          </div>
          <h2>{content.peopleTitle}</h2>
        </div>
      </div>
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div class="people-row" onmouseleave={() => (activePerson = 0)}>
        {#each content.people as person, i (person.n)}
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div
            class="person reveal"
            class:is-active={activePerson === i}
            class:is-dimmed={activePerson !== i}
            style="--delay: {DELAYS[i] ?? 0}ms"
            onmouseenter={() => (activePerson = i)}
          >
            <div class="person-inner">
              <div class="person-text">
                <span class="n">{person.n}</span>
                <div class="person-body">
                  <h4>{person.name}</h4>
                  <p class="person-role">{person.role}</p>
                </div>
              </div>
              <div class="avatar-wrap">
                <div class="avatar-circle">
                  <span class="avatar-initials">
                    {person.name
                      .split(' ')
                      .slice(0, 2)
                      .map((w) => w[0] ?? '')
                      .join('')
                      .toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </section>

    <!-- CTA -->
    <section class="section" id="contato">
      <div class="cta-banner reveal" style="--delay: {DELAYS[0]}ms">
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

            <a class="btn ghost" href="mailto:contato@crianex.com"> contato@crianex.com </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</article>

<style>
  /* ── Scroll reveal ──────────────────────────────────────────────────────── */
  /* .in is added dynamically via classList.add — use :global() to prevent
     Svelte from flagging it as an unused selector */
  .js-ready .reveal {
    opacity: 0;
    transform: translateY(16px);
    transition:
      opacity 0.45s ease,
      transform 0.45s ease;
    transition-delay: var(--delay, 0ms);
  }
  .js-ready .reveal:global(.in) {
    opacity: 1;
    transform: none;
  }

  /* ── Hero ──────────────────────────────────────────────────────────────── */
  .hero-wrap {
    position: relative;
    min-height: 100svh;
    overflow: hidden;
    background: #ffffff;
  }

  .hero-wrap::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 320px;
    background: linear-gradient(to bottom, transparent 0%, rgba(241, 91, 166, 0.06) 96%);
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
    font-size: clamp(44px, 5.5vw, 80px);
    line-height: 1.1;
    font-weight: 600;
    color: #111827;
    letter-spacing: -0.02em;
    margin: 0;
    white-space: pre-line;
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

  /* ── Values grid ─────────────────────────────────────────────────────────── */
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

  /* ── Numbers ─────────────────────────────────────────────────────────────── */
  .numbers {
    background: linear-gradient(
      to bottom,
      rgba(245, 62, 196, 0.07) 0%,
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

  /* ── People row ──────────────────────────────────────────────────────────── */
  .people-row {
    display: flex;
    overflow: hidden;
    transform: translateZ(0);
  }
  .person {
    flex: 1 1 0;
    min-width: 56px;
    padding: 36px 36px 36px 0;
    border-right: 1px solid var(--line);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    cursor: default;
    will-change: flex;
    transition: flex 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  .person-inner {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 100%;
    gap: 24px;
  }
  .person-text {
    flex: 0 0 auto;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .person + .person {
    padding-left: 36px;
  }
  .person:last-child {
    border-right: none;
    padding-right: 0;
  }
  .person.is-active {
    flex: 3.5 1 0;
  }
  .person.is-dimmed {
    flex: 0.3 1 0;
  }
  .people-row .n {
    font-family: var(--font-mono, monospace);
    font-size: 48px;
    color: var(--text-faint);
    letter-spacing: -0.03em;
    line-height: 1;
    display: block;
    flex-shrink: 0;
    transition:
      font-size 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94),
      color 0.4s ease;
  }
  .person.is-active .n {
    color: var(--pink, #e71f84);
  }
  .person.is-dimmed .n {
    font-size: 26px;
  }
  .avatar-wrap {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transform: scale(0.82);
    transition:
      opacity 0.28s ease 0.12s,
      transform 0.32s cubic-bezier(0.34, 1.2, 0.64, 1) 0.12s;
    pointer-events: none;
  }
  .person.is-active .avatar-wrap {
    opacity: 1;
    transform: none;
    pointer-events: auto;
  }
  .person.is-dimmed .avatar-wrap {
    opacity: 0;
    transform: scale(0.82);
    transition:
      opacity 0.12s ease,
      transform 0.15s ease;
  }
  .avatar-circle {
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: var(--bg-soft, #f4f3f1);
    border: 1px solid var(--line);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;
  }
  .avatar-circle img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
  .avatar-initials {
    font-family: var(--font-mono, monospace);
    font-size: 22px;
    font-weight: 600;
    color: var(--text-muted);
    letter-spacing: 0.06em;
    user-select: none;
  }
  .person h4 {
    font-size: 20px;
    margin: 0;
    letter-spacing: -0.01em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition:
      font-size 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94),
      opacity 0.4s ease;
  }
  .person.is-dimmed h4 {
    font-size: 13px;
    opacity: 0.45;
  }
  .person-role {
    font-size: 14px;
    line-height: 1.65;
    color: var(--text-muted);
    margin: 0;
    max-width: 38ch;
    opacity: 1;
    transform: translateY(0);
    transition:
      opacity 0.35s ease 0.18s,
      transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.18s;
  }
  .person.is-dimmed .person-role {
    opacity: 0;
    transform: translateY(8px);
    pointer-events: none;
    transition:
      opacity 0.2s ease,
      transform 0.25s ease;
  }

  /* ── CTA ─────────────────────────────────────────────────────────────────── */
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

  /* ── Tablet (≤ 820px) ───────────────────────────────────────────────────── */
  @media (max-width: 820px) {
    .about {
      --pad: 28px;
    }
    .section-head {
      grid-template-columns: 1fr;
      gap: 20px;
    }
    .values-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    .cta-banner {
      grid-template-columns: 1fr;
      padding: 28px;
    }
  }

  /* ── People row — empilha em telas menores ───────────────────────────────── */
  @media (max-width: 640px) {
    .people-row {
      flex-direction: column;
    }
    .person,
    .person.is-active,
    .person.is-dimmed {
      flex: none;
      min-width: 0;
      border-right: none;
      border-bottom: 1px solid var(--line);
      padding: 28px 0;
      transition: none;
      will-change: auto;
    }
    .person + .person {
      padding-left: 0;
    }
    .person:last-child {
      border-bottom: none;
      padding-left: 0;
    }
    .people-row .n,
    .person.is-dimmed .n {
      font-size: 42px;
      color: var(--text-faint);
    }
    .person.is-active .n {
      color: var(--pink, #e71f84);
    }
    .person h4,
    .person.is-dimmed h4 {
      font-size: 20px;
      opacity: 1;
      white-space: normal;
    }
    .avatar-wrap,
    .person.is-active .avatar-wrap {
      opacity: 1;
      transform: none;
      pointer-events: auto;
      transition: none;
      justify-content: flex-start;
    }
    .avatar-circle {
      width: 80px;
      height: 80px;
    }
    .avatar-initials {
      font-size: 15px;
    }
    .person-role,
    .person.is-dimmed .person-role {
      opacity: 1;
      transform: none;
      transition: none;
    }
  }

  /* ── Mobile (≤ 390px) ───────────────────────────────────────────────────── */
  @media (max-width: 390px) {
    .about {
      padding: 48px 20px;
      --pad: 20px;
    }
    .about-hero h1 {
      font-size: 44px;
    }
    .values-grid {
      grid-template-columns: 1fr;
      gap: 20px;
    }
    .stats-grid {
      grid-template-columns: 1fr;
      gap: 20px;
    }
    .people-row .n,
    .person.is-dimmed .n {
      font-size: 38px;
    }
    .cta-image-wrap {
      min-height: 280px;
    }
    .cta-content {
      padding: 32px 28px;
    }
  }
</style>
