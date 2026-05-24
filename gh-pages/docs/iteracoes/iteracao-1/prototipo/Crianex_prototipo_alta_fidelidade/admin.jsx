// Crianex Hub — Admin area (separate dark surface, not linked from vitrine)

const { useState: useStateA, useEffect: useEffectA, useMemo: useMemoA, useRef: useRefA } = React;

// Sidebar
const AdminSidebar = ({ section, setSection, user, onProfile }) => {
  const items = [
    { id: 'dashboard', label: 'Dashboard', ico: 'dashboard' },
    { id: 'crm', label: 'CRM · Leads', ico: 'users', badge: '12' },
    { id: 'finance', label: 'Financeiro', ico: 'chart' },
    { id: 'products', label: 'Produtos', ico: 'cube' },
    { id: 'faq', label: 'Gestão FAQ', ico: 'file' },
    { id: 'tickets', label: 'Tickets', ico: 'headset', badge: '3' },
    { id: 'productLogs', label: 'Logs de produtos', ico: 'bot' },
    { id: 'notifications', label: 'Notificações', ico: 'bell' },
    { id: 'members', label: 'Membros', ico: 'users' },
    { id: 'logs', label: 'Auditoria', ico: 'chart' },
  ];
  return (
    <aside className="admin-sidebar">
      <div className="brand" style={{ marginBottom: 4 }}>
        <LogoMarkOnDark size={22} />
        <span>Crianex Admin</span>
      </div>

      <div>
        <div className="sec-label">Geral</div>
        {items.slice(0, 3).map((i) => (
          <button
            key={i.id}
            className={`nav-item ${section === i.id ? 'on' : ''}`}
            onClick={() => setSection(i.id)}
          >
            <span className="ico">
              <Icon name={i.ico} size={15} />
            </span>
            <span>{i.label}</span>
            {i.badge && <span className="badge">{i.badge}</span>}
          </button>
        ))}
      </div>

      <div>
        <div className="sec-label">Vitrine</div>
        {items.slice(3, 5).map((i) => (
          <button
            key={i.id}
            className={`nav-item ${section === i.id ? 'on' : ''}`}
            onClick={() => setSection(i.id)}
          >
            <span className="ico">
              <Icon name={i.ico} size={15} />
            </span>
            <span>{i.label}</span>
            {i.badge && <span className="badge">{i.badge}</span>}
          </button>
        ))}
      </div>

      <div>
        <div className="sec-label">Operações</div>
        {items.slice(5).map((i) => (
          <button
            key={i.id}
            className={`nav-item ${section === i.id ? 'on' : ''}`}
            onClick={() => setSection(i.id)}
          >
            <span className="ico">
              <Icon name={i.ico} size={15} />
            </span>
            <span>{i.label}</span>
            {i.badge && <span className="badge">{i.badge}</span>}
          </button>
        ))}
      </div>

      <button
        className="footer"
        onClick={onProfile}
        style={{ border: 0, fontFamily: 'inherit', cursor: 'pointer', textAlign: 'left' }}
      >
        <span className="avatar">{user.initials}</span>
        <div style={{ flex: 1 }}>
          <div className="name">
            {user.name
              .split(' ')
              .slice(0, 2)
              .join(' ')
              .replace(/(\w+)\s(\w)\w*/, '$1 $2.')}
          </div>
          <div className="role">{user.role.toLowerCase()} · perfil</div>
        </div>
        <Icon name="settings" size={14} style={{ color: 'var(--text-faint)' }} />
      </button>
    </aside>
  );
};

// Top bar
const AdminTopbar = ({ title, crumbs, extra }) => (
  <div className="admin-topbar">
    <h2>{title}</h2>
    <span className="crumbs">{crumbs}</span>
    <span className="grow" />
    <div className="admin-search">
      <Icon name="search" size={14} />
      <input placeholder="Buscar clientes, tickets, produtos…" />
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          padding: '2px 6px',
          border: '1px solid var(--line)',
          borderRadius: 4,
        }}
      >
        ⌘K
      </span>
    </div>
    <button className="btn sm ghost" style={{ padding: '6px 10px' }}>
      <Icon name="bell" size={14} />
    </button>
    {extra}
  </div>
);

