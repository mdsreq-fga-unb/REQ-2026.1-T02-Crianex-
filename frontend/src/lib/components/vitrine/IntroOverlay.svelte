<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import {
    PATH_D, P, LINKS, NODES, CX, CY,
    tween, easeOutCubic, easeInOutExpo, lerp,
  } from './hero-graph-data';

  // `reveal` → remove data-intro e mostra conteúdo enquanto overlay ainda visível
  // `done`   → remove overlay do DOM
  const dispatch = createEventDispatcher<{ reveal: void; done: void }>();

  // Zoom inicial: 3.2× centrado em P[0]. Calculado em compile-time → primeiro frame já zoomado.
  const SCALE0 = 3.2;
  const LOGO_POINT = P[P.length - 1]!;
  const INITIAL_TRANSFORM = `translate(${(CX - SCALE0 * P[0]![0]).toFixed(4)} ${(CY - SCALE0 * P[0]![1]).toFixed(4)}) scale(${SCALE0})`;

  let overlayEl: HTMLDivElement;
  let svgRoot: SVGSVGElement;
  let logoVisible = false;

  onMount(() => {
    const path  = svgRoot.querySelector<SVGPathElement>('.g-path');
    const dots  = svgRoot.querySelectorAll<SVGCircleElement>('.g-dot');
    const focal = svgRoot.querySelector<SVGCircleElement>('.g-focal');
    const glow  = svgRoot.querySelector<SVGCircleElement>('.g-glow');
    const pov   = svgRoot.querySelector<SVGGElement>('.g-pov');
    if (!path || !focal || !glow || !pov) { dispatch('reveal'); dispatch('done'); return; }

    const cancels: (() => void)[] = [];
    const len = path.getTotalLength();
    path.style.strokeDasharray  = String(len);
    path.style.strokeDashoffset = String(len);
    dots.forEach(d => d.setAttribute('r', '0'));

    const cam = (s: number, fx: number, fy: number) => {
      pov.setAttribute('transform', `translate(${CX - s * fx} ${CY - s * fy}) scale(${s})`);
    };

    // 1. Path se desenha
    cancels.push(tween({ from: len, to: 0, dur: 1250, delay: 250, ease: easeOutCubic,
      onUpdate: v => { path.style.strokeDashoffset = String(v); },
    }));

    // 2. Dots pipocam
    dots.forEach((d, i) => {
      const targetR = d.getAttribute('stroke') !== 'none' ? 2.4 : 1.5;
      cancels.push(tween({ from: 0, to: targetR, dur: 340, delay: 380 + i * 42, ease: easeOutCubic,
        onUpdate: v => d.setAttribute('r', String(v)),
      }));
    });

    const setFocal = (x: number, y: number) => {
      focal.setAttribute('cx', String(x));
      focal.setAttribute('cy', String(y));
      glow.setAttribute('cx', String(x));
      glow.setAttribute('cy', String(y));
    };

    const endFocus = path.getPointAtLength(len);

    // 3. Focal percorre o path e a camera acompanha o mesmo ponto
    cancels.push(tween({ from: 0, to: len, dur: 2050, delay: 200, ease: easeInOutExpo,
      onUpdate: (v, t) => {
        const pt = path.getPointAtLength(v);
        const s = lerp(SCALE0, 1.0, t);
        setFocal(pt.x, pt.y);
        cam(s, pt.x, pt.y);
      },
    }));

    const logoTimer = setTimeout(() => {
      logoVisible = true;
    }, 2380);

    // 5a. Revela o conteúdo depois da assinatura da marca.
    const revealTimer = setTimeout(() => dispatch('reveal'), 3450);

    // 5b. Recuo 1.0→0.82 + fade overlay → done
    cancels.push(tween({ from: 0, to: 1, dur: 780, delay: 3550, ease: easeOutCubic,
      onUpdate: t => {
        const s = lerp(1.0, 0.82, t);
        const fx = lerp(endFocus.x, CX, t);
        const fy = lerp(endFocus.y, CY, t);
        cam(s, fx, fy);
        if (overlayEl) overlayEl.style.opacity = String(1 - t);
      },
      onComplete: () => dispatch('done'),
    }));

    return () => {
      cancels.forEach(c => c());
      clearTimeout(logoTimer);
      clearTimeout(revealTimer);
    };
  });
