<script lang="ts">
  import { page } from '$app/state';

  const is404 = $derived(page.status === 404);

  // Stars geradas no módulo (estáticas) para evitar mismatch SSR/CSR
  const stars = Array.from({ length: 80 }, (_, i) => {
    const seed = i * 7919;
    const x = ((seed * 1234567) % 10000) / 100;
    const y = ((seed * 9876543) % 10000) / 100;
    const d = (((seed * 3141592) % 300) / 100 + 1).toFixed(2);
    const s = (((seed * 2718281) % 250) / 100 + 1).toFixed(1);
    const o = (((seed * 1618033) % 60) / 100 + 0.2).toFixed(2);
    return { x: `${x}%`, y: `${y}%`, d: `${d}s`, s: `${s}px`, o };
  });
</script>

<svelte:head>
  <title>{page.status} — Crianex</title>
</svelte:head>

<div class="scene">
  <div class="stars" aria-hidden="true">
    {#each stars as star}
      <div
        class="star"
        style="left:{star.x};top:{star.y};--d:{star.d};width:{star.s};height:{star.s};--o:{star.o}"
      ></div>
    {/each}
  </div>

  <div class="orb orb-purple" aria-hidden="true"></div>
  <div class="orb orb-pink" aria-hidden="true"></div>

  <div class="content">
    <div class="code-wrap" aria-hidden="true">
      <span class="code">{page.status}</span>
    </div>

    <div class="divider"></div>

    <h1 class="heading">
      {#if is404}
        Página não encontrada
      {:else}
        Algo deu errado
      {/if}
    </h1>

    <p class="sub">
      {#if is404}
        Parece que essa URL não existe ou foi movida.<br />
        Verifique o endereço ou use os links abaixo.
      {:else}
        Ocorreu um erro inesperado.<br />
        Tente novamente ou entre em contato.
      {/if}
    </p>

    <div class="actions">
      <a href="/" class="btn btn-primary">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        Ir para Home
      </a>

      <a href="mailto:contato@crianex.com" class="btn btn-ghost">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
          ></path>
          <polyline points="22,6 12,13 2,6"></polyline>
        </svg>
        Falar com a Crianex
      </a>
    </div>
  </div>
</div>

<style>
  :global(body):has(.scene) {
    background: #060606 !important;
  }

  .scene {
    position: relative;
    min-height: 100dvh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: #060606;
    padding: 32px 20px;
  }

  /* ── Stars ─────────────────────────────────── */
  .stars {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .star {
    position: absolute;
    border-radius: 50%;
    background: #fff;
    opacity: var(--o);
    animation: twinkle var(--d) ease-in-out infinite alternate;
  }

  @keyframes twinkle {
    from {
      opacity: var(--o);
      transform: scale(1);
    }
    to {
      opacity: calc(var(--o) * 0.15);
      transform: scale(0.5);
    }
  }

  /* ── Glow orbs ─────────────────────────────── */
  .orb {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(90px);
    opacity: 0.16;
  }

  .orb-purple {
    width: 560px;
    height: 560px;
    background: #7f3fe5;
    top: -160px;
    left: -140px;
    animation: drift 14s ease-in-out infinite alternate;
  }

  .orb-pink {
    width: 440px;
    height: 440px;
    background: #e71f84;
    bottom: -120px;
    right: -100px;
    animation: drift 18s ease-in-out infinite alternate-reverse;
  }

  @keyframes drift {
    from {
      transform: translate(0, 0);
    }
    to {
      transform: translate(50px, 35px);
    }
  }

  /* ── Content ───────────────────────────────── */
  .content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  /* ── 404 number ────────────────────────────── */
  .code-wrap {
    line-height: 1;
  }

  .code {
    display: block;
    font-size: clamp(120px, 22vw, 220px);
    font-weight: 700;
    letter-spacing: -0.04em;
    background: linear-gradient(135deg, #7f3fe5 0%, #e71f84 60%, #66df7a 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 0 40px rgba(127, 63, 229, 0.45))
      drop-shadow(0 0 80px rgba(231, 31, 132, 0.25));
    animation: pulse-glow 4s ease-in-out infinite;
    user-select: none;
  }

  @keyframes pulse-glow {
    0%,
    100% {
      filter: drop-shadow(0 0 40px rgba(127, 63, 229, 0.45))
        drop-shadow(0 0 80px rgba(231, 31, 132, 0.25));
    }
    50% {
      filter: drop-shadow(0 0 65px rgba(127, 63, 229, 0.72))
        drop-shadow(0 0 130px rgba(231, 31, 132, 0.45));
    }
  }

  /* ── Divider ───────────────────────────────── */
  .divider {
    width: 60px;
    height: 2px;
    background: linear-gradient(90deg, #7f3fe5, #e71f84);
    border-radius: 2px;
    margin: 10px auto 28px;
  }

  /* ── Text ──────────────────────────────────── */
  .heading {
    font-size: clamp(14px, 3vw, 20px);
    font-weight: 600;
    color: #f5f5f5;
    margin: 0 0 14px;
    text-transform: uppercase;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.14em;
  }

  .sub {
    font-size: clamp(14px, 2vw, 16px);
    color: #6b6862;
    line-height: 1.75;
    margin: 0 0 40px;
    max-width: 400px;
  }

  /* ── Buttons ───────────────────────────────── */
  .actions {
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    padding: 13px 26px;
    border-radius: 100px;
    font-family: 'Space Grotesk', system-ui, sans-serif;
    font-size: 15px;
    font-weight: 500;
    letter-spacing: -0.01em;
    text-decoration: none;
    border: 1.5px solid transparent;
    transition:
      transform 0.18s cubic-bezier(0.2, 0, 0.1, 1),
      box-shadow 0.18s,
      background 0.15s,
      border-color 0.15s;
  }

  .btn:hover {
    transform: translateY(-2px);
  }

  .btn-primary {
    background: linear-gradient(135deg, #7f3fe5, #e71f84);
    color: #fff;
    box-shadow: 0 4px 24px rgba(127, 63, 229, 0.35);
  }

  .btn-primary:hover {
    box-shadow: 0 8px 36px rgba(127, 63, 229, 0.55);
  }

  .btn-ghost {
    background: transparent;
    color: #a5a4ad;
    border-color: #25252b;
  }

  .btn-ghost:hover {
    background: rgba(127, 63, 229, 0.08);
    color: #f5f5f5;
    border-color: rgba(127, 63, 229, 0.4);
  }

  @media (max-width: 480px) {
    .actions {
      flex-direction: column;
      width: 100%;
      max-width: 280px;
    }

    .btn {
      justify-content: center;
    }
  }
</style>