// Sparkline
const Sparkline = ({ data = [], color = 'var(--purple)' }) => {
  const w = 120,
    h = 32;
  const max = Math.max(...data),
    min = Math.min(...data);
  const span = max - min || 1;
  const pts = data
    .map((d, i) => `${(i / (data.length - 1)) * w},${h - ((d - min) / span) * h}`)
    .join(' ');
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      style={{ width: '100%', height: '100%' }}
    >
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline points={`0,${h} ${pts} ${w},${h}`} fill={color} opacity="0.08" />
    </svg>
  );
};

// Big chart
const AreaChart = ({ series, color = '#7f3fe5' }) => {
  const w = 760,
    h = 200,
    pad = { l: 36, r: 12, t: 10, b: 24 };
  const max = Math.max(...series.flatMap((s) => s.data)) * 1.1;
  const xs = (i) => pad.l + (i / (series[0].data.length - 1)) * (w - pad.l - pad.r);
  const ys = (v) => h - pad.b - (v / max) * (h - pad.t - pad.b);
  const gridY = [0, 0.25, 0.5, 0.75, 1].map((t) => max * t);
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      style={{ width: '100%', height: '100%' }}
      preserveAspectRatio="none"
    >
      <g className="chart-grid">
        {gridY.map((g, i) => (
          <g key={i}>
            <line x1={pad.l} x2={w - pad.r} y1={ys(g)} y2={ys(g)} />
            <text
              x={pad.l - 8}
              y={ys(g) + 3}
              textAnchor="end"
              fontFamily="var(--font-mono)"
              fontSize="9"
              fill="var(--text-faint)"
            >
              {Math.round(g)}
            </text>
          </g>
        ))}
      </g>
      {series.map((s, si) => {
        const pts = s.data.map((d, i) => `${xs(i)},${ys(d)}`).join(' ');
        return (
          <g key={si}>
            <polyline
              points={`${pad.l},${h - pad.b} ${pts} ${w - pad.r},${h - pad.b}`}
              fill={s.color || color}
              opacity="0.08"
            />
            <polyline points={pts} fill="none" stroke={s.color || color} strokeWidth="1.6" />
          </g>
        );
      })}
      {/* X axis labels */}
      {['mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out'].map((m, i) => (
        <text
          key={m}
          x={xs(Math.round((i * (series[0].data.length - 1)) / 7))}
          y={h - 8}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize="9"
          fill="var(--text-faint)"
        >
          {m}
        </text>
      ))}
    </svg>
  );
};

