// Crianex Hub — Admin extras: Finance, Members, Profile, Product Logs, Notifications
// (Loaded after admin.jsx — uses window.AdminTopbar, window.Sparkline, window.AreaChart)

const { useState: useStateE, useEffect: useEffectE, useRef: useRefE, useMemo: useMemoE } = React;

// ═══════════════════════════════════════════════════
// MODAL primitive
// ═══════════════════════════════════════════════════
const AdminModal = ({ title, crumbs, onClose, children, footer, wide }) => (
  <div className="admin-overlay" onClick={onClose}>
    <div className={`admin-modal ${wide ? "wide" : ""}`} onClick={e => e.stopPropagation()}>
      <div className="admin-modal-head">
        <h3>{title}</h3>
        {crumbs && <span className="crumbs">{crumbs}</span>}
        <button className="x" onClick={onClose} aria-label="fechar"><Icon name="x" size={14}/></button>
      </div>
      <div className="admin-modal-body">{children}</div>
      {footer && <div className="admin-modal-foot">{footer}</div>}
    </div>
  </div>
);

// ═══════════════════════════════════════════════════
// PROFILE — disponível para todos os usuários
// ═══════════════════════════════════════════════════
const AdminProfile = ({ user, onClose, onSave }) => {
  const [name, setName] = useStateE(user.name);
  const [bio, setBio] = useStateE(user.bio || "");
  const [phone, setPhone] = useStateE(user.phone || "");
  const [pwOpen, setPwOpen] = useStateE(false);

  const save = () => {
    onSave({ ...user, name, bio, phone });
    onClose();
  };

  return (
    <AdminModal title="Meu perfil" crumbs="/ todos podem editar" onClose={onClose}
      footer={<>
        <button className="btn ghost sm" onClick={onClose}>Cancelar</button>
        <button className="btn sm" onClick={save}>Salvar alterações <Icon name="check" size={14}/></button>
      </>}>
      <div style={{ display: "flex", gap: 18, alignItems: "center", marginBottom: 22 }}>
        <div className="avatar-edit">
          <span>{user.initials}</span>
          <div className="ovr">trocar foto</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 17, fontWeight: 500, letterSpacing: "-0.015em" }}>{user.name}</div>
          <div className="mono" style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{user.email}</div>
          <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
            <span className="status-pill active"><span className="dt"/>ativo</span>
            <span className="status-pill" style={{ background: "var(--accent-soft)", color: "var(--purple)" }}><span className="dt" style={{ background: "var(--purple)" }}/>{user.role}</span>
          </div>
        </div>
      </div>

      <div className="fld-group">
        <div className="fld-row">
          <div className="fld">
            <label>Nome de exibição</label>
            <input value={name} onChange={e => setName(e.target.value)}/>
          </div>
          <div className="fld">
            <label>Telefone</label>
            <input placeholder="+55 11 9 9999-0000" value={phone} onChange={e => setPhone(e.target.value)}/>
          </div>
        </div>
        <div className="fld">
          <label>E-mail corporativo</label>
          <input value={user.email} disabled style={{ color: "var(--text-muted)" }}/>
        </div>
        <div className="fld">
          <label>Bio curta</label>
          <textarea placeholder="Como você descreve seu trabalho na Crianex?" value={bio} onChange={e => setBio(e.target.value)}/>
        </div>

        <div style={{ height: 1, background: "var(--line)", margin: "8px 0" }}/>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>Senha</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Última alteração há 38 dias</div>
          </div>
          <button className="btn ghost sm" onClick={() => setPwOpen(!pwOpen)}>Alterar senha</button>
        </div>
        {pwOpen && (
          <div className="fld-row" style={{ marginTop: 4 }}>
            <div className="fld">
              <label>Senha atual</label>
              <input type="password" placeholder="••••••••"/>
            </div>
            <div className="fld">
              <label>Nova senha</label>
              <input type="password" placeholder="••••••••"/>
            </div>
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>Autenticação 2FA</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Recomendado · App autenticador</div>
          </div>
          <button className="toggle on" aria-label="2FA"/>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>Notificações por e-mail</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Resumo diário às 9h</div>
          </div>
          <button className="toggle on" aria-label="email-notif"/>
        </div>
      </div>
    </AdminModal>
  );
};

// ═══════════════════════════════════════════════════
// FINANCE
// ═══════════════════════════════════════════════════
const finData = (() => {
  const products = ["Avali", "Pontua", "Notifly", "Trilho", "Atende", "Ledger"];
  const clients = ["NIVERA Tech", "Folha Sistemas", "Editora Versa", "Quantum Lab", "RedeFort Educação", "Aletheia Group", "Praxis Soluções", "ICE Educação", "Cluster Verde", "Bons Negócios SA"];
  const statuses = ["paid", "paid", "paid", "paid", "pending", "overdue"];
  const txs = [];
  for (let i = 0; i < 28; i++) {
    const d = new Date(2026, 4 - Math.floor(i / 9), 28 - (i * 2) % 28);
    const date = d.toISOString().slice(0, 10);
    const product = products[i % products.length];
    const client = clients[(i * 3) % clients.length];
    const value = Math.round((8 + (i * 7) % 80) * 1000);
    const status = statuses[i % statuses.length];
    txs.push({
      id: `INV-${String(20240 + i).padStart(5, "0")}`,
      date, product, client, value, status,
      method: i % 3 === 0 ? "PIX" : i % 3 === 1 ? "Boleto" : "Cartão",
      due: new Date(d.getTime() + 5 * 86400000).toISOString().slice(0, 10)
    });
  }
  return txs;
})();

const fmtBRL = v => "R$ " + v.toLocaleString("pt-BR");

