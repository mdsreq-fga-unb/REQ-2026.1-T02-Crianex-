<script lang="ts">
  import { onMount } from 'svelte';
  import {
    PATH_D, P, LINKS, NODES,
    tween, easeOutCubic, easeInOutSine,
  } from './hero-graph-data';

  let svgRoot: SVGSVGElement;

  onMount(() => {
    const path   = svgRoot.querySelector<SVGPathElement>('.g-path');
    const dots   = svgRoot.querySelectorAll<SVGCircleElement>('.g-dot');
    const focal  = svgRoot.querySelector<SVGCircleElement>('.g-focal');
    const glow   = svgRoot.querySelector<SVGCircleElement>('.g-glow');
    if (!path || !focal || !glow) return;

    const cancels: (() => void)[] = [];
    const len = path.getTotalLength();
    path.style.strokeDasharray  = String(len);
    path.style.strokeDashoffset = String(len);

    // Draw path
    cancels.push(tween({
      from: len, to: 0, dur: 1200, delay: 250, ease: easeOutCubic,
      onUpdate: v => { path.style.strokeDashoffset = String(v); },
    }));

    // Pop dots with stagger
    dots.forEach((d, i) => {
      const targetR = d.getAttribute('stroke') !== 'none' ? 2.4 : 1.5;
      cancels.push(tween({
        from: 0, to: targetR, dur: 320, delay: 370 + i * 45, ease: easeOutCubic,
        onUpdate: v => d.setAttribute('r', String(v)),
      }));
    });

    // Focal travels back and forth in loop
    const travel = (dir: boolean) => {
      const c = tween({
        from: dir ? 0 : len, to: dir ? len : 0,
        dur: 5400, delay: 300, ease: easeInOutSine,
        onUpdate: v => {
          const pt = path.getPointAtLength(v);
          focal.setAttribute('cx', String(pt.x));
          focal.setAttribute('cy', String(pt.y));
          glow.setAttribute('cx', String(pt.x));
          glow.setAttribute('cy', String(pt.y));
        },
        onComplete: () => travel(!dir),
      });
      cancels.push(c);
    };
    travel(true);

    return () => cancels.forEach(c => c());
  });
</script>

<div class="hero-graph-panel">
  <svg
    bind:this={svgRoot}
    viewBox="0 0 122 98"
    preserveAspectRatio="xMidYMid meet"
    aria-hidden="true"
  >
    <g class="g-pov">
      <!-- Edges -->
      <g class="g-links" stroke="#d6d0ee" stroke-width="0.35" fill="none" opacity="0.75">
        {#each LINKS as [x1, y1, x2, y2]}
          <line {x1} {y1} {x2} {y2} />
        {/each}
      </g>

      <!-- Highlighted path (drawn via strokeDashoffset) -->
      <path
        class="g-path"
        d={PATH_D}
        fill="none"
        stroke="#7f3fe5"
        stroke-width="1.4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <!-- Nodes -->
      <g class="g-dots">
        {#each NODES as n}
          <circle
            class="g-dot"
            cx={n.x}
            cy={n.y}
            r="0"
            fill={n.c}
            stroke={n.main ? '#fcfcfc' : 'none'}
            stroke-width={n.main ? 0.5 : 0}
          />
        {/each}
      </g>

      <!-- Glow + focal dot (travelling) -->
      <circle class="g-glow"  r="5.0" cx={P[0]![0]} cy={P[0]![1]} fill="#e71f84" opacity="0.18" />
      <circle class="g-focal" r="2.5" cx={P[0]![0]} cy={P[0]![1]} fill="#e71f84" stroke="#fcfcfc" stroke-width="0.7" />
    </g>
  </svg>
</div>

<style>
  .hero-graph-panel {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .hero-graph-panel svg {
    width: 100%;
    height: 100%;
    display: block;
    overflow: visible;
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.g-path)  { stroke-dashoffset: 0 !important; }
    :global(.g-dot)   { r: 1.6 !important; }
    :global(.g-glow)  { opacity: 0 !important; }
    :global(.g-focal) { r: 1.7 !important; }
  }
</style>
