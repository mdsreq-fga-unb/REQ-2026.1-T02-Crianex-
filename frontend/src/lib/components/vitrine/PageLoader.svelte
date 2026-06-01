<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';

  export let bgColor = '#fcfcfc';
  export let message = 'Carregando';

  let globeCanvas: HTMLCanvasElement;
  let whirlCanvas: HTMLCanvasElement;
  let raf: number;

  const S = 200;
  const CX = S / 2;
  const CY = S / 2;
  const R = 62;

  function project(lon: number, lat: number, rot: number) {
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

  onMount(() => {
    const dpr = Math.min(window.devicePixelRatio ?? 1, 2);

    function setup(c: HTMLCanvasElement) {
      c.width = S * dpr;
      c.height = S * dpr;
      const ctx = c.getContext('2d')!;
      ctx.scale(dpr, dpr);
      return ctx;
    }

    const gc = setup(globeCanvas);
    const wc = setup(whirlCanvas);

    const rings = [
      { rad: 78, n: 3, spd: 0.9, len: 0.9, w: 2.4, a: 0.5 },
      { rad: 88, n: 2, spd: -0.62, len: 1.25, w: 1.6, a: 0.32 },
      { rad: 97, n: 4, spd: 1.35, len: 0.55, w: 1.1, a: 0.22 },
    ];

    const motes = Array.from({ length: 14 }, () => ({
      base: 70 + Math.random() * 30,
      ang: Math.random() * Math.PI * 2,
      spd: (0.4 + Math.random() * 1.1) * (Math.random() < 0.5 ? -1 : 1),
      r: 0.7 + Math.random() * 1.3,
      wob: Math.random() * Math.PI * 2,
      amp: 2 + Math.random() * 5,
    }));

    let t0: number | null = null;

    function globe(rot: number) {
      gc.clearRect(0, 0, S, S);
      gc.beginPath();
      gc.arc(CX, CY, R, 0, Math.PI * 2);
      gc.fillStyle = 'rgba(28,28,26,0.045)';
      gc.fill();

      gc.strokeStyle = 'rgba(28,28,26,0.12)';
      gc.lineWidth = 0.6;

      for (let lat = -80; lat <= 80; lat += 20) {
        gc.beginPath();
        let pen = false;
        for (let lon = 0; lon <= 363; lon += 3) {
          const p = project(lon, lat, rot);
          if (p.z >= 0) {
            const px = CX + R * p.x,
              py = CY - R * p.y;
            pen ? gc.lineTo(px, py) : (gc.moveTo(px, py), (pen = true));
          } else pen = false;
        }
        gc.stroke();
      }

      for (let lon = 0; lon < 360; lon += 20) {
        gc.beginPath();
        let pen = false;
        for (let lat = -90; lat <= 90; lat += 3) {
          const p = project(lon, lat, rot);
          if (p.z >= 0) {
            const px = CX + R * p.x,
              py = CY - R * p.y;
            pen ? gc.lineTo(px, py) : (gc.moveTo(px, py), (pen = true));
          } else pen = false;
        }
        gc.stroke();
      }

      gc.beginPath();
      gc.arc(CX, CY, R, 0, Math.PI * 2);
      gc.strokeStyle = '#1c1c1a';
      gc.lineWidth = 1.4;
      gc.stroke();
    }

    function whirl(t: number) {
      wc.clearRect(0, 0, S, S);

      for (const ring of rings) {
        for (let i = 0; i < ring.n; i++) {
          const a0 = (i / ring.n) * Math.PI * 2 + t * ring.spd;
          const a1 = a0 + ring.len;
          for (let s = 0; s < 26; s++) {
            const f0 = s / 26;
            const ang0 = a0 + (a1 - a0) * f0;
            const ang1 = a0 + (a1 - a0) * ((s + 1) / 26);
            const depth = (Math.sin(ang0) + 1) / 2;
            const al = ring.a * (0.25 + 0.75 * f0) * (0.45 + 0.55 * depth);
            wc.strokeStyle = `rgba(28,28,26,${al.toFixed(3)})`;
            wc.lineWidth = ring.w * (0.5 + 0.5 * f0);
            wc.lineCap = 'round';
            wc.beginPath();
            wc.moveTo(CX + Math.cos(ang0) * ring.rad, CY + Math.sin(ang0) * ring.rad);
            wc.lineTo(CX + Math.cos(ang1) * ring.rad, CY + Math.sin(ang1) * ring.rad);
            wc.stroke();
          }
        }
      }

      for (const m of motes) {
        const ang = m.ang + t * m.spd;
        const rad = m.base + Math.sin(t * 0.8 + m.wob) * m.amp;
        const depth = (Math.sin(ang) + 1) / 2;
        wc.fillStyle = `rgba(28,28,26,${(0.12 + 0.32 * depth).toFixed(3)})`;
        wc.beginPath();
        wc.arc(CX + Math.cos(ang) * rad, CY + Math.sin(ang) * rad, m.r, 0, Math.PI * 2);
        wc.fill();
      }
    }

    function frame(ts: number) {
      if (t0 === null) t0 = ts;
      const t = (ts - t0) / 1000;
      globe(t * 0.45);
      whirl(t);
      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);
  });

  onDestroy(() => cancelAnimationFrame(raf));
</script>

<div
  class="wrap"
  style="background-color: {bgColor}"
  in:fade={{ duration: 220 }}
  out:fade={{ duration: 180 }}
>
  <div class="inner">
    <div class="stage">
      <canvas bind:this={whirlCanvas} class="layer" style="width:{S}px;height:{S}px"></canvas>
      <canvas bind:this={globeCanvas} class="layer" style="width:{S}px;height:{S}px"></canvas>
    </div>
    <p class="msg">{message}</p>
  </div>
</div>

<style>
  .wrap {
    position: fixed;
    inset: 0;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .stage {
    position: relative;
    width: 200px;
    height: 200px;
  }

  .layer {
    position: absolute;
    inset: 0;
    display: block;
  }

  .msg {
    font-family: var(--font-mono, 'JetBrains Mono', monospace);
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #9a968e;
    margin: 0;
  }
</style>
