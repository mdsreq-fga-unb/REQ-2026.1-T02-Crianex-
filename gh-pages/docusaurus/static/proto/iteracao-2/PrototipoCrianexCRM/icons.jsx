// Crianex Hub — Shared icons + small UI atoms

const Icon = ({ name, size = 16, ...props }) => {
  const s = { width: size, height: size, fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
  const paths = {
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    arrowUp: <><path d="M7 17 17 7"/><path d="M8 7h9v9"/></>,
    arrowDown: <><path d="m6 9 6 6 6-6"/></>,
    plus: <><path d="M12 5v14"/><path d="M5 12h14"/></>,
    minus: <><path d="M5 12h14"/></>,
    check: <path d="m5 13 4 4L19 7"/>,
    x: <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>,
    menu: <><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></>,
    sparkle: <><path d="M12 3v6m0 6v6M3 12h6m6 0h6M5.5 5.5l4 4m5 5 4 4M5.5 18.5l4-4m5-5 4-4"/></>,
    layers: <><path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/></>,
    cube: <><path d="m12 3 9 5v8l-9 5-9-5V8z"/><path d="M3 8l9 5 9-5"/><path d="M12 13v9"/></>,
    bolt: <path d="M13 2 3 14h7v8l10-12h-7z"/>,
    bot: <><rect x="4" y="8" width="16" height="12" rx="2"/><path d="M12 4v4"/><circle cx="9" cy="14" r="1"/><circle cx="15" cy="14" r="1"/></>,
    radio: <><circle cx="12" cy="12" r="2"/><path d="M8.5 8.5a5 5 0 0 0 0 7"/><path d="M15.5 15.5a5 5 0 0 0 0-7"/><path d="M5 5a10 10 0 0 0 0 14"/><path d="M19 19a10 10 0 0 0 0-14"/></>,
    dashboard: <><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    folder: <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c0 .66.39 1.26 1 1.51H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    bell: <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></>,
    chart: <><path d="M3 3v18h18"/><path d="m7 14 4-4 4 4 5-5"/></>,
    pie: <><path d="M21 12a9 9 0 1 1-9-9v9z"/><path d="M21 12A9 9 0 0 0 12 3v9z"/></>,
    monitor: <><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></>,
    desktop: <><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></>,
    tablet: <><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M11 18h2"/></>,
    mobile: <><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></>,
    lock: <><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></>,
    eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></>,
    mail: <><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></>,
    linkedin: <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 11v6M8 7v.01"/><path d="M12 17v-4a2 2 0 0 1 4 0v4"/><path d="M12 17v-6"/></>,
    github: <path d="M9 19c-4 1.5-4-2.5-6-3m12 5v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 19 5.77 5.07 5.07 0 0 0 18.91 2S17.73 1.65 15 3.48a13.38 13.38 0 0 0-7 0C5.27 1.65 4.09 2 4.09 2A5.07 5.07 0 0 0 4 5.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 8 19.13V23"/>,
    twitter: <path d="M4 4l7.5 9.5L4 22h2l6.5-7L19 22h3l-8-10 7-8h-2l-5.5 6L9 4z"/>,
    pin: <><path d="M12 22s-8-7-8-13a8 8 0 0 1 16 0c0 6-8 13-8 13z"/><circle cx="12" cy="9" r="3"/></>,
    play: <path d="m6 4 14 8L6 20z"/>,
    pause: <><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></>,
    moreH: <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
    moreV: <><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></>,
    filter: <path d="M3 4h18l-7 9v6l-4 2v-8z"/>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></>,
    headset: <><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1v-7h3zM3 19a2 2 0 0 0 2 2h1v-7H3z"/></>,
    cart: <><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></>,
    whatsapp: <><path d="M3 21l1.65-4.8a8 8 0 1 1 3.4 3.38z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5.5 0 1-.3 1-.8 0-.3-.2-.5-.4-.7l-1-.6c-.3-.2-.6-.1-.8.1l-.3.4c-1-.4-1.8-1.2-2.2-2.2l.4-.3c.2-.2.3-.5.1-.8l-.6-1c-.2-.3-.4-.4-.7-.4-.5 0-.8.5-.8 1z"/></>,
    phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>,
    merge: <><path d="M6 3v6a6 6 0 0 0 6 6h6"/><path d="M18 21v-6"/><path d="m15 18 3 3 3-3"/><path d="M6 3l-3 3m3-3 3 3"/></>
  };
  return <svg viewBox="0 0 24 24" {...s} {...props}>{paths[name] || null}</svg>;
};

// Pixel-distortion image frame: a small mock used in product cards and screenshots
// Renders a grid of colored cells that subtly drift on hover (CSS only)
const PixelMock = ({ palette = ["#7f3fe5", "#e71f84", "#66df7a"], seed = 0, cols = 14, rows = 9 }) => {
  // Pseudo-random but deterministic
  const cells = [];
  let s = seed * 9301 + 49297;
  for (let i = 0; i < cols * rows; i++) {
    s = (s * 9301 + 49297) % 233280;
    const r = s / 233280;
    let bg;
    if (r < 0.55) bg = "transparent";
    else if (r < 0.78) bg = palette[0] + "33";
    else if (r < 0.9) bg = palette[1] + "33";
    else bg = palette[2] + "44";
    cells.push(bg);
  }
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gridTemplateRows: `repeat(${rows}, 1fr)`,
      width: "100%", height: "100%",
      gap: "1px"
    }}>
      {cells.map((c, i) => (
        <div key={i} style={{
          background: c,
          borderRadius: "1px",
          transition: `opacity 0.${(i % 6) + 2}s, transform 0.${(i % 6) + 3}s`
        }}/>
      ))}
    </div>
  );
};