</script>

<div class="intro-overlay" bind:this={overlayEl} role="presentation" aria-hidden="true">
  <svg
    bind:this={svgRoot}
    viewBox="0 0 122 98"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    class="intro-svg"
  >
    <g class="g-pov" transform={INITIAL_TRANSFORM}>
      <g class="g-links" stroke="rgba(127,63,229,0.20)" stroke-width="0.5" fill="none">
        {#each LINKS as [x1, y1, x2, y2]}
          <line {x1} {y1} {x2} {y2} />
        {/each}
      </g>

      <path
        class="g-path"
        d={PATH_D}
        fill="none"
        stroke="#7f3fe5"
        stroke-width="1.4"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-dasharray="999"
        stroke-dashoffset="999"
      />

      <g class="g-dots">
        {#each NODES as n}
          <circle
            class="g-dot"
            cx={n.x}
            cy={n.y}
            r="0"
            fill={n.c}
            stroke={n.main ? '#fcfcfc' : 'none'}
            stroke-width={n.main ? 0.6 : 0}
          />
        {/each}
      </g>

      <circle class="g-glow"  r="5.0" cx={P[0]![0]} cy={P[0]![1]} fill="#e71f84" opacity="0.18" />
      <circle class="g-focal" r="2.5" cx={P[0]![0]} cy={P[0]![1]} fill="#e71f84" stroke="#fcfcfc" stroke-width="0.7" />

      <g transform={`translate(${LOGO_POINT[0]} ${LOGO_POINT[1]})`}>
        <g class="g-logo" class:g-logo--show={logoVisible}>
          <circle class="logo-halo" r="15" />
          <image
            class="logo-image"
            href="/favicon-512.png"
            x="-11"
            y="-11"
            width="22"
            height="22"
            preserveAspectRatio="xMidYMid meet"
          />
        </g>
      </g>
    </g>
  </svg>

  <button class="intro-skip" onclick={() => { dispatch('reveal'); dispatch('done'); }}>
    pular intro
  </button>
</div>

<style>
  .intro-overlay {
    position: fixed;
    inset: 0;
    background: #fcfcfc;
    z-index: 9999;
  }
  .intro-svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
    overflow: visible;
  }
  .g-logo {
    opacity: 0;
    pointer-events: none;
    transform-box: fill-box;
    transform-origin: center;
  }
  .g-logo--show {
    opacity: 1;
    animation: logoSettle 940ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
  }
  .logo-halo {
    fill: #fcfcfc;
    stroke: rgba(127, 63, 229, 0.18);
    stroke-width: 0.7;
    filter: drop-shadow(0 1.4px 3.2px rgba(127, 63, 229, 0.24));
  }
  .logo-image {
    filter: drop-shadow(0 0.7px 1.4px rgba(21, 19, 27, 0.18));
  }
  .intro-skip {
    position: absolute;
    bottom: 32px;
    right: 32px;
    font-family: var(--font-mono, monospace);
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #9a968e;
    background: transparent;
    border: 1px solid #e8e6e2;
    border-radius: 100px;
    padding: 8px 18px;
    cursor: pointer;
    z-index: 1;
    transition: border-color 0.2s, color 0.2s;
  }
  .intro-skip:hover {
    border-color: #7f3fe5;
    color: #7f3fe5;
  }
  @keyframes logoSettle {
    0% {
      opacity: 0;
      transform: translateY(12px) scale(0.88) rotate(-2.5deg);
    }
    38% {
      opacity: 1;
      transform: translateY(0) scale(1.05) rotate(2deg);
    }
    58% {
      transform: translateY(0) scale(0.98) rotate(-1.2deg);
    }
    76% {
      transform: translateY(0) scale(1.015) rotate(0.6deg);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1) rotate(0deg);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .intro-overlay { display: none !important; }
    .g-logo--show { animation: none; }
  }
</style>