// ─── Login ─────────────────────────────────────────
const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useStateA('');
  const [pw, setPw] = useStateA('');
  const [loading, setLoading] = useStateA(false);

  const submit = (e) => {
    e?.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 500);
  };

  return (
    <div className="login-page">
      <div className="login-side">
        <div className="deco" />
        <div className="brand" style={{ position: 'relative' }}>
          <LogoMarkOnDark size={26} />
          <span>Crianex Admin</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, position: 'relative' }}>
          <span className="tag">— área restrita</span>
          <h2>Painel interno de gestão Crianex.</h2>
          <p className="quote">
            Plataforma compartilhada por produto, comercial, suporte e engenharia. Acesso restrito a
            contas corporativas Crianex (@crianex.com.br) com auditoria de toda ação privilegiada.
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'rgba(252,252,252,0.45)',
            letterSpacing: '0.06em',
          }}
        >
          <span>v4.12.0 · prod-cluster-a</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: 50, background: 'var(--green)' }} />
            ok
          </span>
        </div>
      </div>

      <div className="login-form-wrap">
        <div className="login-form">
          <h3>Entrar no painel</h3>
          <p className="lede">
            Use sua conta corporativa Crianex. Apenas e-mails do domínio{' '}
            <span className="mono" style={{ color: 'var(--text)' }}>
              @crianex.com.br
            </span>{' '}
            são aceitos.
          </p>

          <button
            type="button"
            onClick={submit}
            className="google-btn"
            style={{
              width: '100%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              padding: '12px 16px',
              borderRadius: 100,
              background: 'var(--bg)',
              color: 'var(--text)',
              border: '1px solid var(--line-strong)',
              fontWeight: 500,
              fontSize: 14,
              cursor: 'pointer',
              fontFamily: 'inherit',
              letterSpacing: '-0.005em',
              transition: 'border-color 0.15s, background 0.15s',
            }}
          >
            <GoogleLogo size={18} />
            <span>{loading ? 'Conectando…' : 'Entrar com Google Workspace'}</span>
          </button>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              margin: '24px 0',
              color: 'var(--text-faint)',
            }}
          >
            <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
            <span
              className="mono"
              style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}
            >
              ou com senha
            </span>
            <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
          </div>

          <form onSubmit={submit}>
            <div className="field">
              <label>E-mail corporativo</label>
              <input
                type="email"
                placeholder="voce@crianex.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="field">
              <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                Senha
                <a
                  style={{
                    textTransform: 'none',
                    letterSpacing: 0,
                    color: 'var(--purple)',
                    cursor: 'pointer',
                  }}
                >
                  Esqueci
                </a>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="btn"
              style={{ width: '100%', justifyContent: 'center' }}
              disabled={loading}
            >
              {loading ? (
                'Entrando…'
              ) : (
                <>
                  Continuar <Icon name="arrow" size={14} />
                </>
              )}
            </button>
          </form>
          <div
            style={{
              marginTop: 24,
              padding: 14,
              background: 'var(--bg-soft)',
              borderRadius: 10,
              display: 'flex',
              gap: 10,
              fontSize: 12,
              color: 'var(--text-muted)',
              border: '1px solid var(--line)',
            }}
          >
            <Icon name="lock" size={14} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>
              Tentativas de acesso são auditadas. IPs fora da faixa corporativa precisam de
              aprovação adicional.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Dashboard ─────────────────────────────────────