const AdminFinance = () => {
  const [period, setPeriod] = useStateE("90d");
  const [productF, setProductF] = useStateE("all");
  const [statusF, setStatusF] = useStateE("all");
  const [detail, setDetail] = useStateE(null);
  const [reportOpen, setReportOpen] = useStateE(false);

  const filtered = useMemoE(() => finData.filter(t =>
    (productF === "all" || t.product === productF) &&
    (statusF === "all" || t.status === statusF)
  ), [productF, statusF]);

  const totals = useMemoE(() => {
    const paid = filtered.filter(t => t.status === "paid").reduce((s, t) => s + t.value, 0);
    const pending = filtered.filter(t => t.status === "pending").reduce((s, t) => s + t.value, 0);
    const overdue = filtered.filter(t => t.status === "overdue").reduce((s, t) => s + t.value, 0);
    return { paid, pending, overdue, total: paid + pending + overdue };
  }, [filtered]);

  const series = useMemoE(() => {
    const gen = (b, v) => Array.from({ length: 32 }, (_, i) => Math.round(b + Math.sin(i / 3 + Math.random()) * v + Math.random() * v * 0.3));
    return [{ label: "Recebido", color: "#66df7a", data: gen(110, 30) }];
  }, [period]);

  return (
    <>
      <AdminTopbar title="Financeiro" crumbs="/ financeiro / histórico"
        extra={<>
          <button className="btn sm ghost" onClick={() => setReportOpen(true)}>
            <Icon name="file" size={13}/> Gerar relatório
          </button>
          <button className="btn sm">
            <Icon name="download" size={13}/> Exportar
          </button>
        </>}/>
      <div className="admin-content">
        {/* KPIs */}
        <div className="kpi-grid">
          <div className="kpi">
            <div className="label"><span style={{ width: 6, height: 6, borderRadius: 50, background: "var(--green)" }}/>Recebido (filtros)</div>
            <div className="value">{fmtBRL(totals.paid)}</div>
            <div className="delta up"><Icon name="arrowUp" size={11}/>+8.2%</div>
          </div>
          <div className="kpi">
            <div className="label"><span style={{ width: 6, height: 6, borderRadius: 50, background: "var(--purple)" }}/>Em aberto</div>
            <div className="value">{fmtBRL(totals.pending)}</div>
            <div className="delta" style={{ color: "var(--text-muted)" }}>{filtered.filter(t => t.status === "pending").length} faturas</div>
          </div>
          <div className="kpi">
            <div className="label"><span style={{ width: 6, height: 6, borderRadius: 50, background: "var(--pink)" }}/>Em atraso</div>
            <div className="value" style={{ color: "var(--pink)" }}>{fmtBRL(totals.overdue)}</div>
            <div className="delta down">{filtered.filter(t => t.status === "overdue").length} faturas</div>
          </div>
          <div className="kpi">
            <div className="label">MRR projetado</div>
            <div className="value">R$ 312<span className="unit">k</span></div>
            <div className="delta up"><Icon name="arrowUp" size={11}/>+12.4%</div>
          </div>
        </div>

        {/* Filters */}
        <div className="filter-bar">
          <span className="mono" style={{ fontSize: 10.5, color: "var(--text-faint)", letterSpacing: "0.08em", textTransform: "uppercase", alignSelf: "center", marginRight: 4 }}>Filtros</span>

          <div className="filter-chip">
            <Icon name="chart" size={12}/>
            Período:
            <select value={period} onChange={e => setPeriod(e.target.value)}>
              <option value="30d">últimos 30 dias</option>
              <option value="90d">últimos 90 dias</option>
              <option value="ytd">ano até hoje</option>
              <option value="12m">últimos 12 meses</option>
            </select>
          </div>

          <div className="filter-chip">
            <Icon name="cube" size={12}/>
            Produto:
            <select value={productF} onChange={e => setProductF(e.target.value)}>
              <option value="all">todos</option>
              {["Avali", "Pontua", "Notifly", "Trilho", "Atende", "Ledger"].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div className="filter-chip">
            <Icon name="bolt" size={12}/>
            Status:
            <select value={statusF} onChange={e => setStatusF(e.target.value)}>
              <option value="all">todos</option>
              <option value="paid">pago</option>
              <option value="pending">em aberto</option>
              <option value="overdue">em atraso</option>
            </select>
          </div>

          <div style={{ flex: 1 }}/>
          <button className="filter-chip" onClick={() => { setProductF("all"); setStatusF("all"); setPeriod("90d"); }}>
            <Icon name="x" size={11}/>Limpar
          </button>
        </div>

        {/* Chart */}
        <div className="panel">
          <div className="panel-head">
            <h3>Recebimentos · período selecionado</h3>
            <span className="pill">{filtered.length} transações</span>
            <span className="grow"/>
            <span className="mono" style={{ fontSize: 11, color: "var(--text-faint)" }}>{fmtBRL(totals.paid)} no total</span>
          </div>
          <div className="chart"><AreaChart series={series} color="#66df7a"/></div>
        </div>

        {/* Transactions table */}
        <div className="panel">
          <div className="panel-head">
            <h3>Histórico financeiro</h3>
            <span className="pill">{filtered.length} registros</span>
            <span className="grow"/>
            <div className="admin-search" style={{ width: 220 }}>
              <Icon name="search" size={13}/>
              <input placeholder="fatura, cliente…"/>
            </div>
          </div>
          <div className="data-table">
            <div className="dt-row header" style={{ gridTemplateColumns: "100px 90px 1.2fr 1fr 130px 110px 40px" }}>
              <span>Fatura</span>
              <span>Data</span>
              <span>Cliente</span>
              <span>Produto</span>
              <span>Valor</span>
              <span>Status</span>
              <span></span>
            </div>
            {filtered.slice(0, 12).map(t => (
              <div key={t.id} className="dt-row clickable" style={{ gridTemplateColumns: "100px 90px 1.2fr 1fr 130px 110px 40px" }}
                onClick={() => setDetail(t)}>
                <span className="mono">{t.id}</span>
                <span className="mono" style={{ color: "var(--text-muted)" }}>{t.date}</span>
                <span style={{ fontWeight: 500 }}>{t.client}</span>
                <span style={{ color: "var(--text-muted)" }}>{t.product}</span>
                <span className="mono" style={{ fontWeight: 500, color: "var(--text)" }}>{fmtBRL(t.value)}</span>
                <span><span className={`status-pill ${t.status}`}><span className="dt"/>{t.status === "paid" ? "pago" : t.status === "pending" ? "em aberto" : "em atraso"}</span></span>
                <button className="menu-btn" onClick={e => { e.stopPropagation(); }}><Icon name="moreV" size={14}/></button>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 14, marginTop: 8, borderTop: "1px solid var(--line)" }}>
            <span className="mono" style={{ fontSize: 11, color: "var(--text-muted)" }}>página 1 · 12 de {filtered.length}</span>
            <div style={{ display: "flex", gap: 6 }}>
              <button className="btn sm ghost" style={{ padding: "5px 10px" }}>←</button>
              <button className="btn sm ghost" style={{ padding: "5px 10px" }}>→</button>
            </div>
          </div>
        </div>
      </div>

      {/* Detail modal */}
      {detail && <FinanceDetail tx={detail} onClose={() => setDetail(null)}/>}

      {/* Report modal */}
      {reportOpen && <FinanceReport totals={totals} period={period} onClose={() => setReportOpen(false)}/>}
    </>
  );
};

const FinanceDetail = ({ tx, onClose }) => (
  <AdminModal title={`Fatura ${tx.id}`} crumbs={`/ financeiro / detalhes`} onClose={onClose}
    footer={<>
      <button className="btn ghost sm" onClick={onClose}>Fechar</button>
      <button className="btn sm"><Icon name="download" size={13}/> Baixar PDF</button>
    </>}>
    <div style={{ display: "flex", gap: 24, marginBottom: 24, alignItems: "baseline" }}>
      <div>
        <div className="mono" style={{ fontSize: 11, color: "var(--text-faint)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Valor total</div>
        <div style={{ fontSize: 32, letterSpacing: "-0.025em", fontWeight: 500, marginTop: 4 }}>{fmtBRL(tx.value)}</div>
      </div>
      <span className={`status-pill ${tx.status}`}><span className="dt"/>{tx.status === "paid" ? "pago" : tx.status === "pending" ? "em aberto" : "em atraso"}</span>
    </div>

    <div className="data-table" style={{ marginBottom: 18 }}>
      {[
        ["Cliente", tx.client],
        ["Produto", tx.product],
        ["Forma de pagamento", tx.method],
        ["Emissão", tx.date],
        ["Vencimento", tx.due],
        ["NF-e", `NFe-2026-${tx.id.slice(-5)}`],
        ["Centro de custo", "RECORRENTE · SaaS"]
      ].map(([k, v]) => (
        <div key={k} className="dt-row" style={{ gridTemplateColumns: "160px 1fr" }}>
          <span className="mono" style={{ color: "var(--text-muted)", fontSize: 11.5, letterSpacing: "0.04em" }}>{k}</span>
          <span style={{ fontSize: 13 }}>{v}</span>
        </div>
      ))}
    </div>

    <div className="fld">
      <label>Histórico de eventos</label>
      <div className="timeline" style={{ marginTop: 8 }}>
        <div className="timeline-item call">
          <div className="pip"><Icon name="check" size={13}/></div>
          <div>
            <div className="meta">15/03/2026 · 09:14</div>
            <div className="body"><span className="actor">Webhook Stripe</span> · pagamento confirmado e conciliado.</div>
          </div>
        </div>
        <div className="timeline-item">
          <div className="pip"><Icon name="bell" size={13}/></div>
          <div>
            <div className="meta">14/03/2026 · 08:00</div>
            <div className="body">Lembrete enviado por e-mail para <span className="mono">{tx.client.toLowerCase().replace(/\s/g,"")}@cliente.com</span></div>
          </div>
        </div>
        <div className="timeline-item">
          <div className="pip"><Icon name="file" size={13}/></div>
          <div>
            <div className="meta">10/03/2026 · 02:00</div>
            <div className="body"><span className="actor">Cron Ledger</span> · fatura {tx.id} emitida automaticamente.</div>
          </div>
        </div>
      </div>
    </div>
  </AdminModal>
);

const FinanceReport = ({ totals, period, onClose }) => (
  <AdminModal title="Gerar relatório financeiro" wide crumbs="/ financeiro / relatórios" onClose={onClose}
    footer={<>
      <button className="btn ghost sm" onClick={onClose}>Cancelar</button>
      <button className="btn sm"><Icon name="download" size={13}/> Gerar e baixar</button>
    </>}>
    <div className="fld-group">
      <div className="fld-row">
        <div className="fld">
          <label>Tipo de relatório</label>
          <select>
            <option>Resumo executivo</option>
            <option>Detalhado por cliente</option>
            <option>Detalhado por produto</option>
            <option>Inadimplência</option>
            <option>Conciliação bancária</option>
          </select>
        </div>
        <div className="fld">
          <label>Formato</label>
          <select>
            <option>PDF</option>
            <option>CSV</option>
            <option>XLSX</option>
          </select>
        </div>
      </div>
      <div className="fld-row">
        <div className="fld">
          <label>Data inicial</label>
          <input type="date" defaultValue="2026-02-15"/>
        </div>
        <div className="fld">
          <label>Data final</label>
          <input type="date" defaultValue="2026-05-17"/>
        </div>
      </div>
      <div className="fld">
        <label>Incluir</label>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", paddingTop: 4 }}>
          {["Gráficos", "Tabela de transações", "Top 10 clientes", "Comparação YoY", "Notas fiscais", "Logs de pagamento"].map(opt => (
            <label key={opt} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
              <input type="checkbox" defaultChecked className="checkbox"/>
              {opt}
            </label>
          ))}
        </div>
      </div>

      <div style={{ background: "var(--bg-soft)", border: "1px solid var(--line)", borderRadius: 10, padding: 14 }}>
        <div className="mono" style={{ fontSize: 10.5, color: "var(--text-faint)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Prévia do resumo</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          <div>
            <div className="mono" style={{ fontSize: 10, color: "var(--text-muted)" }}>RECEBIDO</div>
            <div style={{ fontSize: 18, fontWeight: 500, letterSpacing: "-0.02em" }}>{fmtBRL(totals.paid)}</div>
          </div>
          <div>
            <div className="mono" style={{ fontSize: 10, color: "var(--text-muted)" }}>EM ABERTO</div>
            <div style={{ fontSize: 18, fontWeight: 500, letterSpacing: "-0.02em" }}>{fmtBRL(totals.pending)}</div>
          </div>
          <div>
            <div className="mono" style={{ fontSize: 10, color: "var(--text-muted)" }}>EM ATRASO</div>
            <div style={{ fontSize: 18, fontWeight: 500, letterSpacing: "-0.02em", color: "var(--pink)" }}>{fmtBRL(totals.overdue)}</div>
          </div>
        </div>
      </div>
    </div>
  </AdminModal>
);

// ═══════════════════════════════════════════════════
// MEMBERS
// ═══════════════════════════════════════════════════
const ROLE_OPTIONS = ["Owner", "Administrador", "Comercial", "Suporte", "Engenharia", "Financeiro", "Auditor"];
const MODULES = [
  { id: "dashboard", label: "Dashboard executivo" },
  { id: "crm", label: "CRM · Leads e interações" },
  { id: "finance", label: "Financeiro" },
  { id: "members", label: "Membros e permissões" },
  { id: "products", label: "Produtos da vitrine" },
  { id: "faq", label: "Gestão FAQ" },
  { id: "tickets", label: "Tickets de suporte" },
  { id: "productLogs", label: "Logs de produtos" },
  { id: "notifications", label: "Configuração de notificações" },
  { id: "auditLogs", label: "Auditoria" }
];

const initialMembers = [
  { id: 1, name: "Marina Pereira", email: "marina@crianex.com.br", initials: "MP", role: "Owner", status: "active", last: "agora", perms: Object.fromEntries(MODULES.map(m => [m.id, ["v","e","a"]])) },
  { id: 2, name: "Ricardo Lopes", email: "ricardo@crianex.com.br", initials: "RL", role: "Administrador", status: "active", last: "12m", perms: Object.fromEntries(MODULES.map(m => [m.id, ["v","e","a"]])) },
  { id: 3, name: "Joana Velasco", email: "joana@crianex.com.br", initials: "JV", role: "Comercial", status: "active", last: "2h", perms: { dashboard:["v"], crm:["v","e","a"], finance:["v"], members:[], products:[], faq:[], tickets:["v"], productLogs:[], notifications:[], auditLogs:[] } },
  { id: 4, name: "Tiago Albuquerque", email: "tiago@crianex.com.br", initials: "TA", role: "Suporte", status: "active", last: "5m", perms: { dashboard:["v"], crm:["v"], finance:[], members:[], products:[], faq:["v","e"], tickets:["v","e","a"], productLogs:["v"], notifications:[], auditLogs:[] } },
  { id: 5, name: "Beatriz Carvalho", email: "beatriz@crianex.com.br", initials: "BC", role: "Financeiro", status: "active", last: "1d", perms: { dashboard:["v"], crm:[], finance:["v","e","a"], members:[], products:[], faq:[], tickets:[], productLogs:[], notifications:[], auditLogs:["v"] } },
  { id: 6, name: "Pedro Negrão", email: "pedro@crianex.com.br", initials: "PN", role: "Engenharia", status: "inactive", last: "12d", perms: { dashboard:["v"], crm:[], finance:[], members:[], products:["v","e"], faq:[], tickets:["v"], productLogs:["v","e"], notifications:["v","e"], auditLogs:["v"] } }
];

const AdminMembers = ({ currentUser }) => {
  const [members, setMembers] = useStateE(initialMembers);
  const [editing, setEditing] = useStateE(null);
  const [adding, setAdding] = useStateE(false);
  const canManage = currentUser.role === "Owner" || currentUser.role === "Administrador";

  const upsert = (m) => {
    setMembers(prev => prev.find(p => p.id === m.id) ? prev.map(p => p.id === m.id ? m : p) : [...prev, { ...m, id: Date.now(), last: "—" }]);
    setEditing(null); setAdding(false);
  };

  const toggleStatus = (m) => setMembers(prev => prev.map(p => p.id === m.id ? { ...p, status: p.status === "active" ? "inactive" : "active" } : p));
  const remove = (m) => setMembers(prev => prev.filter(p => p.id !== m.id));

  return (
    <>
      <AdminTopbar title="Membros & permissões" crumbs="/ operações / membros"
        extra={canManage && <button className="btn sm" onClick={() => setAdding(true)}>+ Cadastrar membro</button>}/>
      <div className="admin-content">
        {!canManage && (
          <div style={{ padding: 14, background: "var(--accent-soft)", border: "1px solid var(--accent-line)", borderRadius: 10, fontSize: 13, color: "var(--text)", display: "flex", gap: 10, alignItems: "center" }}>
            <Icon name="lock" size={14} style={{ color: "var(--purple)" }}/>
            Você está em modo somente leitura. Apenas Owner e Administradores podem cadastrar ou editar membros.
          </div>
        )}

        <div className="kpi-grid">
          <div className="kpi"><div className="label">Membros ativos</div><div className="value">{members.filter(m => m.status === "active").length}</div></div>
          <div className="kpi"><div className="label">Inativos</div><div className="value" style={{ color: "var(--text-muted)" }}>{members.filter(m => m.status === "inactive").length}</div></div>
          <div className="kpi"><div className="label">Owners</div><div className="value">{members.filter(m => m.role === "Owner").length}</div></div>
          <div className="kpi"><div className="label">Convites pendentes</div><div className="value">0</div></div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <h3>{members.length} membros</h3>
            <span className="grow"/>
            <div className="admin-search" style={{ width: 240 }}>
              <Icon name="search" size={13}/>
              <input placeholder="nome, e-mail, papel…"/>
            </div>
          </div>
          <div className="data-table">
            <div className="dt-row header" style={{ gridTemplateColumns: "44px 1.4fr 1.4fr 130px 100px 80px 40px" }}>
              <span></span><span>Membro</span><span>E-mail</span><span>Papel</span><span>Último acesso</span><span>Status</span><span></span>
            </div>
            {members.map(m => (
              <div key={m.id} className="dt-row" style={{ gridTemplateColumns: "44px 1.4fr 1.4fr 130px 100px 80px 40px" }}>
                <span style={{
                  width: 30, height: 30, borderRadius: 50,
                  background: m.status === "active" ? "linear-gradient(135deg, var(--purple), var(--pink))" : "var(--bg-soft)",
                  color: m.status === "active" ? "white" : "var(--text-muted)",
                  display: "grid", placeItems: "center",
                  fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600
                }}>{m.initials}</span>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{m.name}</span>
                <span className="mono" style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{m.email}</span>
                <span style={{ fontSize: 12.5 }}>{m.role}</span>
                <span className="mono" style={{ fontSize: 11, color: "var(--text-faint)" }}>{m.last}</span>
                <span><span className={`status-pill ${m.status}`}><span className="dt"/>{m.status === "active" ? "ativo" : "inativo"}</span></span>
                {canManage ? (
                  <div style={{ position: "relative" }}>
                    <MemberRowMenu member={m} onEdit={() => setEditing(m)} onToggle={() => toggleStatus(m)} onRemove={() => remove(m)}/>
                  </div>
                ) : <span/>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {(adding || editing) && (
        <MemberEditor
          member={editing}
          isNew={adding}
          onClose={() => { setEditing(null); setAdding(false); }}
          onSave={upsert}
        />
      )}
    </>
  );
};

const MemberRowMenu = ({ member, onEdit, onToggle, onRemove }) => {
  const [open, setOpen] = useStateE(false);
  return (
    <>
      <button className="menu-btn" onClick={() => setOpen(!open)}><Icon name="moreV" size={14}/></button>
      {open && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 30 }} onClick={() => setOpen(false)}/>
          <div style={{
            position: "absolute", right: 0, top: "100%",
            background: "var(--bg-elev)", border: "1px solid var(--line)",
            borderRadius: 8, padding: 4, boxShadow: "var(--shadow-3)",
            minWidth: 180, zIndex: 31
          }}>
            {[
              { ico: "settings", label: "Editar perfil & permissões", fn: onEdit },
              { ico: member.status === "active" ? "x" : "check", label: member.status === "active" ? "Inativar membro" : "Reativar", fn: onToggle },
              { ico: "x", label: "Remover do painel", fn: onRemove, danger: true }
            ].map((opt, i) => (
              <button key={i} onClick={() => { opt.fn(); setOpen(false); }} style={{
                display: "flex", alignItems: "center", gap: 10,
                width: "100%", padding: "8px 10px",
                background: "transparent", border: 0, cursor: "pointer",
                color: opt.danger ? "var(--pink)" : "var(--text)",
                fontFamily: "inherit", fontSize: 12.5, borderRadius: 6,
                textAlign: "left"
              }}
              onMouseOver={e => e.currentTarget.style.background = "var(--bg-soft)"}
              onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                <Icon name={opt.ico} size={13}/>
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </>
  );
};

const MemberEditor = ({ member, isNew, onClose, onSave }) => {
  const [m, setM] = useStateE(member || {
    id: null, name: "", email: "", initials: "??", role: "Comercial", status: "active",
    perms: Object.fromEntries(MODULES.map(x => [x.id, []]))
  });

  const togglePerm = (mod, perm) => {
    setM(prev => {
      const cur = prev.perms[mod] || [];
      const next = cur.includes(perm) ? cur.filter(x => x !== perm) : [...cur, perm];
      return { ...prev, perms: { ...prev.perms, [mod]: next } };
    });
  };

  const setRole = (role) => {
    let perms;
    if (role === "Owner" || role === "Administrador") perms = Object.fromEntries(MODULES.map(x => [x.id, ["v", "e", "a"]]));
    else if (role === "Auditor") perms = Object.fromEntries(MODULES.map(x => [x.id, ["v"]]));
    else perms = m.perms;
    setM(prev => ({ ...prev, role, perms }));
  };

  return (
    <AdminModal title={isNew ? "Cadastrar membro" : `Editar · ${m.name}`} crumbs="/ membros / permissões" wide onClose={onClose}
      footer={<>
        <button className="btn ghost sm" onClick={onClose}>Cancelar</button>
        <button className="btn sm" onClick={() => onSave({ ...m, initials: m.name.split(" ").map(s => s[0]).filter(Boolean).slice(0, 2).join("").toUpperCase() || "??" })}>
          {isNew ? "Cadastrar e enviar convite" : "Salvar alterações"} <Icon name="check" size={13}/>
        </button>
      </>}>
      <div className="fld-group">
        <div className="fld-row">
          <div className="fld">
            <label>Nome completo</label>
            <input value={m.name} onChange={e => setM({ ...m, name: e.target.value })} placeholder="ex. Marina Pereira"/>
          </div>
          <div className="fld">
            <label>E-mail (deve ser @crianex.com.br)</label>
            <input type="email" value={m.email} onChange={e => setM({ ...m, email: e.target.value })} placeholder="nome@crianex.com.br"/>
          </div>
        </div>
        <div className="fld-row">
          <div className="fld">
            <label>Papel base</label>
            <select value={m.role} onChange={e => setRole(e.target.value)}>
              {ROLE_OPTIONS.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div className="fld">
            <label>Status inicial</label>
            <select value={m.status} onChange={e => setM({ ...m, status: e.target.value })}>
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
          </div>
        </div>

        <div className="fld">
          <label>Permissões por módulo</label>
          <div className="perm-matrix">
            <div className="row head">
              <span>Módulo</span><span>Visualizar</span><span>Editar</span><span>Aprovar</span>
            </div>
            {MODULES.map(mod => (
              <div key={mod.id} className="row">
                <span style={{ fontSize: 13 }}>{mod.label}</span>
                <span><input type="checkbox" className="checkbox" checked={(m.perms[mod.id] || []).includes("v")} onChange={() => togglePerm(mod.id, "v")}/></span>
                <span><input type="checkbox" className="checkbox" checked={(m.perms[mod.id] || []).includes("e")} onChange={() => togglePerm(mod.id, "e")}/></span>
                <span><input type="checkbox" className="checkbox" checked={(m.perms[mod.id] || []).includes("a")} onChange={() => togglePerm(mod.id, "a")}/></span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "var(--bg-soft)", border: "1px solid var(--line)", borderRadius: 10, padding: 12, fontSize: 12.5, color: "var(--text-muted)", display: "flex", gap: 10, alignItems: "flex-start" }}>
          <Icon name="bell" size={14} style={{ flexShrink: 0, marginTop: 2, color: "var(--purple)" }}/>
          <span>O membro receberá um e-mail com link de ativação. O acesso só é concedido após login via Google Workspace com o e-mail informado.</span>
        </div>
      </div>
    </AdminModal>
  );
};

// ═══════════════════════════════════════════════════
// PRODUCT LOGS (Supabase)
// ═══════════════════════════════════════════════════
const productHealth = [
  { id: "avali", name: "Avali", color: "#7f3fe5", iconText: "AV", status: "healthy", uptime: "99.98%", p95: "112ms", err: "0.04%", req: "12.4K/h", db: "1.2% CPU", events: 8421 },
  { id: "pontua", name: "Pontua", color: "#e71f84", iconText: "PN", status: "healthy", uptime: "99.94%", p95: "98ms", err: "0.02%", req: "8.1K/h", db: "0.9% CPU", events: 4810 },
  { id: "notifly", name: "Notifly", color: "#66df7a", iconText: "NF", status: "degraded", uptime: "99.71%", p95: "342ms", err: "0.84%", req: "184K/h", db: "8.4% CPU", events: 92044 },
  { id: "trilho", name: "Trilho", color: "#7f3fe5", iconText: "TR", status: "healthy", uptime: "99.99%", p95: "76ms", err: "0.01%", req: "2.4K/h", db: "0.4% CPU", events: 1184 },
  { id: "atende", name: "Atende", color: "#e71f84", iconText: "AT", status: "healthy", uptime: "99.92%", p95: "188ms", err: "0.12%", req: "5.6K/h", db: "1.8% CPU", events: 6042 },
  { id: "ledger", name: "Ledger", color: "#66df7a", iconText: "LG", status: "healthy", uptime: "99.96%", p95: "144ms", err: "0.06%", req: "1.2K/h", db: "0.8% CPU", events: 412 }
];

const AdminProductLogs = () => {
  const [tab, setTab] = useStateE("avali");
  const current = productHealth.find(p => p.id === tab) || productHealth[0];

  const events = useMemoE(() => {
    const types = ["query.success", "query.success", "query.success", "fn.invoke", "auth.signin", "rt.broadcast", "storage.upload"];
    const levels = ["info", "info", "info", "info", "info", "info", "warn", "info"];
    return Array.from({ length: 12 }, (_, i) => ({
      t: `15:${42 - Math.floor(i / 2)}:${(58 - i * 4 + 60) % 60}.${String(Math.floor(Math.random() * 999)).padStart(3, "0")}`,
      lvl: levels[(i + tab.charCodeAt(0)) % levels.length],
      type: types[(i + tab.charCodeAt(0) * 3) % types.length],
      msg: [
        `SELECT * FROM tenants WHERE id = $1 (12 rows · 4ms)`,
        `INSERT INTO events (...) RETURNING * (1 row · 8ms)`,
        `Edge function "${current.id}-grade" responded 200 in 142ms`,
        `Realtime channel "tenant:${42 + i}" broadcast → 18 subscribers`,
        `Storage upload bucket="${current.id}-assets" object="${current.id}-${1000 + i}.png" 312KB`,
        `Auth signin succeeded · user_id=auth-${1000 + i}`,
        `Connection pool: 23/40 active (57%)`,
        `RLS policy "tenant_isolation" matched on table=tenants row=${100 + i}`
      ][(i + tab.charCodeAt(0)) % 8]
    }));
  }, [tab]);

  return (
    <>
      <AdminTopbar title="Logs de produtos" crumbs={`/ logs / ${current.id} · supabase`}
        extra={<>
          <span className="pill" style={{ background: "rgba(102,223,122,0.18)", color: "var(--green)" }}>● SUPABASE · sa-east-1</span>
          <button className="btn sm ghost" style={{ padding: "6px 10px" }}><Icon name="filter" size={13}/></button>
          <button className="btn sm ghost" style={{ padding: "6px 10px" }}><Icon name="download" size={13}/></button>
        </>}/>
      <div className="admin-content">
        {/* Health summary */}
        <div className="health-grid">
          {productHealth.map(p => (
            <div className="health-card" key={p.id}>
              <div className="ll">
                <div className="nm">
                  <span className="pico" style={{ background: p.color }}>{p.iconText}</span>
                  {p.name}
                </div>
                <span className={`status-pill ${p.status}`}><span className="dt"/>{p.status === "healthy" ? "saudável" : "degradado"}</span>
              </div>
              <div className="metrics">
                <div className="m"><span className="l">Uptime</span><span className="v">{p.uptime}</span></div>
                <div className="m"><span className="l">p95</span><span className="v">{p.p95}</span></div>
                <div className="m"><span className="l">Erros</span><span className="v" style={{ color: parseFloat(p.err) > 0.5 ? "var(--pink)" : "var(--text)" }}>{p.err}</span></div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs per product */}
        <div className="panel" style={{ padding: 0 }}>
          <div className="tabs" style={{ padding: "0 14px" }}>
            {productHealth.map(p => (
              <button key={p.id} className={`tab ${tab === p.id ? "on" : ""}`} onClick={() => setTab(p.id)}>
                <span style={{ width: 6, height: 6, borderRadius: 50, background: p.color }}/>
                {p.name}
                <span className="badge">{p.events.toLocaleString("pt-BR")}</span>
              </button>
            ))}
          </div>

          <div style={{ padding: 18 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 18 }}>
              <div className="kpi" style={{ padding: 14 }}>
                <div className="label">REQS / hora</div>
                <div className="value" style={{ fontSize: 22 }}>{current.req}</div>
              </div>
              <div className="kpi" style={{ padding: 14 }}>
                <div className="label">CPU DB</div>
                <div className="value" style={{ fontSize: 22 }}>{current.db}</div>
              </div>
              <div className="kpi" style={{ padding: 14 }}>
                <div className="label">Latência p95</div>
                <div className="value" style={{ fontSize: 22 }}>{current.p95}</div>
              </div>
              <div className="kpi" style={{ padding: 14 }}>
                <div className="label">Eventos / 24h</div>
                <div className="value" style={{ fontSize: 22 }}>{current.events.toLocaleString("pt-BR")}</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <h4 style={{ fontSize: 13, fontWeight: 500 }}>Stream em tempo real</h4>
              <span className="pulse-dot" style={{ background: "var(--green)" }}/>
              <span className="mono" style={{ fontSize: 11, color: "var(--text-muted)" }}>recebendo via realtime channel · {current.id}.public.*</span>
            </div>

            <div className="data-table" style={{ background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 8, padding: "0 12px", fontFamily: "var(--font-mono)", fontSize: 12 }}>
              <div className="dt-row header" style={{ gridTemplateColumns: "130px 60px 140px 1fr" }}>
                <span>Timestamp</span><span>Level</span><span>Operação</span><span>Detalhes</span>
              </div>
              {events.map((e, i) => (
                <div key={i} className="dt-row" style={{ gridTemplateColumns: "130px 60px 140px 1fr", padding: "9px 0" }}>
                  <span style={{ color: "var(--text-muted)" }}>{e.t}</span>
                  <span><span className={`level ${e.lvl === "warn" ? "warn" : "info"}`} style={{ padding: "2px 6px", borderRadius: 4, fontSize: 9.5, fontFamily: "var(--font-mono)", fontWeight: 600, background: e.lvl === "warn" ? "rgba(231,31,132,0.18)" : "rgba(127,63,229,0.18)", color: e.lvl === "warn" ? "var(--pink)" : "var(--purple)" }}>{e.lvl.toUpperCase()}</span></span>
                  <span style={{ color: "var(--text)" }}>{e.type}</span>
                  <span style={{ color: "var(--text-muted)" }}>{e.msg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ═══════════════════════════════════════════════════
// NOTIFICATIONS CONFIG
// ═══════════════════════════════════════════════════
const PRESET_COLORS = ["#7f3fe5", "#e71f84", "#66df7a", "#3b82f6", "#f59e0b", "#06b6d4", "#ec4899", "#10b981"];
const initialNotifs = [
  { id: 1, name: "Novo lead recebido", desc: "Disparado quando um lead entra via formulário público.", color: "#7f3fe5", icon: "users", channels: ["in-app", "email"], enabled: true },
  { id: 2, name: "Ticket crítico aberto", desc: "Severidade `critical` em qualquer produto.", color: "#e71f84", icon: "headset", channels: ["in-app", "slack", "email"], enabled: true },
  { id: 3, name: "Pagamento recebido", desc: "Confirmação de boleto, PIX ou cartão.", color: "#66df7a", icon: "check", channels: ["in-app"], enabled: true },
  { id: 4, name: "Pagamento em atraso", desc: "Fatura passou da data de vencimento.", color: "#e71f84", icon: "bell", channels: ["in-app", "email"], enabled: true },
  { id: 5, name: "Deploy em produção", desc: "Promoção de release para o cluster produtivo.", color: "#7f3fe5", icon: "bolt", channels: ["slack"], enabled: true },
  { id: 6, name: "Lead inativo (30+ dias)", desc: "Sem interação registrada há mais de 30 dias.", color: "#f59e0b", icon: "bell", channels: ["in-app"], enabled: false },
  { id: 7, name: "FAQ avaliado negativamente", desc: "Mais de 3 avaliações \"não útil\" no mesmo artigo.", color: "#06b6d4", icon: "x", channels: ["in-app"], enabled: true }
];

const AdminNotifConfig = () => {
  const [list, setList] = useStateE(initialNotifs);
  const [editing, setEditing] = useStateE(null);
  const [adding, setAdding] = useStateE(false);

  const upsert = (n) => {
    setList(prev => prev.find(p => p.id === n.id) ? prev.map(p => p.id === n.id ? n : p) : [...prev, { ...n, id: Date.now() }]);
    setEditing(null); setAdding(false);
  };
  const toggle = (n) => setList(prev => prev.map(p => p.id === n.id ? { ...p, enabled: !p.enabled } : p));

  return (
    <>
      <AdminTopbar title="Notificações padrão" crumbs="/ operações / notificações"
        extra={<button className="btn sm" onClick={() => setAdding(true)}>+ Nova notificação</button>}/>
      <div className="admin-content">
        <div className="panel">
          <div className="panel-head">
            <h3>{list.length} tipos configurados</h3>
            <span className="pill">{list.filter(n => n.enabled).length} ativas</span>
            <span className="grow"/>
            <span className="mono" style={{ fontSize: 11, color: "var(--text-faint)" }}>aplicado a todos os membros do painel</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div className="notif-row" style={{ background: "var(--bg-soft)", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-faint)" }}>
              <span></span><span>Nome e descrição</span><span>Canais</span><span>Cor</span><span>Ativa</span><span></span>
            </div>
            {list.map(n => (
              <div key={n.id} className="notif-row">
                <span className="notif-color" style={{ background: n.color }}/>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{n.name}</div>
                  <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{n.desc}</div>
                </div>
                <div className="notif-channels">
                  {n.channels.map(c => <span key={c} className="ch">{c}</span>)}
                </div>
                <div className="mono" style={{ fontSize: 10.5, color: "var(--text-muted)" }}>{n.color}</div>
                <button className={`toggle ${n.enabled ? "on" : ""}`} onClick={() => toggle(n)}/>
                <button className="menu-btn" onClick={() => setEditing(n)}><Icon name="settings" size={13}/></button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {(adding || editing) && (
        <NotifEditor
          notif={editing}
          isNew={adding}
          onClose={() => { setEditing(null); setAdding(false); }}
          onSave={upsert}
        />
      )}
    </>
  );
};

const NotifEditor = ({ notif, isNew, onClose, onSave }) => {
  const [n, setN] = useStateE(notif || { id: null, name: "", desc: "", color: PRESET_COLORS[0], icon: "bell", channels: ["in-app"], enabled: true });
  const toggleCh = (c) => setN(p => ({ ...p, channels: p.channels.includes(c) ? p.channels.filter(x => x !== c) : [...p.channels, c] }));
  return (
    <AdminModal title={isNew ? "Nova notificação" : `Editar · ${n.name}`} crumbs="/ notificações" onClose={onClose}
      footer={<>
        <button className="btn ghost sm" onClick={onClose}>Cancelar</button>
        <button className="btn sm" onClick={() => onSave(n)}>{isNew ? "Criar" : "Salvar"} <Icon name="check" size={13}/></button>
      </>}>
      <div className="fld-group">
        <div style={{ background: "var(--bg-soft)", padding: 14, borderRadius: 10, border: "1px solid var(--line)" }}>
          <div className="mono" style={{ fontSize: 10, color: "var(--text-faint)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Pré-visualização</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, background: "var(--bg-elev)", border: "1px solid var(--line)", borderRadius: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: n.color, display: "grid", placeItems: "center", color: "white" }}>
              <Icon name={n.icon} size={16}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{n.name || "Nome da notificação"}</div>
              <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 2 }}>{n.desc || "Descrição aparecerá aqui"}</div>
            </div>
            <span className="mono" style={{ fontSize: 10, color: "var(--text-faint)" }}>agora</span>
          </div>
        </div>

        <div className="fld">
          <label>Nome</label>
          <input value={n.name} onChange={e => setN({ ...n, name: e.target.value })} placeholder="ex. Novo lead recebido"/>
        </div>
        <div className="fld">
          <label>Descrição</label>
          <textarea value={n.desc} onChange={e => setN({ ...n, desc: e.target.value })} placeholder="Quando é disparada?"/>
        </div>
        <div className="fld-row">
          <div className="fld">
            <label>Ícone</label>
            <select value={n.icon} onChange={e => setN({ ...n, icon: e.target.value })}>
              {["bell", "users", "headset", "check", "x", "bolt", "mail", "cube", "bot"].map(i => <option key={i}>{i}</option>)}
            </select>
          </div>
          <div className="fld">
            <label>Cor</label>
            <div className="color-row">
              {PRESET_COLORS.map(c => (
                <button key={c} className={`color-swatch ${n.color === c ? "on" : ""}`} style={{ background: c }} onClick={() => setN({ ...n, color: c })}/>
              ))}
            </div>
          </div>
        </div>
        <div className="fld">
          <label>Canais de envio</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["in-app", "email", "slack", "webhook", "sms"].map(c => (
              <button key={c} className={`filter-chip ${n.channels.includes(c) ? "on" : ""}`} onClick={() => toggleCh(c)}>
                {n.channels.includes(c) && <Icon name="check" size={11}/>}
                {c}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 12, background: "var(--bg-soft)", borderRadius: 10, border: "1px solid var(--line)" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Ativa</div>
            <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 2 }}>Desativar pausa o envio sem deletar a configuração</div>
          </div>
          <button className={`toggle ${n.enabled ? "on" : ""}`} onClick={() => setN({ ...n, enabled: !n.enabled })}/>
        </div>
      </div>
    </AdminModal>
  );
};

// ═══════════════════════════════════════════════════
// CRM (enhanced — drawer com interações)
// ═══════════════════════════════════════════════════
const initialCRMCols = [
  { id: "novo", title: "Novo lead", color: "#7f3fe5", cards: [
    { id: "n1", name: "NIVERA Tech", contact: "rh@nivera.com", tag: "Pontua", value: "R$ 18k/mo", responsible: "Joana V.", interactions: [
      { t: "hoje · 09:14", who: "Joana V.", kind: "note", body: "Contato inicial via LinkedIn. RH quer rever programa de incentivos." },
      { t: "ontem · 17:42", who: "Sistema", kind: "email", body: "Lead capturado via formulário público — produto: Pontua." }
    ] },
    { id: "n2", name: "Folha Sistemas", contact: "leandro@folha.io", tag: "Avali", value: "R$ 42k/mo", responsible: "Ricardo L.", interactions: [
      { t: "hoje · 11:30", who: "Ricardo L.", kind: "call", body: "Call com CTO. Eles querem POC com 800 alunos antes de assinar." }
    ] },
    { id: "n3", name: "Editora Versa", contact: "diretoria@versa", tag: "Avali", value: "—", responsible: "—", interactions: [] }
  ]},
  { id: "qual", title: "Qualificado", color: "#e71f84", cards: [
    { id: "q1", name: "Quantum Lab", contact: "ana@quantum.app", tag: "Notifly", value: "R$ 9k/mo", responsible: "Joana V.", interactions: [
      { t: "anteontem · 14:00", who: "Joana V.", kind: "call", body: "Demo de 45min. Eles aprovaram tecnicamente. Aguardando aprovação financeira interna." }
    ] },
    { id: "q2", name: "RedeFort Educação", contact: "compras@redefort", tag: "Avali", value: "R$ 58k/mo", responsible: "Ricardo L.", interactions: [
      { t: "há 3 dias", who: "Ricardo L.", kind: "note", body: "Proposta enviada. Diretoria revisa na próxima quinta." }
    ] }
  ]},
  { id: "neg", title: "Em negociação", color: "#66df7a", cards: [
    { id: "g1", name: "Aletheia Group", contact: "diretor@aletheia.co", tag: "Notifly", value: "R$ 24k/mo", responsible: "Joana V.", interactions: [] },
    { id: "g2", name: "Praxis Soluções", contact: "tiago@praxis.tech", tag: "Pontua", value: "R$ 16k/mo", responsible: "Ricardo L.", interactions: [] },
    { id: "g3", name: "ICE Educação", contact: "rh@ice.org.br", tag: "Avali", value: "R$ 88k/mo", responsible: "Joana V.", interactions: [] }
  ]},
  { id: "fech", title: "Fechado", color: "#7f3fe5", cards: [
    { id: "f1", name: "Cluster Verde", contact: "ti@cluster.com", tag: "Notifly", value: "R$ 12k/mo", responsible: "Ricardo L.", interactions: [] },
    { id: "f2", name: "Bons Negócios SA", contact: "cio@bn.com.br", tag: "Pontua", value: "R$ 28k/mo", responsible: "Joana V.", interactions: [] }
  ]}
];

const AdminCRMEnhanced = ({ currentUser }) => {
  const [cols, setCols] = useStateE(initialCRMCols);
  const [active, setActive] = useStateE(null);
  const [addingLead, setAddingLead] = useStateE(false);
  const [dragCard, setDragCard] = useStateE(null);
  const [dropCol, setDropCol] = useStateE(null);

  const findCard = (id) => {
    for (const col of cols) {
      const c = col.cards.find(x => x.id === id);
      if (c) return { card: c, col };
    }
    return null;
  };

  const addInteraction = (cardId, interaction) => {
    setCols(prev => prev.map(col => ({
      ...col,
      cards: col.cards.map(c => c.id === cardId ? { ...c, interactions: [interaction, ...c.interactions] } : c)
    })));
    setActive(cardId);
  };

  const addLead = (lead) => {
    const id = `lead-${Date.now()}`;
    const card = {
      id,
      name: lead.name,
      contact: lead.contact || "—",
      tag: lead.tag,
      value: lead.value || "—",
      responsible: lead.responsible,
      interactions: lead.note?.trim() ? [{ t: "agora", who: currentUser.name, kind: "note", body: lead.note.trim() }] : []
    };
    setCols(prev => prev.map(c => c.id === lead.stage ? { ...c, cards: [card, ...c.cards] } : c));
    setAddingLead(false);
    setActive(id);
  };

  const moveCard = (cardId, targetColId) => {
    setCols(prev => {
      let card = null;
      const without = prev.map(col => {
        const idx = col.cards.findIndex(c => c.id === cardId);
        if (idx < 0) return col;
        card = col.cards[idx];
        return { ...col, cards: col.cards.filter(c => c.id !== cardId) };
      });
      if (!card) return prev;
      return without.map(col => col.id === targetColId ? { ...col, cards: [card, ...col.cards] } : col);
    });
  };

  const activeData = active ? findCard(active) : null;

  return (
    <>
      <AdminTopbar title="CRM · Pipeline de leads" crumbs="/ crm / kanban"
        extra={<button className="btn sm" onClick={() => setAddingLead(true)}>+ Novo lead</button>}/>
      <div className="admin-content">
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "4px 4px 0", fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--text-faint)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          <Icon name="bot" size={12}/>
          <span>Arraste cards entre colunas para alterar o estágio do lead</span>
        </div>
        <div className="kanban">
          {cols.map(col => (
            <div className={`kb-col ${dropCol === col.id ? "drop-active" : ""}`} key={col.id}
              onDragOver={e => { if (dragCard) { e.preventDefault(); setDropCol(col.id); } }}
              onDragLeave={e => {
                if (!e.currentTarget.contains(e.relatedTarget)) setDropCol(null);
              }}
              onDrop={e => {
                e.preventDefault();
                if (dragCard) {
                  const src = findCard(dragCard);
                  if (src && src.col.id !== col.id) moveCard(dragCard, col.id);
                }
                setDragCard(null); setDropCol(null);
              }}>
              <div className="kb-col-head">
                <span className="lead-dot" style={{ background: col.color }}/>
                <span>{col.title}</span>
                <span className="ct">{col.cards.length}</span>
              </div>
              {col.cards.map(c => (
                <div className={`kb-card ${dragCard === c.id ? "dragging" : ""}`} key={c.id}
                  draggable
                  onDragStart={e => { setDragCard(c.id); e.dataTransfer.effectAllowed = "move"; }}
                  onDragEnd={() => { setDragCard(null); setDropCol(null); }}
                  onClick={() => { if (!dragCard) setActive(c.id); }}>
                  <div className="cname">{c.name}</div>
                  <div className="ccontact">{c.contact}</div>
                  <div className="crow">
                    <span className="ctag">{c.tag}</span>
                    <span className="value">{c.value}</span>
                  </div>
                  {c.interactions.length > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, paddingTop: 6, fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-faint)" }}>
                      <Icon name="bot" size={11}/>
                      {c.interactions.length} interação{c.interactions.length > 1 ? "ões" : ""}
                    </div>
                  )}
                </div>
              ))}
              <button onClick={() => setAddingLead(true)} style={{ background: "transparent", border: "1px dashed var(--line-strong)", borderRadius: 8, color: "var(--text-faint)", padding: 10, fontFamily: "inherit", fontSize: 12, cursor: "pointer" }}>
                + adicionar
              </button>
            </div>
          ))}
        </div>
      </div>

      {activeData && (
        <>
          <div className="admin-drawer-bg" onClick={() => setActive(null)}/>
          <CRMDrawer card={activeData.card} col={activeData.col} onClose={() => setActive(null)} onAddInteraction={addInteraction} currentUser={currentUser}/>
        </>
      )}

      {addingLead && window.NewLeadModal && (
        <window.NewLeadModal
          onClose={() => setAddingLead(false)}
          onSave={addLead}/>
      )}
    </>
  );
};

const CRMDrawer = ({ card, col, onClose, onAddInteraction, currentUser }) => {
  const [kind, setKind] = useStateE("note");
  const [body, setBody] = useStateE("");

  const submit = (e) => {
    e.preventDefault();
    if (!body.trim()) return;
    onAddInteraction(card.id, { t: "agora", who: currentUser.name, kind, body });
    setBody(""); setKind("note");
  };

  return (
    <aside className="admin-drawer">
      <div className="admin-drawer-head">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", padding: "3px 8px", borderRadius: 100, background: "var(--bg-soft)", color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: 50, background: col.color, marginRight: 6, verticalAlign: "middle" }}/>{col.title}
          </span>
          <span style={{ flex: 1 }}/>
          <button className="x" onClick={onClose}><Icon name="x" size={14}/></button>
        </div>
        <h3 style={{ fontSize: 22, letterSpacing: "-0.02em", fontWeight: 500, marginTop: 14 }}>{card.name}</h3>
        <div className="mono" style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{card.contact}</div>
        <div style={{ display: "flex", gap: 18, marginTop: 18, paddingTop: 14, borderTop: "1px solid var(--line)" }}>
          <div>
            <div className="mono" style={{ fontSize: 10, color: "var(--text-faint)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Valor estimado</div>
            <div style={{ fontSize: 16, fontWeight: 500, letterSpacing: "-0.015em", marginTop: 3 }}>{card.value}</div>
          </div>
          <div>
            <div className="mono" style={{ fontSize: 10, color: "var(--text-faint)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Produto</div>
            <div style={{ fontSize: 13, marginTop: 5 }}>{card.tag}</div>
          </div>
          <div>
            <div className="mono" style={{ fontSize: 10, color: "var(--text-faint)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Responsável</div>
            <div style={{ fontSize: 13, marginTop: 5 }}>{card.responsible}</div>
          </div>
        </div>
      </div>

      <div className="admin-drawer-body">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <h4 style={{ fontSize: 13, fontWeight: 500 }}>Interações registradas</h4>
            <span className="pill">{card.interactions.length}</span>
          </div>
          {card.interactions.length === 0 ? (
            <div style={{ padding: 18, border: "1px dashed var(--line)", borderRadius: 10, color: "var(--text-muted)", fontSize: 12.5, textAlign: "center" }}>
              Nenhuma interação registrada. Adicione abaixo conforme conversar com o cliente.
            </div>
          ) : (
            <div className="timeline">
              {card.interactions.map((it, i) => (
                <div key={i} className={`timeline-item ${it.kind}`}>
                  <div className="pip">
                    <Icon name={it.kind === "call" ? "headset" : it.kind === "email" ? "mail" : "bot"} size={12}/>
                  </div>
                  <div>
                    <div className="meta">{it.t} · {it.kind}</div>
                    <div className="body"><span className="actor">{it.who}</span> · {it.body}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <form className="admin-drawer-foot" onSubmit={submit}>
        <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
          {[
            { id: "note", label: "Nota", ico: "bot" },
            { id: "call", label: "Ligação", ico: "headset" },
            { id: "email", label: "E-mail", ico: "mail" }
          ].map(t => (
            <button key={t.id} type="button" onClick={() => setKind(t.id)}
              className={`filter-chip ${kind === t.id ? "on" : ""}`}>
              <Icon name={t.ico} size={11}/> {t.label}
            </button>
          ))}
          <span style={{ flex: 1 }}/>
          <span className="mono" style={{ fontSize: 10, color: "var(--text-faint)", alignSelf: "center", letterSpacing: "0.06em", textTransform: "uppercase" }}>como {currentUser.name.split(" ")[0]}</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
          <textarea value={body} onChange={e => setBody(e.target.value)}
            placeholder={kind === "note" ? "Anotação interna ou observação…" : kind === "call" ? "Resumo da conversa, próximos passos…" : "Conteúdo enviado, anexos…"}
            style={{
              flex: 1, resize: "none", height: 64,
              border: "1px solid var(--line)", borderRadius: 8,
              padding: "8px 12px", fontFamily: "inherit", fontSize: 13, color: "var(--text)",
              background: "var(--bg)", outline: "none"
            }}
            onFocus={e => e.target.style.borderColor = "var(--purple)"}
            onBlur={e => e.target.style.borderColor = "var(--line)"}/>
          <button type="submit" className="btn sm" style={{ alignSelf: "flex-end" }}>
            Registrar <Icon name="arrow" size={13}/>
          </button>
        </div>
      </form>
    </aside>
  );
};

window.AdminModal = AdminModal;
window.AdminProfile = AdminProfile;
window.AdminFinance = AdminFinance;
window.AdminMembers = AdminMembers;
window.AdminProductLogs = AdminProductLogs;
window.AdminNotifConfig = AdminNotifConfig;
window.AdminCRMEnhanced = AdminCRMEnhanced;