// ─── Crianex logomark (from brand SVG) ──────────────────
// Uses currentColor so it adapts to surface (light/dark).
const LogoMark = ({ size = 28, style, ...rest }) => (
  <svg viewBox="0 0 2000 2000" width={size} height={size}
    xmlns="http://www.w3.org/2000/svg" style={style} {...rest}>
    <g transform="translate(0,2000) scale(0.1,-0.1)" fill="currentColor" stroke="none">
      <path d="M3515 10638 c-600 -1568 -1100 -2878 -1112 -2910 l-22 -58 416 2 416 3 1088 2845 c599 1565 1099 2873 1113 2908 l24 62 -416 0 -417 0 -1090 -2852z"/>
      <path d="M14710 12518 l1 -483 874 -529 c481 -291 875 -535 875 -541 0 -7 -394 -250 -875 -541 l-874 -529 -1 -482 c0 -266 3 -483 6 -483 3 0 595 375 1315 833 l1309 832 0 370 -1 370 -1305 830 c-718 457 -1309 832 -1315 833 -5 2 -9 -181 -9 -480z"/>
      <path d="M7814 10220 c-223 -40 -421 -182 -532 -380 -63 -113 -85 -200 -90 -360 -3 -122 -1 -158 16 -231 25 -104 57 -178 111 -258 146 -214 368 -325 651 -325 283 0 505 111 651 325 90 133 129 269 129 454 0 136 -16 223 -58 323 -92 218 -267 370 -507 439 -61 17 -300 26 -371 13z"/>
      <path d="M10410 8010 l0 -370 1620 0 1620 0 0 370 0 370 -1620 0 -1620 0 0 -370z"/>
    </g>
  </svg>
);

// On-dark variant — color follows surrounding text color; force a light tone if needed
const LogoMarkOnDark = ({ size = 28, style, ...rest }) => (
  <LogoMark size={size} style={{ color: "var(--imaculate, #fcfcfc)", ...style }} {...rest}/>
);

// Google G logo (SVG)
const GoogleLogo = ({ size = 18 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size}>
    <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>
    <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
    <path fill="#FBBC05" d="M11.69 28.18c-.44-1.32-.69-2.73-.69-4.18s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"/>
    <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/>
  </svg>
);