const AdminDashboard = () => {
  const series = useMemoA(() => {
    const gen = (base, vol) =>
      Array.from({ length: 32 }, (_, i) =>
        Math.round(base + Math.sin(i / 3) * vol + Math.random() * vol * 0.4)
      );
    return [
      { label: 'Tickets', color: '#e71f84', data: gen(40, 18) },
      { label: 'Acessos', color: '#7f3fe5', data: gen(120, 45) },
    ];
  }, []);

  const kpis = [
    {
      label: 'Tickets abertos',
      value: '47',
      unit: '',
      delta: '+8',
      up: true,
      spark: [12, 15, 14, 18, 22, 19, 23, 26, 30, 28, 32, 35, 40, 38, 43, 47],
      color: '#e71f84',
    },
    {
      label: 'Faturamento mês',
      value: 'R$ 312',
      unit: 'k',
      delta: '+12.4%',
      up: true,
      spark: [180, 195, 220, 215, 240, 260, 270, 285, 290, 305, 312],
      color: '#66df7a',
    },
    {
      label: 'Clientes ativos',
      value: '184',
      unit: '',
      delta: '+3',
      up: true,
      spark: [160, 162, 165, 168, 170, 172, 175, 178, 180, 182, 184],
      color: '#7f3fe5',
    },
    {
      label: 'Acessos / 24h',
      value: '8.4',
      unit: 'k',
      delta: '−2.1%',
      up: false,
      spark: [9.1, 9.4, 9.2, 9.0, 8.9, 8.7, 8.6, 8.5, 8.4],
      color: '#7f3fe5',
    },
  ];

  const activity = [
    {
      dot: '#66df7a',
      text: 'Lead Folha Sistemas avançou para Negociação',
      meta: 'CRM · Avali',
      time: '2m',
    },
    {
      dot: '#e71f84',
      text: 'Ticket #4821 marcado como crítico por Notifly',
      meta: 'Suporte',
      time: '14m',
    },
    {
      dot: '#7f3fe5',
      text: 'Novo artigo de FAQ publicado: Webhook anti-fraude',
      meta: 'Vitrine',
      time: '1h',
    },
    {
      dot: '#66df7a',
      text: 'Pagamento de R$ 24.8k recebido — NIVERA Tech',
      meta: 'Billing',
      time: '2h',
    },
    {
      dot: '#7f3fe5',
      text: 'Deploy v4.12.0 promovido para produção',
      meta: 'Engenharia',
      time: '4h',
    },
    { dot: '#e71f84', text: 'Lead Quantum Lab marcado como perdido', meta: 'CRM', time: '6h' },
  ];

  return (
    <>
      <AdminTopbar title="Visão geral" crumbs="/ dashboard" />
      <div className="admin-content">
        <div className="kpi-grid">
          {kpis.map((k, i) => (
            <div className="kpi" key={i}>
              <div className="label">
                <span style={{ width: 6, height: 6, borderRadius: 50, background: k.color }} />
                {k.label}
              </div>
              <div className="value">
                {k.value}
                {k.unit && <span className="unit">{k.unit}</span>}
              </div>
              <div className={`delta ${k.up ? 'up' : 'down'}`}>
                <Icon name={k.up ? 'arrowUp' : 'arrowDown'} size={12} /> {k.delta}
              </div>
              <div className="spark">
                <Sparkline data={k.spark} color={k.color} />
              </div>
            </div>
          ))}
        </div>

        <div className="admin-row">
          <div className="panel">
            <div className="panel-head">
              <h3>Tickets vs Acessos · últimos 8 meses</h3>
              <span className="grow" />
              <span className="pill">PROD-CLUSTER-A</span>
              <button className="btn sm ghost" style={{ padding: '6px 10px' }}>
                <Icon name="filter" size={13} />
              </button>
              <button className="btn sm ghost" style={{ padding: '6px 10px' }}>
                <Icon name="download" size={13} />
              </button>
            </div>
            <div className="chart">
              <AreaChart series={series} />
            </div>
            <div
              style={{
                display: 'flex',
                gap: 18,
                paddingTop: 12,
                borderTop: '1px solid var(--line)',
                marginTop: 8,
              }}
            >
              {series.map((s, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 12,
                    color: 'var(--text-muted)',
                  }}
                >
                  <span style={{ width: 10, height: 2, background: s.color }} />
                  {s.label}
                </div>
              ))}
              <div
                style={{
                  marginLeft: 'auto',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: 'var(--text-faint)',
                }}
              >
                amostragem: 5min · agregação: diária
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-head">
              <h3>Atividade recente</h3>
              <span className="grow" />
              <button className="btn sm ghost" style={{ padding: '6px 10px' }}>
                <Icon name="moreH" size={13} />
              </button>
            </div>
            <div className="activity-list">
              {activity.map((a, i) => (
                <div className="activity" key={i}>
                  <span className="dot" style={{ background: a.dot }} />
                  <div className="body">
                    {a.text}
                    <div className="meta">{a.meta}</div>
                  </div>
                  <span className="time">{a.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="admin-row">
          <div className="panel">
            <div className="panel-head">
              <h3>Receita por produto · mês corrente</h3>
              <span className="grow" />
              <span className="pill">R$ 312k</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 4 }}>
              {[
                { name: 'Avali', v: 142, pct: 45, color: '#7f3fe5' },
                { name: 'Pontua', v: 88, pct: 28, color: '#e71f84' },
                { name: 'Notifly', v: 54, pct: 17, color: '#66df7a' },
                { name: 'Trilho', v: 18, pct: 6, color: '#7f3fe5' },
                { name: 'Atende', v: 10, pct: 3, color: '#e71f84' },
              ].map((r, i) => (
                <div
                  key={i}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '100px 1fr 70px 40px',
                    gap: 12,
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: '1px solid var(--line)',
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: 50, background: r.color }} />
                    {r.name}
                  </span>
                  <div
                    style={{
                      height: 6,
                      background: 'var(--bg-soft)',
                      borderRadius: 100,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${r.pct}%`,
                        height: '100%',
                        background: r.color,
                        borderRadius: 100,
                      }}
                    />
                  </div>
                  <span className="mono" style={{ fontSize: 12, textAlign: 'right' }}>
                    R$ {r.v}k
                  </span>
                  <span
                    className="mono"
                    style={{ fontSize: 11, color: 'var(--text-faint)', textAlign: 'right' }}
                  >
                    {r.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-head">
              <h3>Saúde do cluster</h3>
              <span className="grow" />
              <span
                className="pill"
                style={{ background: 'rgba(102,223,122,0.18)', color: 'var(--green)' }}
              >
                · OPERACIONAL
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { k: 'API gateway', v: '112 ms p95', ok: true },
                { k: 'WebSocket Hub', v: '342 conexões', ok: true },
                { k: 'Postgres (multi-AZ)', v: '1.2% CPU', ok: true },
                { k: 'Worker fila Pontua', v: 'lag 1.4s', ok: true },
                { k: 'CDN cache', v: '97.2% hit-rate', ok: true },
              ].map((c, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: i === 4 ? 0 : '1px solid var(--line)',
                    fontSize: 13,
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 50,
                        background: 'var(--green)',
                        boxShadow: '0 0 8px rgba(102,223,122,0.5)',
                      }}
                    />
                    {c.k}
                  </span>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {c.v}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ─── CRM Kanban ─────────────────────────────────────
const AdminCRM = () => {
  const cols = [
    {
      id: 'novo',
      title: 'Novo lead',
      color: '#7f3fe5',
      cards: [
        { name: 'NIVERA Tech', contact: 'rh@nivera.com', tag: 'Pontua', value: 'R$ 18k/mo' },
        { name: 'Folha Sistemas', contact: 'leandro@folha.io', tag: 'Avali', value: 'R$ 42k/mo' },
        { name: 'Editora Versa', contact: 'diretoria@versa', tag: 'Avali', value: '—' },
      ],
    },
    {
      id: 'qual',
      title: 'Qualificado',
      color: '#e71f84',
      cards: [
        { name: 'Quantum Lab', contact: 'ana@quantum.app', tag: 'Notifly', value: 'R$ 9k/mo' },
        {
          name: 'RedeFort Educação',
          contact: 'compras@redefort',
          tag: 'Avali',
          value: 'R$ 58k/mo',
        },
      ],
    },
    {
      id: 'neg',
      title: 'Em negociação',
      color: '#66df7a',
      cards: [
        {
          name: 'Aletheia Group',
          contact: 'diretor@aletheia.co',
          tag: 'Notifly',
          value: 'R$ 24k/mo',
        },
        {
          name: 'Praxis Soluções',
          contact: 'tiago@praxis.tech',
          tag: 'Pontua',
          value: 'R$ 16k/mo',
        },
        { name: 'ICE Educação', contact: 'rh@ice.org.br', tag: 'Avali', value: 'R$ 88k/mo' },
      ],
    },
    {
      id: 'fech',
      title: 'Fechado',
      color: '#7f3fe5',
      cards: [
        { name: 'Cluster Verde', contact: 'ti@cluster.com', tag: 'Notifly', value: 'R$ 12k/mo' },
        { name: 'Bons Negócios SA', contact: 'cio@bn.com.br', tag: 'Pontua', value: 'R$ 28k/mo' },
      ],
    },
  ];
  return (
    <>
      <AdminTopbar
        title="CRM · Pipeline de leads"
        crumbs="/ crm / kanban"
        extra={<button className="btn sm">+ Novo lead</button>}
      />
      <div className="admin-content">
        <div className="kanban">
          {cols.map((col) => (
            <div className="kb-col" key={col.id}>
              <div className="kb-col-head">
                <span className="lead-dot" style={{ background: col.color }} />
                <span>{col.title}</span>
                <span className="ct">{col.cards.length}</span>
              </div>
              {col.cards.map((c, i) => (
                <div className="kb-card" key={i}>
                  <div className="cname">{c.name}</div>
                  <div className="ccontact">{c.contact}</div>
                  <div className="crow">
                    <span className="ctag">{c.tag}</span>
                    <span className="value">{c.value}</span>
                  </div>
                </div>
              ))}
              <button
                style={{
                  background: 'transparent',
                  border: '1px dashed var(--line-strong)',
                  borderRadius: 8,
                  color: 'var(--text-faint)',
                  padding: '10px',
                  fontFamily: 'inherit',
                  fontSize: 12,
                }}
              >
                + adicionar
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

// ─── Logs ─────────────────────────────────────────
const AdminLogs = () => {
  const rows = [
    {
      time: '15:42:11.231',
      level: 'info',
      action: 'user.login',
      actor: 'marina@crianex',
      target: '/auth',
      status: '200',
    },
    {
      time: '15:41:58.014',
      level: 'ok',
      action: 'deploy.promote',
      actor: 'ci-bot',
      target: 'avali@v4.12.0',
      status: 'ok',
    },
    {
      time: '15:41:02.882',
      level: 'warn',
      action: 'ratelimit.exceeded',
      actor: 'tenant:editora-versa',
      target: '/api/grade',
      status: '429',
    },
    {
      time: '15:39:45.117',
      level: 'info',
      action: 'faq.publish',
      actor: 'joao@crianex',
      target: 'art-0918',
      status: '200',
    },
    {
      time: '15:38:21.554',
      level: 'info',
      action: 'ticket.create',
      actor: 'support@nivera',
      target: 'ticket-4821',
      status: '201',
    },
    {
      time: '15:36:04.220',
      level: 'ok',
      action: 'billing.charge',
      actor: 'ledger-cron',
      target: 'tenant:nivera',
      status: 'ok',
    },
    {
      time: '15:32:11.092',
      level: 'warn',
      action: 'auth.2fa.failed',
      actor: 'ricardo@crianex',
      target: '/2fa',
      status: '401',
    },
    {
      time: '15:30:00.001',
      level: 'info',
      action: 'cron.run',
      actor: 'scheduler',
      target: 'rollup.daily',
      status: '200',
    },
  ];
  return (
    <>
      <AdminTopbar
        title="Logs & auditoria"
        crumbs="/ logs"
        extra={
          <>
            <button className="btn sm ghost" style={{ padding: '6px 10px' }}>
              <Icon name="filter" size={13} />
            </button>
            <button className="btn sm ghost" style={{ padding: '6px 10px' }}>
              <Icon name="download" size={13} />
            </button>
          </>
        }
      />
      <div className="admin-content">
        <div className="panel">
          <div className="panel-head">
            <h3>Eventos · últimas 24h</h3>
            <span className="pill">14,228 eventos</span>
            <span className="grow" />
            <div className="admin-search" style={{ width: 220 }}>
              <Icon name="search" size={13} />
              <input placeholder="actor, action, target…" />
            </div>
          </div>
          <div className="log-table">
            <div className="log-row header">
              <span>Timestamp</span>
              <span>Level</span>
              <span>Action · target</span>
              <span>Actor</span>
              <span style={{ textAlign: 'right' }}>Status</span>
            </div>
            {rows.map((r, i) => (
              <div className="log-row" key={i}>
                <span style={{ color: 'var(--text-muted)' }}>{r.time}</span>
                <span>
                  <span className={`level ${r.level}`}>{r.level.toUpperCase()}</span>
                </span>
                <span>
                  <b style={{ color: 'var(--text)' }}>{r.action}</b>{' '}
                  <span style={{ color: 'var(--text-muted)' }}>{r.target}</span>
                </span>
                <span style={{ color: 'var(--text-muted)' }}>{r.actor}</span>
                <span style={{ textAlign: 'right', color: 'var(--text-muted)' }}>{r.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

// ─── Products manager ─────────────────────────────────────
const AdminProducts = () => (
  <>
    <AdminTopbar
      title="Produtos da vitrine"
      crumbs="/ vitrine / produtos"
      extra={<button className="btn sm">+ Novo produto</button>}
    />
    <div className="admin-content">
      <div className="panel">
        <div className="panel-head">
          <h3>6 produtos publicados</h3>
          <span className="grow" />
          <span className="pill">vitrine.crianex.com</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {CrxData.products.map((p, i) => (
            <div
              key={p.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '40px 1.4fr 1.2fr 110px 100px 40px',
                gap: 16,
                alignItems: 'center',
                padding: '14px 6px',
                borderBottom: i === CrxData.products.length - 1 ? 0 : '1px solid var(--line)',
              }}
            >
              <span
                className="picon"
                style={{
                  width: 32,
                  height: 32,
                  fontSize: 12,
                  borderRadius: 8,
                  background: p.color,
                }}
              >
                {p.iconText}
              </span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.tagline.pt}</div>
              </div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                {p.cat.pt}
              </div>
              <span
                className="pill"
                style={{
                  background: 'rgba(102,223,122,0.18)',
                  color: 'var(--green)',
                  padding: '3px 8px',
                  borderRadius: 4,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  letterSpacing: '0.06em',
                  textAlign: 'center',
                }}
              >
                PUBLICADO
              </span>
              <span
                className="mono"
                style={{ fontSize: 11, color: 'var(--text-faint)', textAlign: 'right' }}
              >
                edit. há 2d
              </span>
              <button
                style={{
                  background: 'transparent',
                  border: 0,
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                }}
              >
                <Icon name="moreV" size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
);

// ─── FAQ manager ─────────────────────────────────────
const AdminFaqMgr = () => (
  <>
    <AdminTopbar
      title="FAQ · artigos"
      crumbs="/ vitrine / faq"
      extra={<button className="btn sm">+ Novo artigo</button>}
    />
    <div className="admin-content">
      <div className="panel">
        <div className="panel-head">
          <h3>9 artigos · 6 categorias</h3>
          <span className="grow" />
          <div className="admin-search" style={{ width: 220 }}>
            <Icon name="search" size={13} />
            <input placeholder="Buscar…" />
          </div>
        </div>
        {CrxData.faqs.map((f, i) => (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: '80px 1fr 100px 100px 100px 40px',
              gap: 12,
              alignItems: 'center',
              padding: '12px 6px',
              borderBottom: i === CrxData.faqs.length - 1 ? 0 : '1px solid var(--line)',
            }}
          >
            <span
              className="mono"
              style={{
                fontSize: 10,
                padding: '3px 7px',
                background: 'var(--bg-soft)',
                borderRadius: 4,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                textAlign: 'center',
                color: 'var(--text-muted)',
              }}
            >
              {f.cat}
            </span>
            <div style={{ fontSize: 13.5 }}>{f.q.pt}</div>
            <span
              className="pill"
              style={{
                background: i === 4 ? 'rgba(231,31,132,0.18)' : 'rgba(102,223,122,0.18)',
                color: i === 4 ? 'var(--pink)' : 'var(--green)',
                padding: '3px 8px',
                borderRadius: 4,
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: '0.06em',
                textAlign: 'center',
              }}
            >
              {i === 4 ? 'RASCUNHO' : 'PUBLICADO'}
            </span>
            <span
              className="mono"
              style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'right' }}
            >
              {Math.round(60 + Math.random() * 30)}% útil
            </span>
            <span
              className="mono"
              style={{ fontSize: 11, color: 'var(--text-faint)', textAlign: 'right' }}
            >
              {Math.round(100 + Math.random() * 900)} views
            </span>
            <button
              style={{
                background: 'transparent',
                border: 0,
                color: 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              <Icon name="moreV" size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  </>
);

// ─── Tickets ─────────────────────────────────────
const AdminTickets = () => {
  const tickets = [
    {
      id: '#4821',
      title: 'Falha intermitente no webhook de eventos',
      client: 'NIVERA Tech',
      product: 'Notifly',
      priority: 'critical',
      status: 'Aberto',
      age: '14m',
    },
    {
      id: '#4819',
      title: 'Como configurar fallback SMS → WhatsApp?',
      client: 'Quantum Lab',
      product: 'Notifly',
      priority: 'low',
      status: 'Aguardando cliente',
      age: '1h',
    },
    {
      id: '#4817',
      title: 'Importação de questões CSV travada',
      client: 'Editora Versa',
      product: 'Avali',
      priority: 'high',
      status: 'Em análise',
      age: '2h',
    },
    {
      id: '#4815',
      title: 'Discrepância de saldo de pontos após resgate',
      client: 'Bons Negócios SA',
      product: 'Pontua',
      priority: 'high',
      status: 'Em análise',
      age: '3h',
    },
    {
      id: '#4812',
      title: 'Solicitação de novo idioma (espanhol)',
      client: 'Aletheia Group',
      product: 'Avali',
      priority: 'low',
      status: 'Backlog',
      age: '1d',
    },
  ];
  const pri = { critical: '#e71f84', high: '#7f3fe5', low: '#66df7a' };
  return (
    <>
      <AdminTopbar
        title="Tickets de suporte"
        crumbs="/ suporte / tickets"
        extra={<button className="btn sm">+ Novo ticket</button>}
      />
      <div className="admin-content">
        <div className="kpi-grid">
          <div className="kpi">
            <div className="label">Abertos</div>
            <div className="value">47</div>
          </div>
          <div className="kpi">
            <div className="label">Críticos</div>
            <div className="value" style={{ color: '#e71f84' }}>
              3
            </div>
          </div>
          <div className="kpi">
            <div className="label">SLA · 1ª resposta</div>
            <div className="value">
              12<span className="unit">min</span>
            </div>
          </div>
          <div className="kpi">
            <div className="label">CSAT 30d</div>
            <div className="value">
              4.7<span className="unit">/ 5</span>
            </div>
          </div>
        </div>
        <div className="panel">
          <div className="panel-head">
            <h3>Fila</h3>
            <span className="pill">5 destacados</span>
            <span className="grow" />
            <button className="btn sm ghost" style={{ padding: '6px 10px' }}>
              <Icon name="filter" size={13} />
            </button>
          </div>
          {tickets.map((t, i) => (
            <div
              key={t.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '60px 1fr 140px 110px 120px 50px 40px',
                gap: 12,
                alignItems: 'center',
                padding: '14px 6px',
                borderBottom: i === tickets.length - 1 ? 0 : '1px solid var(--line)',
              }}
            >
              <span className="mono" style={{ fontSize: 11, color: 'var(--text-faint)' }}>
                {t.id}
              </span>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 500 }}>{t.title}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>
                  {t.client}
                </div>
              </div>
              <span className="mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                {t.product}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                <span
                  style={{ width: 7, height: 7, borderRadius: 50, background: pri[t.priority] }}
                />
                {t.priority === 'critical' ? 'Crítico' : t.priority === 'high' ? 'Alto' : 'Baixo'}
              </span>
              <span className="mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                {t.status}
              </span>
              <span
                className="mono"
                style={{ fontSize: 11, color: 'var(--text-faint)', textAlign: 'right' }}
              >
                {t.age}
              </span>
              <button
                style={{
                  background: 'transparent',
                  border: 0,
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                }}
              >
                <Icon name="moreV" size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const AdminApp = ({ onLogout }) => {
  const [section, setSection] = useStateA('dashboard');
  const [auth, setAuth] = useStateA(false);
  const [profileOpen, setProfileOpen] = useStateA(false);
  const [user, setUser] = useStateA({
    name: 'Marina Pereira',
    email: 'marina@crianex.com.br',
    initials: 'MP',
    role: 'Owner',
    bio: 'Co-fundadora · Lidera produto e engenharia na Crianex desde 2019.',
    phone: '+55 11 9 8421-0042',
  });

  if (!auth)
    return (
      <div className="admin-root">
        <div style={{ flex: 1 }}>
          <AdminLogin onLogin={() => setAuth(true)} />
        </div>
      </div>
    );
  return (
    <div className="admin-root">
      <AdminSidebar
        section={section}
        setSection={setSection}
        user={user}
        onProfile={() => setProfileOpen(true)}
      />
      <main className="admin-main">
        {section === 'dashboard' && <AdminDashboard />}
        {section === 'crm' && <AdminCRMEnhanced currentUser={user} />}
        {section === 'finance' && <AdminFinance />}
        {section === 'products' && <AdminProducts />}
        {section === 'faq' && <AdminFaqMgr />}
        {section === 'tickets' && <AdminTickets />}
        {section === 'productLogs' && <AdminProductLogs />}
        {section === 'notifications' && <AdminNotifConfig />}
        {section === 'members' && <AdminMembers currentUser={user} />}
        {section === 'logs' && <AdminLogs />}
      </main>
      {profileOpen && (
        <AdminProfile user={user} onClose={() => setProfileOpen(false)} onSave={setUser} />
      )}
    </div>
  );
};

window.AdminApp = AdminApp;
window.AdminTopbar = AdminTopbar;
window.Sparkline = Sparkline;
window.AreaChart = AreaChart;
