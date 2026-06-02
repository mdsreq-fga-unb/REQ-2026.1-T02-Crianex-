<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import { lang } from '$lib/stores/lang';
  import { fade } from 'svelte/transition';

  // ── Navigation ─────────────────────────────────────────────────────────────
  // 'Produtos' aponta para '/' (home page) — a home exibe o portfólio de produtos
  const navItems = [
    { href: '/', pt: 'Produtos', en: 'Products' },
    { href: '/sobre', pt: 'Sobre', en: 'About' },
    { href: '/faq', pt: 'FAQ', en: 'FAQ' },
    { href: '/contato', pt: 'Contato', en: 'Contact' },
  ];

  $: pathname = $page.url.pathname;
  function isActive(href: string) {
    return pathname === href || (href !== '/' && pathname.startsWith(href));
  }

  // ── Mobile menu ─────────────────────────────────────────────────────────────
  let mobileOpen = false;
  function toggleMobile() {
    mobileOpen = !mobileOpen;
  }
  function closeMobile() {
    mobileOpen = false;
  }

  onMount(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeMobile();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // ── Language toggle ─────────────────────────────────────────────────────────
  function toggleLang() {
    lang.set($lang === 'pt' ? 'en' : 'pt');
  }
  $: tooltipText = $lang === 'en' ? 'Change language' : 'Trocar idioma';

  // ── Mini globe (lang button canvas) ────────────────────────────────────────
  let globeCanvas: HTMLCanvasElement;
  let raf: number;
  const GS = 26; // CSS px
  const GCX = GS / 2,
    GCY = GS / 2,
    GR = 8;

  function projectGlobe(lon: number, lat: number, rot: number) {
    const φ = (lat * Math.PI) / 180;
    const λ = (lon * Math.PI) / 180;
    const x = Math.cos(φ) * Math.cos(λ);
    const y = Math.sin(φ);
    const z = Math.cos(φ) * Math.sin(λ);
    return {
      x: x * Math.cos(rot) - z * Math.sin(rot),
      y,
      z: x * Math.sin(rot) + z * Math.cos(rot),
    };
  }

  // ── Tooltip ─────────────────────────────────────────────────────────────────
  let showTooltip = true;
  let autoHideTimer: ReturnType<typeof setTimeout>;
  let canDismiss = false;

  function dismissTooltip() {
    if (!canDismiss) return;
    clearTimeout(autoHideTimer);
    showTooltip = false;
  }

  onMount(() => {
    // ── Globe animation ──
    const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
    globeCanvas.width = GS * dpr;
    globeCanvas.height = GS * dpr;
    const ctx = globeCanvas.getContext('2d')!;
    ctx.scale(dpr, dpr);

    let t0: number | null = null;
    let stopped = false;

    function frame(ts: number) {
      if (t0 === null) t0 = ts;
      const t = (ts - t0) / 1000;

      // Para após 30s — globo decorativo, não precisa animar indefinidamente
      if (t > 30) {
        stopped = true;
        return;
      }

      const rot = t * 0.38;

      ctx.clearRect(0, 0, GS, GS);

      ctx.beginPath();
      ctx.arc(GCX, GCY, GR, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(28,28,26,0.05)';
      ctx.fill();

      ctx.strokeStyle = 'rgba(28,28,26,0.28)';
      ctx.lineWidth = 0.5;

      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        let pen = false;
        for (let lon = 0; lon <= 363; lon += 6) {
          const p = projectGlobe(lon, lat, rot);
          if (p.z >= 0) {
            const px = GCX + GR * p.x,
              py = GCY - GR * p.y;
            pen ? ctx.lineTo(px, py) : (ctx.moveTo(px, py), (pen = true));
          } else pen = false;
        }
        ctx.stroke();
      }
      for (let lon = 0; lon < 360; lon += 40) {
        ctx.beginPath();
        let pen = false;
        for (let lat = -90; lat <= 90; lat += 6) {
          const p = projectGlobe(lon, lat, rot);
          if (p.z >= 0) {
            const px = GCX + GR * p.x,
              py = GCY - GR * p.y;
            pen ? ctx.lineTo(px, py) : (ctx.moveTo(px, py), (pen = true));
          } else pen = false;
        }
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(GCX, GCY, GR, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(28,28,26,0.55)';
      ctx.lineWidth = 1;
      ctx.stroke();

      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    // Pausa quando aba está oculta, retoma quando visível
    function handleVisibility() {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!stopped) {
        raf = requestAnimationFrame(frame);
      }
    }
    document.addEventListener('visibilitychange', handleVisibility);

    // ── Tooltip: mínimo 3.5s visível, auto-oculta em 7s, pode ser dismissado após 3.5s ──
    setTimeout(() => {
      canDismiss = true;
    }, 3500);
    autoHideTimer = setTimeout(() => {
      showTooltip = false;
    }, 7000);

    const opts = { passive: true } as const;
    window.addEventListener('mousemove', dismissTooltip, opts);
    window.addEventListener('touchmove', dismissTooltip, opts);
    window.addEventListener('scroll', dismissTooltip, opts);
    window.addEventListener('keydown', dismissTooltip, opts);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  });

  onDestroy(() => {
    if (!browser) return;
    cancelAnimationFrame(raf);
    clearTimeout(autoHideTimer);
    window.removeEventListener('mousemove', dismissTooltip);
    window.removeEventListener('touchmove', dismissTooltip);
    window.removeEventListener('scroll', dismissTooltip);
    window.removeEventListener('keydown', dismissTooltip);
  });
</script>

<header class="site-header">
  <div class="inner">
    <!-- ── Brand ── -->
    <a href="/" class="brand" aria-label="Crianex Hub — página inicial">
      <span class="brand-mark" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 2000 2000" fill="none">
          <g transform="translate(0,2000) scale(0.1,-0.1)" fill="currentColor">
            <path
              d="M3515 10638 c-600 -1568 -1100 -2878 -1112 -2910 l-22 -58 416 2 416 3 1088 2845 c599 1565 1099 2873 1113 2908 l24 62 -416 0 -417 0 -1090 -2852z"
            />
            <path
              d="M14710 12518 l1 -483 874 -529 c481 -291 875 -535 875 -541 0 -7 -394 -250 -875 -541 l-874 -529 -1 -482 c0 -266 3 -483 6 -483 3 0 595 375 1315 833 l1309 832 0 370 -1 370 -1305 830 c-718 457 -1309 832 -1315 833 -5 2 -9 -181 -9 -480z"
            />
            <path
              d="M7814 10220 c-223 -40 -421 -182 -532 -380 -63 -113 -85 -200 -90 -360 -3 -122 -1 -158 16 -231 25 -104 57 -178 111 -258 146 -214 368 -325 651 -325 283 0 505 111 651 325 90 133 129 269 129 454 0 136 -16 223 -58 323 -92 218 -267 370 -507 439 -61 17 -300 26 -371 13z"
            />
            <path d="M10410 8010 l0 -370 1620 0 1620 0 0 370 0 370 -1620 0 -1620 0 0 -370z" />
          </g>
        </svg>
      </span>
      <span class="brand-name">Crianex Hub</span>
    </a>

    <!-- ── Nav ── -->
    <nav class="nav" aria-label="Navegação principal">
      {#each navItems as item (item.href)}
        <a
          href={item.href}
          class="nav-link"
          class:active={isActive(item.href)}
          aria-current={isActive(item.href) ? 'page' : undefined}
        >
          {$lang === 'en' ? item.en : item.pt}
        </a>
      {/each}
    </nav>

    <!-- ── Right actions ── -->
    <div class="actions">
      <!-- Lang toggle with animated globe -->
      <div class="lang-wrap">
        <button
          class="lang-globe"
          on:click={toggleLang}
          aria-label={tooltipText}
          title={tooltipText}
        >
          <canvas bind:this={globeCanvas} style="width:{GS}px;height:{GS}px;display:block;"
          ></canvas>
        </button>

        <!-- Speech bubble tooltip — shows once, fades on first interaction -->
        {#if showTooltip}
          <div class="tooltip" transition:fade={{ duration: 200 }}>
            <span class="tooltip-arrow" aria-hidden="true"></span>
            {tooltipText}
          </div>
        {/if}
      </div>

      <!-- Mobile hamburger -->
      <button
        class="menu-btn"
        class:open={mobileOpen}
        aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={mobileOpen}
        on:click={toggleMobile}
      >
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </button>
    </div>
  </div>
</header>

<!-- Mobile drawer -->
{#if mobileOpen}
  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
  <div class="mobile-backdrop" on:click={closeMobile} transition:fade={{ duration: 150 }}></div>
  <nav class="mobile-drawer" aria-label="Menu mobile" transition:fade={{ duration: 180 }}>
    {#each navItems as item (item.href)}
      <a
        href={item.href}
        class="mobile-link"
        class:active={isActive(item.href)}
        on:click={closeMobile}
      >
        {$lang === 'en' ? item.en : item.pt}
      </a>
    {/each}
    <div class="mobile-divider"></div>
    <button
      class="mobile-lang"
      on:click={() => {
        toggleLang();
        closeMobile();
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <path
          d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
        />
      </svg>
      {$lang === 'pt' ? 'Switch to English' : 'Mudar para Português'}
    </button>
  </nav>
{/if}

<!-- Spacer para compensar o fixed header -->
<div class="header-spacer" aria-hidden="true"></div>

<style>
  /* ── Header shell ──────────────────────────────────────────────────────────── */
  .site-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 40;
    background: color-mix(in srgb, var(--vitrine-surface) 86%, transparent);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border-bottom: 1px solid var(--vitrine-border);
  }

  .inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 40px;
    height: 60px;
    max-width: 1600px;
    margin: 0 auto;
  }

  .header-spacer {
    height: 60px;
    flex-shrink: 0;
  }

  /* ── Brand ─────────────────────────────────────────────────────────────────── */
  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    color: var(--venom);
    flex-shrink: 0;
  }

  .brand-mark {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: var(--venom);
  }

  .brand-name {
    font-family: var(--font-sans, 'Space Grotesk', sans-serif);
    font-size: 15px;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: var(--venom);
  }

  /* ── Navigation ────────────────────────────────────────────────────────────── */
  .nav {
    display: flex;
    align-items: center;
    gap: 32px;
  }

  .nav-link {
    font-family: var(--font-sans, 'Space Grotesk', sans-serif);
    font-size: 14px;
    font-weight: 500;
    color: var(--vitrine-text-muted);
    text-decoration: none;
    transition: color 0.15s;
    position: relative;
    white-space: nowrap;
  }

  .nav-link:hover {
    color: var(--venom);
  }

  .nav-link.active {
    color: var(--venom);
  }

  /* dot indicator after active link */
  .nav-link.active::after {
    content: '';
    display: inline-block;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--purple, #7f3fe5);
    margin-left: 5px;
    vertical-align: middle;
    position: relative;
    top: -1px;
  }

  /* ── Right actions ─────────────────────────────────────────────────────────── */
  .actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  /* ── Lang globe button ─────────────────────────────────────────────────────── */
  .lang-wrap {
    position: relative;
  }

  .lang-globe {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border: 1px solid var(--vitrine-border);
    background: transparent;
    cursor: pointer;
    transition:
      border-color 0.2s,
      background-color 0.2s;
    padding: 0;
  }

  .lang-globe:hover {
    border-color: #9a968e;
    background: color-mix(in srgb, var(--venom) 4%, transparent);
  }

  /* ── Tooltip / speech bubble ───────────────────────────────────────────────── */
  .tooltip {
    position: absolute;
    top: calc(100% + 14px);
    right: -4px;
    background: var(--venom);
    color: var(--vitrine-surface);
    font-family: var(--font-sans, 'Space Grotesk', sans-serif);
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
    padding: 6px 12px;
    border-radius: 8px;
    pointer-events: none;
    z-index: 50;
    animation: tooltip-bob 2s ease-in-out infinite;
  }

  .tooltip-arrow {
    position: absolute;
    top: -6px;
    right: 11px;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid var(--venom);
  }

  @keyframes tooltip-bob {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(3px);
    }
  }

  /* ── Mobile hamburger ──────────────────────────────────────────────────────── */
  .menu-btn {
    display: none;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5px;
    width: 38px;
    height: 38px;
    border-radius: 100px;
    border: 1px solid var(--vitrine-border);
    background: transparent;
    cursor: pointer;
    padding: 0;
  }

  .bar {
    display: block;
    width: 14px;
    height: 1.5px;
    border-radius: 1px;
    background: var(--venom);
    transition: opacity 0.2s;
  }

  /* ── Hamburger open state ──────────────────────────────────────────────────── */
  .menu-btn.open .bar:nth-child(1) {
    transform: translateY(6.5px) rotate(45deg);
  }
  .menu-btn.open .bar:nth-child(2) {
    opacity: 0;
  }
  .menu-btn.open .bar:nth-child(3) {
    transform: translateY(-6.5px) rotate(-45deg);
  }
  .bar {
    transition:
      transform 0.22s ease,
      opacity 0.15s ease;
  }

  /* ── Mobile drawer ─────────────────────────────────────────────────────────── */
  .mobile-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(6, 6, 6, 0.35);
    backdrop-filter: blur(2px);
    z-index: 39;
  }

  .mobile-drawer {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    background: var(--vitrine-surface, #fcfcfc);
    border-bottom: 1px solid var(--vitrine-border, #e8e6e2);
    z-index: 40;
    display: flex;
    flex-direction: column;
    padding: 16px 20px 24px;
    gap: 2px;
    box-shadow: 0 8px 24px rgba(6, 6, 6, 0.08);
  }

  .mobile-link {
    font-size: 18px;
    font-weight: 500;
    color: var(--vitrine-text-muted, #6b6862);
    text-decoration: none;
    padding: 12px 0;
    border-bottom: 1px solid var(--vitrine-border, #e8e6e2);
    transition: color 0.15s;
    letter-spacing: -0.01em;
  }

  .mobile-link:last-of-type {
    border-bottom: 0;
  }

  .mobile-link.active,
  .mobile-link:hover {
    color: var(--venom, #060606);
  }

  .mobile-divider {
    height: 1px;
    background: var(--vitrine-border, #e8e6e2);
    margin: 8px 0;
  }

  .mobile-lang {
    display: flex;
    align-items: center;
    gap: 10px;
    background: transparent;
    border: 0;
    cursor: pointer;
    font-family: inherit;
    font-size: 14px;
    color: var(--vitrine-text-muted, #6b6862);
    padding: 10px 0;
    text-align: left;
  }

  .mobile-lang:hover {
    color: var(--venom, #060606);
  }

  /* ── Responsive ────────────────────────────────────────────────────────────── */
  @media (max-width: 767px) {
    .inner {
      padding: 0 20px;
    }

    .nav {
      display: none;
    }

    .lang-globe {
      display: none;
    }

    .menu-btn {
      display: flex;
    }
  }
</style>