// ─── Canvas particle field that resolves into the X logo ─
// Each particle has a target position inside one of the 4 polygons,
// a brand color matching its quadrant, and a per-particle phase
// for pulsing + drift. Mouse moves add subtle parallax/scatter.
const LogoParticles = ({ density = 14, scatter = 1 }) => {
  const ref = React.useRef(null);
  const mouseRef = React.useRef({ x: 0, y: 0, active: false });
  const stateRef = React.useRef({ scatter: scatter });

  React.useEffect(() => { stateRef.current.scatter = scatter; }, [scatter]);

  React.useEffect(() => {
    const cnv = ref.current;
    if (!cnv) return;
    const ctx = cnv.getContext("2d");
    let W = 0, H = 0;
    const DPR = Math.min(2, window.devicePixelRatio || 1);

    const polys = [
      { color: "#e71f84", pts: [[5,5],[33,5],[45,37],[17,37]] },
      { color: "#66df7a", pts: [[57,5],[85,5],[73,37],[45,37]] },
      { color: "#060606", pts: [[17,43],[45,43],[33,75],[5,75]] },
      { color: "#7f3fe5", pts: [[45,43],[73,43],[85,75],[57,75]] }
    ];

    const pointInPoly = (px, py, poly) => {
      let inside = false;
      for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        const xi = poly[i][0], yi = poly[i][1];
        const xj = poly[j][0], yj = poly[j][1];
        if (((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / (yj - yi) + xi)) inside = !inside;
      }
      return inside;
    };

    let particles = [];

    const build = () => {
      particles = [];
      // Logo region: centered, taking ~70% of canvas min-dimension
      const m = Math.min(W, H);
      const logoSize = m * 0.78;
      const logoW = logoSize, logoH = logoSize * (80 / 90);
      const x0 = (W - logoW) / 2, y0 = (H - logoH) / 2;
      const cell = Math.max(6, Math.floor(logoW / density / 3));
      const cols = Math.floor(logoW / cell);
      const rows = Math.floor(logoH / cell);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const u = (c + 0.5) / cols, v = (r + 0.5) / rows;
          const lx = u * 90, ly = v * 80;
          for (const poly of polys) {
            if (pointInPoly(lx, ly, poly.pts)) {
              const tx = x0 + c * cell + cell / 2;
              const ty = y0 + r * cell + cell / 2;
              const angle = Math.random() * Math.PI * 2;
              const dist = 60 + Math.random() * 200;
              particles.push({
                tx, ty,
                x: tx + Math.cos(angle) * dist,
                y: ty + Math.sin(angle) * dist,
                vx: 0, vy: 0,
                color: poly.color,
                phase: Math.random() * Math.PI * 2,
                size: cell - 1.5,
                jx: (Math.random() - 0.5) * 2,
                jy: (Math.random() - 0.5) * 2
              });
              break;
            }
          }
        }
      }
    };

    const resize = () => {
      const r = cnv.getBoundingClientRect();
      W = r.width; H = r.height;
      cnv.width = W * DPR; cnv.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      build();
    };
    resize();

    const ro = new ResizeObserver(() => resize());
    ro.observe(cnv);

    const onMove = (e) => {
      const r = cnv.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - r.left) / r.width - 0.5,
        y: (e.clientY - r.top) / r.height - 0.5,
        active: true
      };
    };
    const onLeave = () => { mouseRef.current.active = false; };
    cnv.addEventListener("mousemove", onMove);
    cnv.addEventListener("mouseleave", onLeave);

    let t = 0, raf;
    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      const m = mouseRef.current;
      const targetMx = m.active ? m.x : 0;
      const targetMy = m.active ? m.y : 0;
      const sc = stateRef.current.scatter || 1;

      for (const p of particles) {
        // ease toward target with slight noise
        const noiseX = Math.sin(t * 0.001 + p.phase) * 1.2;
        const noiseY = Math.cos(t * 0.0013 + p.phase * 1.3) * 1.2;
        const dx = (p.tx + noiseX) - p.x;
        const dy = (p.ty + noiseY) - p.y;
        p.vx = (p.vx + dx * 0.05) * 0.78;
        p.vy = (p.vy + dy * 0.05) * 0.78;
        p.x += p.vx;
        p.y += p.vy;

        // mouse parallax (gentle)
        const ox = -targetMx * 14 * p.jx;
        const oy = -targetMy * 14 * p.jy;

        // pulse
        const pulse = 0.55 + 0.45 * Math.sin(t * 0.0022 + p.phase);

        ctx.globalAlpha = pulse * 0.92;
        ctx.fillStyle = p.color;
        const s = p.size * (0.85 + pulse * 0.15);
        ctx.fillRect(p.x + ox - s / 2, p.y + oy - s / 2, s, s);
      }
      ctx.globalAlpha = 1;

      t += 16;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      cnv.removeEventListener("mousemove", onMove);
      cnv.removeEventListener("mouseleave", onLeave);
    };
  }, [density]);

  return <canvas ref={ref} className="logo-canvas"/>;
};

// ─── Static animated grid for non-hero spaces (subtle tech texture) ─
const TechGrid = ({ color = "rgba(127, 63, 229, 0.18)" }) => {
  return (
    <div className="tech-grid" aria-hidden="true">
      <div className="tech-grid-inner" style={{ "--gc": color }}/>
    </div>
  );
};

window.Icon = Icon;
window.PixelMock = PixelMock;
window.LogoMark = LogoMark;
window.LogoMarkOnDark = LogoMarkOnDark;
window.GoogleLogo = GoogleLogo;
window.LogoParticles = LogoParticles;
window.TechGrid = TechGrid;
