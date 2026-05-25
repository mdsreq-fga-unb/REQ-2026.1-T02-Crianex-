// Crianex Hub — Public site (Vitrine)
// Pages: Home, ProductDetail, About, Contact, FAQ

const { useState, useEffect, useRef, useMemo } = React;

// ─── Reveal-on-scroll wrapper ────────────────────────────
const Reveal = ({ children, delay = 0, as: As = "div", className = "", ...rest }) => {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    // find the closest scroll container (viewport-inner) for IO root
    let root = el.closest('.viewport-inner') || null;
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }),
      { root, threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <As ref={ref} className={`reveal ${shown ? "in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }} {...rest}>
      {children}
    </As>
  );
};

// ─── Site header ─────────────────────────────────────────
const SiteHeader = ({ page, setPage, lang, setLang }) => {
  const t = CrxData.t.nav;
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a className="brand" onClick={() => setPage({ name: "home" })} style={{ cursor: "pointer" }}>
          <LogoMark size={26}/>
          <span>Crianex Hub</span>
        </a>
        <nav className="nav">
          <a className={page.name === "home" ? "active" : ""} onClick={() => setPage({ name: "home" })}>{t.products[lang]}</a>
          <a className={page.name === "about" ? "active" : ""} onClick={() => setPage({ name: "about" })}>{t.about[lang]}</a>
          <a className={page.name === "faq" ? "active" : ""} onClick={() => setPage({ name: "faq" })}>{t.faq[lang]}</a>
          <a className={page.name === "contact" ? "active" : ""} onClick={() => setPage({ name: "contact" })}>{t.contact[lang]}</a>
        </nav>
        <div style={{ flex: 1 }}/>
        <div className="lang-switch">
          <button className={lang === "pt" ? "on" : ""} onClick={() => setLang("pt")}>PT</button>
          <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")}>EN</button>
        </div>
        <button className="menu-btn" aria-label="menu"><Icon name="menu" size={16}/></button>
      </div>
    </header>
  );
};

// ─── Site footer ─────────────────────────────────────────
const SiteFooter = ({ lang, setPage }) => {
  const f = CrxData.t.footer;
  return (
    <footer className="site-footer">
      <div className="site-footer-grid">
        <div>
          <div className="brand" style={{ color: "var(--imaculate)", marginBottom: 16 }}>
            <LogoMarkOnDark size={26}/>
            <span>Crianex Hub</span>
          </div>
          <p style={{ color: "rgba(252,252,252,0.55)", fontSize: 13, lineHeight: 1.55, maxWidth: 34 + "ch", margin: 0 }}>
            {f.tag[lang]}
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <a aria-label="LinkedIn" style={{ width: 32, height: 32, borderRadius: 100, border: "1px solid rgba(252,252,252,0.15)", display: "grid", placeItems: "center" }}><Icon name="linkedin" size={14}/></a>
            <a aria-label="GitHub" style={{ width: 32, height: 32, borderRadius: 100, border: "1px solid rgba(252,252,252,0.15)", display: "grid", placeItems: "center" }}><Icon name="github" size={14}/></a>
            <a aria-label="X" style={{ width: 32, height: 32, borderRadius: 100, border: "1px solid rgba(252,252,252,0.15)", display: "grid", placeItems: "center" }}><Icon name="twitter" size={14}/></a>
          </div>
        </div>
        <div>
          <h5>{f.cols.products[lang]}</h5>
          <ul>
            {CrxData.products.slice(0, 4).map(p => (
              <li key={p.id}><a onClick={() => setPage({ name: "product", id: p.id })} style={{ cursor: "pointer" }}>{p.name}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h5>{f.cols.company[lang]}</h5>
          <ul>
            {f.links.company.map((l, i) => <li key={i}><a>{l[lang]}</a></li>)}
          </ul>
        </div>
        <div>
          <h5>{f.cols.resources[lang]}</h5>
          <ul>
            {f.links.resources.map((l, i) => <li key={i}><a>{l[lang]}</a></li>)}
          </ul>
        </div>
      </div>
      <div className="bottom">
        <span>{f.copyright[lang]}</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: 50, background: "var(--green)" }}/>
          {lang === "pt" ? "Todos os sistemas operacionais" : "All systems operational"}
        </span>
      </div>
    </footer>
  );
};

// ─── Home ────────────────────────────────────────────────
const HomePage = ({ lang, setPage }) => {
  const t = CrxData.t;
  const [accent, setAccent] = useState(0);
  const accents = ["#7f3fe5", "#e71f84", "#66df7a"];

  useEffect(() => {
    const i = setInterval(() => setAccent(a => (a + 1) % 3), 2200);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="page-fade">
      <section className="hero hero-canvas-section">
        <div className="hero-bg">
          <div className="hero-orb a"/>
          <div className="hero-orb b"/>
          <div className="hero-orb c"/>
        </div>
        <div className="hero-content">
          <div className="hero-grid">
            <div>
              <Reveal as="div" className="eyebrow" style={{ marginBottom: 28 }}>
                <span className="dot"/>{t.eyebrow[lang]}
              </Reveal>
              <Reveal as="h1" className="display" delay={80}>
                {t.heroH[lang][0]}{" "}
                <span className="underline">
                  <span className="swatch" style={{ background: accents[accent] }}/>
                  {t.heroH[lang][1]}
                </span>{" "}
                {t.heroH[lang][2]}
              </Reveal>
              <Reveal as="p" className="hero-lede" delay={160} style={{ marginTop: 28 }}>{t.heroLede[lang]}</Reveal>
              <Reveal className="hero-cta" delay={220} style={{ marginTop: 28 }}>
                <button className="btn" onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}>
                  {t.cta.seeProducts[lang]} <Icon name="arrowUp" size={14} className="arrow"/>
                </button>
                <button className="btn ghost" onClick={() => setPage({ name: "contact" })}>{t.cta.talk[lang]}</button>
              </Reveal>
              <Reveal className="hero-stats" delay={280} style={{ marginTop: 36 }}>
                <div><span className="n">6</span><span className="l">{lang === "pt" ? "Produtos" : "Products"}</span></div>
                <div><span className="n">184</span><span className="l">{lang === "pt" ? "Clientes B2B" : "B2B clients"}</span></div>
                <div><span className="n">99.94%</span><span className="l">{lang === "pt" ? "Uptime 12 meses" : "12-mo uptime"}</span></div>
              </Reveal>
            </div>
            <div className="hero-art">
              <div className="hero-art-frame">
                <LogoParticles density={14}/>
                <div className="hero-art-corners">
                  <span/><span/><span/><span/>
                </div>
                <div className="hero-art-meta">
                  <span>X·MARK</span>
                  <span className="sep"/>
                  <span>{lang === "pt" ? "reagrupando" : "reassembling"}</span>
                </div>
                <div className="hero-art-pulse">
                  <span className="pulse-dot"/>
                  <span>LIVE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="hero-rail">
        <span>{lang === "pt" ? "Em uso por times de" : "Used by teams at"}</span>
        <span className="line"/>
        <span>NIVERA</span><span>·</span><span>Folha Sistemas</span><span>·</span><span>Editora Versa</span><span>·</span><span>Quantum Lab</span><span>·</span><span>Aletheia</span>
      </div>

      {/* Products grid */}
      <section className="section" id="products">
        <div className="section-head">
          <Reveal>
            <div className="eyebrow" style={{ marginBottom: 14 }}><span className="dot" style={{ background: "var(--pink)" }}/>{t.products.eyebrow[lang]}</div>
            <h2>{t.products.title[lang]}</h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="desc">{t.products.desc[lang]}</p>
          </Reveal>
        </div>

        <div className="product-grid">
          {CrxData.products.map((p, i) => (
            <Reveal key={p.id} delay={i * 60}
              className={`product-card ${i === 0 ? "feature" : ""}`}
              onClick={() => setPage({ name: "product", id: p.id })}
            >
              <div className="pixel-bg"/>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div className="pcat" style={{ color: p.color }}>{p.cat[lang]}</div>
                <div className="mono" style={{ fontSize: 10, color: "var(--text-faint)", letterSpacing: "0.08em" }}>0{i + 1}</div>
              </div>
              <div className="picon" style={{ background: p.color }}>{p.iconText}</div>
              {i === 0 && (
                <div style={{ position: "relative", height: 120, marginTop: 4, borderRadius: 10, overflow: "hidden", background: "#0f0d14" }}>
                  <PixelMock palette={["#7f3fe5", "#e71f84", "#66df7a"]} seed={3} cols={24} rows={10}/>
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 30%, #0f0d14 95%)" }}/>
                </div>
              )}
              <h3>{p.name}</h3>
              <p className="pdesc">{p.tagline[lang]}</p>
              <div className="plink">
                {t.cta.learnMore[lang]}
                <Icon name="arrow" size={14}/>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Differentiators */}
      <section className="section diff-section">
        <div className="section-head">
          <Reveal>
            <div className="eyebrow" style={{ marginBottom: 14 }}><span className="dot"/>{t.diff.eyebrow[lang]}</div>
            <h2>{t.diff.title[lang]}</h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="desc">{t.diff.desc[lang]}</p>
          </Reveal>
        </div>

        <Reveal className="diff-grid">
          {CrxData.differentiators.map((d, i) => (
            <div className="diff-item" key={i}>
              <span className="tick">{d.tick}</span>
              <div className="ico"><DiffIcon name={d.icon}/></div>
              <h4>{d.title[lang]}</h4>
              <p>{d.desc[lang]}</p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* CTA banner */}
      <section className="section" style={{ paddingTop: 0 }}>
        <Reveal className="cta-banner">
          <div>
            <div className="eyebrow" style={{ marginBottom: 14 }}><span className="dot" style={{ background: "var(--green)" }}/>{lang === "pt" ? "Próximo passo" : "Next step"}</div>
            <h3>{t.cta2.title[lang]}</h3>
            <p style={{ color: "var(--text-muted)", marginTop: 14, fontSize: 14 }}>{t.cta2.desc[lang]}</p>
          </div>
          <div className="end">
            <button className="btn" onClick={() => setPage({ name: "contact" })}>
              {t.cta.talk[lang]} <Icon name="arrow" size={14} className="arrow"/>
            </button>
            <button className="btn ghost" onClick={() => setPage({ name: "about" })}>{lang === "pt" ? "Sobre a Crianex" : "About Crianex"}</button>
          </div>
        </Reveal>
      </section>
    </div>
  );
};

// Differentiator icons
const DiffIcon = ({ name }) => {
  if (name === "k8s") return <Icon name="cube" size={18}/>;
  if (name === "tenant") return <Icon name="layers" size={18}/>;
  if (name === "ai") return <Icon name="sparkle" size={18}/>;
  if (name === "ws") return <Icon name="radio" size={18}/>;
  return null;
};

// ─── Product Detail ──────────────────────────────────────
const ProductPage = ({ lang, productId, setPage }) => {
  const p = CrxData.products.find(x => x.id === productId) || CrxData.products[0];
  const t = CrxData.t;
  const hasFeatures = !!p.features;

  return (
    <div className="page-fade">
      <section className="detail-hero">
        <div>
          <Reveal as="button"
            onClick={() => setPage({ name: "home" })}
            style={{ background: "transparent", border: 0, padding: 0, display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-muted)", marginBottom: 28, cursor: "pointer" }}>
            <Icon name="arrow" size={14} style={{ transform: "rotate(180deg)" }}/> {t.cta.back[lang]}
          </Reveal>
          <Reveal style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 24 }}>
            <div className="picon" style={{ background: p.color, width: 64, height: 64, fontSize: 24, borderRadius: 14 }}>{p.iconText}</div>
            <div>
              <div className="eyebrow" style={{ marginBottom: 4 }}>
                <span className="dot" style={{ background: p.color }}/>
                {p.cat[lang]}
              </div>
              <h1 style={{ fontSize: "clamp(40px, 6vw, 64px)", letterSpacing: "-0.035em", lineHeight: 1 }}>{p.name}</h1>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <p style={{ fontSize: 18, lineHeight: 1.5, color: "var(--text-muted)", maxWidth: "44ch" }}>{p.lede ? p.lede[lang] : p.tagline[lang]}</p>
          </Reveal>
          <Reveal delay={160} style={{ display: "flex", gap: 10, marginTop: 28 }}>
            <button className="btn" onClick={() => setPage({ name: "contact" })}>
              {t.cta.talk[lang]} <Icon name="arrow" size={14} className="arrow"/>
            </button>
            <button className="btn ghost">{lang === "pt" ? "Documentação" : "Documentation"}</button>
          </Reveal>
        </div>
        <div>
          {p.stats && (
            <Reveal className="detail-stats" delay={120}>
              {p.stats.map((s, i) => (
                <div key={i}>
                  <div className="mono" style={{ fontSize: 11, color: "var(--text-faint)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>{s.k[lang]}</div>
                  <div style={{ fontSize: 36, letterSpacing: "-0.03em", fontWeight: 500 }}>{s.v}</div>
                </div>
              ))}
            </Reveal>
          )}
          <Reveal delay={180} style={{ marginTop: 24 }}>
            <div className="card" style={{ padding: 18, display: "flex", flexDirection: "column", gap: 10 }}>
              <div className="mono" style={{ fontSize: 11, color: "var(--text-faint)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{lang === "pt" ? "Público-alvo" : "Target audience"}</div>
              <div style={{ fontSize: 14, lineHeight: 1.5 }}>{p.audience[lang]}</div>
            </div>
          </Reveal>
        </div>
      </section>

      {hasFeatures && (
        <section className="section">
          <div className="section-head">
            <Reveal>
              <div className="eyebrow" style={{ marginBottom: 14 }}><span className="dot" style={{ background: p.color }}/>{lang === "pt" ? "Funcionalidades" : "Capabilities"}</div>
              <h2>{lang === "pt" ? "O que está incluso." : "What's included."}</h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="desc">{lang === "pt"
                ? "Todas as features abaixo estão disponíveis em qualquer plano. O pricing escala por volume, não por feature."
                : "Every feature below ships in every plan. Pricing scales with volume, not feature gates."}</p>
            </Reveal>
          </div>

          <Reveal className="feature-list">
            {p.features.map((f, i) => (
              <div key={i} className="feat">
                <span className="n">F.{String(i + 1).padStart(2, "0")}</span>
                <h4>{f.title[lang]}</h4>
                <p>{f.desc[lang]}</p>
              </div>
            ))}
          </Reveal>

          {/* Screenshot mock */}
          <Reveal className="screenshot-frame" delay={80}>
            <div className="browser-bar">
              <span className="dot" style={{ background: "#e71f84", opacity: 0.4 }}/>
              <span className="dot" style={{ background: "#7f3fe5", opacity: 0.4 }}/>
              <span className="dot" style={{ background: "#66df7a", opacity: 0.5 }}/>
              <span style={{ marginLeft: 12 }}>{p.id}.crianex.com/dashboard</span>
            </div>
            <div className="screenshot-mock">
              <div className="sb">
                <div className="row" style={{ height: 32, background: p.color, opacity: 0.18 }}/>
                <div className="row active"/>
                <div className="row"/>
                <div className="row"/>
                <div className="row"/>
                <div className="row" style={{ width: "70%" }}/>
                <div className="row" style={{ width: "85%" }}/>
              </div>
              <div className="main">
                <div style={{ display: "flex", gap: 12 }}>
                  <div className="row" style={{ flex: 1 }}/>
                  <div className="row" style={{ width: 120 }}/>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                  <div className="card" style={{ padding: 14, display: "flex", flexDirection: "column", gap: 6 }}>
                    <span className="mono" style={{ fontSize: 10, color: "var(--text-faint)" }}>ATIVOS</span>
                    <span style={{ fontSize: 22, letterSpacing: "-0.02em", fontWeight: 500 }}>1,284</span>
                  </div>
                  <div className="card" style={{ padding: 14, display: "flex", flexDirection: "column", gap: 6 }}>
                    <span className="mono" style={{ fontSize: 10, color: "var(--text-faint)" }}>EVENTOS</span>
                    <span style={{ fontSize: 22, letterSpacing: "-0.02em", fontWeight: 500 }}>9.4K</span>
                  </div>
                  <div className="card" style={{ padding: 14, display: "flex", flexDirection: "column", gap: 6 }}>
                    <span className="mono" style={{ fontSize: 10, color: "var(--text-faint)" }}>LATÊNCIA</span>
                    <span style={{ fontSize: 22, letterSpacing: "-0.02em", fontWeight: 500 }}>112<span style={{ fontSize: 12, color: "var(--text-muted)" }}> ms</span></span>
                  </div>
                </div>
                <div style={{ flex: 1, position: "relative", background: "var(--bg-soft)", borderRadius: 10, padding: 14, overflow: "hidden", minHeight: 140 }}>
                  <PixelMock palette={[p.color, "#7f3fe5", "#66df7a"]} seed={p.id.charCodeAt(0)} cols={36} rows={10}/>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      )}

      <section className="section" style={{ paddingTop: 0 }}>
        <Reveal className="cta-banner">
          <div>
            <h3>{lang === "pt"
              ? `Pronto pra ver o ${p.name} no seu contexto?`
              : `Ready to see ${p.name} in your context?`}</h3>
            <p style={{ color: "var(--text-muted)", marginTop: 14, fontSize: 14 }}>
              {lang === "pt"
                ? "Agendamos uma demo de 30 minutos com o time de produto."
                : "We schedule a 30-min demo with the product team."}
            </p>
          </div>
          <div className="end">
            <button className="btn" onClick={() => setPage({ name: "contact" })}>{lang === "pt" ? "Agendar demo" : "Book a demo"} <Icon name="arrow" size={14} className="arrow"/></button>
          </div>
        </Reveal>
      </section>
    </div>
  );
};

// ─── About ───────────────────────────────────────────────
const AboutPage = ({ lang }) => {
  const a = CrxData.t.about;
  return (
    <div className="page-fade">
      <section className="about-hero">
        <Reveal as="div" className="eyebrow" style={{ marginBottom: 32 }}>
          <span className="dot"/>{a.eyebrow[lang]}
        </Reveal>
        <Reveal as="h1" delay={80}>{a.h1[lang]}</Reveal>
        <Reveal as="p" className="lede" delay={140}>{a.lede[lang]}</Reveal>
      </section>

      <section className="section">
        <div className="section-head">
          <Reveal>
            <div className="eyebrow" style={{ marginBottom: 14 }}><span className="dot" style={{ background: "var(--pink)" }}/>{a.missionEyebrow[lang]}</div>
            <h2>{a.missionTitle[lang]}</h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="desc">{lang === "pt"
              ? "Três princípios escolhidos não pela retórica, mas porque mudam decisões reais — de contratação a release."
              : "Three principles chosen not for rhetoric, but because they change real decisions — from hiring to releases."}</p>
          </Reveal>
        </div>
        <div className="values-grid">
          {CrxData.values.map((v, i) => (
            <Reveal key={i} delay={i * 80} className="value-card">
              <span className="n">{v.n}</span>
              <h4>{v.title[lang]}</h4>
              <p>{v.body[lang]}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="about-people">
        <div className="section-head" style={{ marginBottom: 24 }}>
          <Reveal>
            <div className="eyebrow" style={{ marginBottom: 14 }}><span className="dot" style={{ background: "var(--green)" }}/>{lang === "pt" ? "Em números" : "By the numbers"}</div>
            <h2>{lang === "pt" ? "Sete anos. Seis produtos. Um time enxuto." : "Seven years. Six products. One lean team."}</h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="desc">{lang === "pt"
              ? "Crescemos pela qualidade do produto, não pelo tamanho do time. Estrutura compartilhada permite alavancagem incomum."
              : "We grow through product quality, not headcount. Shared infrastructure gives us unusual leverage."}</p>
          </Reveal>
        </div>
        <Reveal className="people-row">
          {a.stats.map((s, i) => (
            <div className="stat" key={i}>
              <span className="mono" style={{ fontSize: 11, color: "var(--text-faint)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{s.l[lang]}</span>
              <span className="n">{s.n}</span>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="section">
        <Reveal className="cta-banner">
          <div>
            <h3>{lang === "pt" ? "Trabalhar com a gente." : "Work with us."}</h3>
            <p style={{ color: "var(--text-muted)", marginTop: 14, fontSize: 14, maxWidth: "44ch" }}>
              {lang === "pt"
                ? "Tanto como cliente quanto como engenheiro. Estamos abertos para conversa nas duas frentes."
                : "Either as a customer or an engineer. We're open to both kinds of conversation."}
            </p>
          </div>
          <div className="end">
            <a className="btn"><Icon name="mail" size={14}/> comercial@crianex.com.br</a>
            <a className="btn ghost"><Icon name="linkedin" size={14}/> LinkedIn</a>
          </div>
        </Reveal>
      </section>
    </div>
  );
};

// ─── Contact ─────────────────────────────────────────────
const ContactPage = ({ lang }) => {
  const c = CrxData.t.contact;
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", product: "avali", message: "" });
  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const submit = (e) => { e.preventDefault(); setSent(true); };
  return (
    <div className="page-fade contact-layout">
      <div className="contact-info">
        <Reveal as="div" className="eyebrow" style={{ marginBottom: 18 }}>
          <span className="dot" style={{ background: "var(--pink)" }}/>{lang === "pt" ? "Contato comercial" : "Sales contact"}
        </Reveal>
        <Reveal as="h1" delay={60}>{c.h1[lang]}</Reveal>
        <Reveal as="p" className="lede" delay={120}>{c.lede[lang]}</Reveal>
        <Reveal className="channels" delay={180}>
          {c.channels.map((ch, i) => (
            <div className="channel" key={i}>
              <span className="k">{ch.k}</span>
              <span className="v">{typeof ch.v === "string" ? ch.v : ch.v[lang]}</span>
            </div>
          ))}
        </Reveal>
        <Reveal delay={220} style={{ marginTop: 28, display: "flex", gap: 10 }}>
          <a aria-label="LinkedIn" className="btn ghost sm"><Icon name="linkedin" size={14}/> LinkedIn</a>
          <a aria-label="Email" className="btn ghost sm"><Icon name="mail" size={14}/> {lang === "pt" ? "Enviar e-mail" : "Send email"}</a>
        </Reveal>
      </div>

      <Reveal className="form" delay={120}>
        {!sent ? (
          <form onSubmit={submit}>
            <div className="field">
              <label>{c.fields.name[lang]}</label>
              <input type="text" required placeholder={c.placeholder.name[lang]} value={form.name} onChange={e => update("name", e.target.value)}/>
            </div>
            <div className="field-row">
              <div className="field">
                <label>{c.fields.email[lang]}</label>
                <input type="email" required placeholder={c.placeholder.email[lang]} value={form.email} onChange={e => update("email", e.target.value)}/>
              </div>
              <div className="field">
                <label>{c.fields.company[lang]}</label>
                <input type="text" placeholder={c.placeholder.company[lang]} value={form.company} onChange={e => update("company", e.target.value)}/>
              </div>
            </div>
            <div className="field">
              <label>{c.fields.product[lang]}</label>
              <select value={form.product} onChange={e => update("product", e.target.value)}>
                {CrxData.products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} — {p.cat[lang]}</option>
                ))}
                <option value="other">{lang === "pt" ? "Outro / não tenho certeza" : "Other / not sure"}</option>
              </select>
            </div>
            <div className="field">
              <label>{c.fields.message[lang]}</label>
              <textarea required placeholder={c.placeholder.message[lang]} value={form.message} onChange={e => update("message", e.target.value)}/>
            </div>
            <div className="form-submit">
              <span className="hint">↩ {c.hint[lang]}</span>
              <button type="submit" className="btn">{c.submit[lang]} <Icon name="arrow" size={14} className="arrow"/></button>
            </div>
          </form>
        ) : (
          <div className="form-success">
            <div className="check"><Icon name="check" size={26}/></div>
            <h3>{c.successTitle[lang]}</h3>
            <p>{c.successBody[lang]}</p>
            <button className="btn ghost sm" onClick={() => { setSent(false); setForm({ name: "", email: "", company: "", product: "avali", message: "" }); }}>
              {lang === "pt" ? "Enviar outra" : "Send another"}
            </button>
          </div>
        )}
      </Reveal>
    </div>
  );
};

// ─── FAQ ─────────────────────────────────────────────────
const FaqPage = ({ lang }) => {
  const f = CrxData.t.faq;
  const [cat, setCat] = useState("geral");
  const [open, setOpen] = useState(0);
  const [search, setSearch] = useState("");
  const [ratings, setRatings] = useState({});

  const list = useMemo(() => {
    const q = search.toLowerCase().trim();
    return CrxData.faqs
      .filter(x => !search ? x.cat === cat : true)
      .filter(x => !q || x.q[lang].toLowerCase().includes(q) || x.a[lang].toLowerCase().includes(q));
  }, [cat, search, lang]);

  return (
    <div className="page-fade">
      <section style={{ padding: "64px 40px 16px" }}>
        <Reveal as="div" className="eyebrow" style={{ marginBottom: 18 }}>
          <span className="dot"/>{lang === "pt" ? "Documentação & Ajuda" : "Docs & Help"}
        </Reveal>
        <Reveal as="h1" delay={60} style={{ fontSize: "clamp(36px, 5vw, 56px)", letterSpacing: "-0.035em", lineHeight: 1 }}>{f.h1[lang]}</Reveal>
        <Reveal as="p" delay={120} style={{ color: "var(--text-muted)", marginTop: 16, maxWidth: "48ch", fontSize: 16, lineHeight: 1.5 }}>{f.lede[lang]}</Reveal>
      </section>
      <section className="faq-layout">
        <div className="faq-cats">
          {CrxData.faqCats.map(c => (
            <button key={c.id} className={`cat ${cat === c.id && !search ? "on" : ""}`}
              onClick={() => { setCat(c.id); setSearch(""); setOpen(0); }}>
              <span>{c.label[lang]}</span>
              <span className="ct">{c.count}</span>
            </button>
          ))}
        </div>
        <div className="faq-main">
          <div className="faq-search">
            <Icon name="search" size={16} style={{ color: "var(--text-muted)" }}/>
            <input placeholder={f.search[lang]} value={search} onChange={e => setSearch(e.target.value)}/>
            <span className="kbd">⌘ K</span>
          </div>
          {list.length === 0 && (
            <div style={{ padding: 32, textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>
              {lang === "pt" ? "Nada encontrado." : "Nothing found."}
            </div>
          )}
          {list.map((item, i) => (
            <div key={i} className={`faq-item ${open === i ? "open" : ""}`}>
              <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
                <div className="meta">
                  <span className="cat">{item.cat}</span>
                  <span>{item.q[lang]}</span>
                </div>
                <span className="plus"><Icon name="plus" size={14}/></span>
              </button>
              <div className="faq-a">
                <div className="faq-a-inner">
                  <p style={{ margin: 0 }}>{item.a[lang]}</p>
                  <div className="faq-rate">
                    <span>{f.helpful[lang]}</span>
                    <button className={`good ${ratings[i] === "y" ? "on" : ""}`} onClick={() => setRatings(r => ({ ...r, [i]: "y" }))}>
                      <Icon name="check" size={12}/> {f.yes[lang]}
                    </button>
                    <button className={`bad ${ratings[i] === "n" ? "on" : ""}`} onClick={() => setRatings(r => ({ ...r, [i]: "n" }))}>
                      <Icon name="x" size={12}/> {f.no[lang]}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

window.SiteHeader = SiteHeader;
window.SiteFooter = SiteFooter;
window.HomePage = HomePage;
window.ProductPage = ProductPage;
window.AboutPage = AboutPage;
window.ContactPage = ContactPage;
window.FaqPage = FaqPage;
window.Reveal = Reveal;
