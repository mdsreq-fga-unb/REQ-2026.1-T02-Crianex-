export const PATH_D =
  'M16.5 54c3.83-6 9.33-12 9.33-12L35.5 32.5S44 22.33 44.67 21s6.33-6.83 9.5-7 13.83 14 19 15.67 7.17-4 9.17-3.5 14.5 11.33 18.17 12 8.67-.67 10-3';

// Main path nodes
export const P: [number, number][] = [
  [16.5, 54], [26, 42], [35.3, 33], [44.9, 21], [54.2, 14],
  [63.6, 22], [73, 30], [82.5, 26], [92, 33], [101.4, 38.5], [110.5, 35],
];

// Satellite nodes: [x, y, linkToMainIndex]
export const E: [number, number, number][] = [
  [20, 69, 0], [33, 55, 1], [41, 41, 2], [55, 31, 4], [49, 6, 4],
  [69, 41, 5], [79, 15, 6], [90, 46, 8], [101, 21, 7], [113, 49, 9],
  [118, 27, 10], [24, 27, 1], [63, 46, 5], [88, 11, 7],
];

export const COL = ['#e71f84', '#7f3fe5', '#66df7a'] as const;

const _links: [number, number, number, number][] = [];
for (let i = 0; i < P.length - 1; i++) {
  const a = P[i]!, b = P[i + 1]!;
  _links.push([a[0], a[1], b[0], b[1]]);
}
E.forEach(e => {
  const m = P[e[2]]!;
  _links.push([e[0], e[1], m[0], m[1]]);
});
([[1, 3], [4, 6], [6, 8], [2, 5]] as [number, number][]).forEach(([a, b]) => {
  const na = P[a]!, nb = P[b]!;
  _links.push([na[0], na[1], nb[0], nb[1]]);
});
export const LINKS = _links;

export const NODES = [
  ...P.map((p, i) => ({ x: p[0], y: p[1], c: COL[i % 3] as string, main: true })),
  ...E.map(e => ({ x: e[0], y: e[1], c: '#bcb6db', main: false })),
];

// ── Tween utility (RAF-based) ─────────────────────────────────────────────────
export type TweenOpts = {
  from?: number; to?: number; dur?: number; delay?: number;
  ease?: (t: number) => number;
  onUpdate?: (v: number, p: number) => void;
  onComplete?: () => void;
};

export function tween(o: TweenOpts): () => void {
  const { from = 0, to = 1, dur = 1000, delay = 0, ease = t => t, onUpdate, onComplete } = o;
  let start: number | null = null;
  let raf: number;
  let cancelled = false;
  function step(ts: number) {
    if (cancelled) return;
    if (start === null) start = ts;
    let p = (ts - start - delay) / dur;
    if (p < 0) { raf = requestAnimationFrame(step); return; }
    if (p > 1) p = 1;
    onUpdate?.(from + (to - from) * ease(p), p);
    if (p < 1) raf = requestAnimationFrame(step);
    else onComplete?.();
  }
  raf = requestAnimationFrame(step);
  return () => { cancelled = true; cancelAnimationFrame(raf); };
}

export const easeOutCubic   = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeInOutSine  = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
export const easeInOutExpo  = (t: number) =>
  t === 0 ? 0 : t === 1 ? 1 : t < 0.5
    ? Math.pow(2, 20 * t - 10) / 2
    : (2 - Math.pow(2, -20 * t + 10)) / 2;
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// ViewBox centre
export const CX = 61;
export const CY = 49;
