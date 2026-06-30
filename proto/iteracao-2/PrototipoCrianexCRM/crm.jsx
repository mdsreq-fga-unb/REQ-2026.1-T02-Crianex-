// Crianex CRM — main page: toolbar, filters, kanban + table views, CSV export.
// Lead grouping (one card per person/company) handled by the data model.

const { useState: useStateC, useEffect: useEffectC, useMemo: useMemoC, useRef: useRefC } = React;

const LS_KEY = "crianex-crm-v1";

// ── persistence ──
const loadState = () => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      if (p.leads && p.columns) return p;
    }
  } catch (e) {}
  return { leads: CRM.SEED_LEADS, columns: CRM.DEFAULT_COLUMNS };
};

// ── small shared atoms ──
const ProductTag = ({ id, count }) => {
  const p = CRM.PRODUCT_BY_ID[id];
  if (!p) return null;
  return (
    <span className="crm-prodtag" style={{ background: p.color + "22", color: p.color }}>
      <span className="d" style={{ background: p.color }}/>{p.name}{count > 1 ? ` ×${count}` : ""}
    </span>
  );
};

const ContactButtons = ({ lead, size = "card" }) => (
  <div className="crm-actions" onClick={e => e.stopPropagation()}>
    <a className="crm-iconbtn wa" href={CRM.waLink(lead)} target="_blank" rel="noopener" title={`WhatsApp · ${lead.phone}`}>
      <Icon name="whatsapp" size={15}/>
    </a>
    <a className="crm-iconbtn mail" href={CRM.mailLink(lead)} title={`E-mail · ${lead.email}`}>
      <Icon name="mail" size={15}/>
    </a>
  </div>
);

// ── Lead card (kanban) ──
const LeadCard = ({ lead, col, productFilter, onOpen, onDragStart, onDragEnd, dragging }) => {
  const prods = CRM.leadProducts(lead);
  const value = CRM.leadValue(lead, productFilter !== "all" ? productFilter : null);
  const stale = /\d+d/.test(lead.lastActivity) && parseInt(lead.lastActivity) >= 7;
  return (
    <div className={`crm-card ${dragging ? "dragging" : ""}`}
      draggable
      onDragStart={e => { onDragStart(lead.id); e.dataTransfer.effectAllowed = "move"; }}
      onDragEnd={onDragEnd}
      onClick={() => onOpen(lead.id)}>
      <div className="top">
        <span className="crm-avatar" style={{ background: col?.color || "var(--purple)" }}>{CRM.initials(lead.company)}</span>
        <div className="who">
          <div className="company">{lead.company}</div>
          <div className="person">{lead.name}{lead.role ? ` · ${lead.role}` : ""}</div>
        </div>
      </div>
      <div className="crm-prods">
        {prods.map(p => <ProductTag key={p} id={p} count={lead.requests.filter(r => r.product === p).length}/>)}
      </div>
      <div className="meta-row">
        <span className="crm-pedidos">
          {lead.requests.length > 1
            ? <><span className="badge">{lead.requests.length} pedidos</span></>
            : <><Icon name="file" size={11}/> 1 pedido</>}
        </span>
        <span className="val">{CRM.fmtBRL(value)}{value ? <small style={{ color: "var(--text-faint)", fontWeight: 400 }}>/mo</small> : ""}</span>
      </div>
      <div className="meta-row" style={{ borderTop: 0, paddingTop: 0 }}>
        <span className="respo">
          {stale && <span className="agewarn" title="Sem interação recente"><Icon name="bell" size={10} style={{ verticalAlign: "-1px" }}/> </span>}
          {lead.responsible} · {lead.lastActivity}
        </span>
        <ContactButtons lead={lead}/>
      </div>
    </div>
  );
};

// ── Kanban view ──
const KanbanView = ({ columns, leads, productFilter, onOpen, onMove, onAddLead, onEditCol, onAddCol }) => {
  const [dragId, setDragId] = useStateC(null);
  const [dropCol, setDropCol] = useStateC(null);

  return (
    <div className="crm-kanban">
      {columns.map(col => {
        const cards = leads.filter(l => l.stage === col.id);
        const total = cards.reduce((s, l) => s + CRM.leadValue(l, productFilter !== "all" ? productFilter : null), 0);
        return (
          <div key={col.id}
            className={`crm-col ${dropCol === col.id ? "drop-active" : ""}`}
            onDragOver={e => { if (dragId) { e.preventDefault(); setDropCol(col.id); } }}
            onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget)) setDropCol(null); }}
            onDrop={e => {
              e.preventDefault();
              if (dragId) onMove(dragId, col.id);
              setDragId(null); setDropCol(null);
            }}>
            <div className="crm-col-head">
              <span className="dot" style={{ background: col.color }}/>
              <span className="title">{col.title}</span>
              <span className="ct">{cards.length}</span>
              <button className="gear" title="Editar colunas" onClick={onEditCol}><Icon name="settings" size={13}/></button>
            </div>
            <div className="crm-col-total">
              <span>pipeline</span>
              <b>{CRM.fmtBRL(total)}{total ? "/mo" : ""}</b>
            </div>
            {cards.map(l => (
              <LeadCard key={l.id} lead={l} col={col} productFilter={productFilter}
                onOpen={onOpen}
                dragging={dragId === l.id}
                onDragStart={setDragId}
                onDragEnd={() => { setDragId(null); setDropCol(null); }}/>
            ))}
            <button className="crm-addcard" onClick={() => onAddLead(col.id)}>+ adicionar lead</button>
          </div>
        );
      })}
      <button className="crm-addcol" onClick={onAddCol} title="Nova coluna">+ COLUNA</button>
    </div>
  );
};

// ── Table view ──
const TableView = ({ columns, leads, productFilter, onOpen }) => {
  const [expanded, setExpanded] = useStateC({});
  const [sort, setSort] = useStateC({ key: "lastActivity", dir: 1 });
  const colTitle = id => columns.find(c => c.id === id)?.title || id;
  const colColor = id => columns.find(c => c.id === id)?.color || "#9a968e";

  const sorted = useMemoC(() => {
    const val = l => {
      switch (sort.key) {
        case "company": return l.company.toLowerCase();
        case "value": return CRM.leadValue(l, productFilter !== "all" ? productFilter : null);
        case "pedidos": return l.requests.length;
        case "stage": return columns.findIndex(c => c.id === l.stage);
        case "responsible": return l.responsible;
        default: return l.createdAt || "";
      }
    };
    return [...leads].sort((a, b) => {
      const va = val(a), vb = val(b);
      if (va < vb) return -sort.dir;
      if (va > vb) return sort.dir;
      return 0;
    });
  }, [leads, sort, productFilter, columns]);

  const th = (key, label, opts = {}) => (
    <th className={`${opts.nosort ? "no-sort" : ""} ${sort.key === key ? "sorted" : ""}`}
      style={opts.style}
      onClick={() => !opts.nosort && setSort(s => ({ key, dir: s.key === key ? -s.dir : 1 }))}>
      {label}{!opts.nosort && <span className="sortcaret">{sort.key === key ? (sort.dir > 0 ? "▲" : "▼") : "▲"}</span>}
    </th>
  );

  return (
    <div className="crm-table-wrap">
      <table className="crm-table">
        <thead>
          <tr>
            <th className="no-sort" style={{ width: 30 }}/>
            {th("company", "Empresa · contato")}
            <th className="no-sort">Produtos</th>
            {th("pedidos", "Pedidos", { style: { textAlign: "center" } })}
            {th("value", "Valor / mês", { style: { textAlign: "right" } })}
            {th("stage", "Estágio")}
            {th("responsible", "Responsável")}
            {th("lastActivity", "Atividade")}
            <th className="no-sort" style={{ textAlign: "right" }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(l => {
            const open = expanded[l.id];
            const value = CRM.leadValue(l, productFilter !== "all" ? productFilter : null);
            return (
              <React.Fragment key={l.id}>
                <tr className="lead-row" onClick={() => onOpen(l.id)}>
                  <td onClick={e => { e.stopPropagation(); setExpanded(x => ({ ...x, [l.id]: !x[l.id] })); }}>
                    {l.requests.length > 1 && <button className={`crm-texpand ${open ? "open" : ""}`}><Icon name="arrow" size={13}/></button>}
                  </td>
                  <td>
                    <div className="crm-tname">{l.company}</div>
                    <div className="crm-tsub">{l.name} · {l.email}</div>
                  </td>
                  <td>
                    <div className="crm-prods">
                      {CRM.leadProducts(l).map(p => <ProductTag key={p} id={p} count={l.requests.filter(r => r.product === p).length}/>)}
                    </div>
                  </td>
                  <td style={{ textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 12 }}>{l.requests.length}</td>
                  <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: 600 }}>{CRM.fmtBRL(value)}</td>
                  <td>
                    <span className="crm-tstage"><span className="d" style={{ background: colColor(l.stage) }}/>{colTitle(l.stage)}</span>
                  </td>
                  <td style={{ fontSize: 12.5, color: "var(--text-muted)" }}>{l.responsible}</td>
                  <td className="crm-tsub" style={{ fontSize: 11.5 }}>{l.lastActivity}</td>
                  <td>
                    <div className="col-actions" style={{ justifyContent: "flex-end" }}>
                      <a className="crm-iconbtn wa" href={CRM.waLink(l)} target="_blank" rel="noopener" onClick={e => e.stopPropagation()} title="WhatsApp"><Icon name="whatsapp" size={14}/></a>
                      <a className="crm-iconbtn mail" href={CRM.mailLink(l)} onClick={e => e.stopPropagation()} title="E-mail"><Icon name="mail" size={14}/></a>
                    </div>
                  </td>
                </tr>
                {open && l.requests.length > 1 && (
                  <tr className="crm-subrow">
                    <td colSpan={9}>
                      <div className="inner">
                        {l.requests.map(r => (
                          <div className="crm-pedido-line" key={r.id}>
                            <ProductTag id={r.product}/>
                            <span className="msg">{r.message}</span>
                            <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-faint)", fontSize: 11 }}>{r.date}</span>
                            <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, textAlign: "right" }}>{CRM.fmtBRL(r.value)}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      {sorted.length === 0 && (
        <div className="crm-empty">
          <div className="ico"><Icon name="users" size={20}/></div>
          Nenhum lead corresponde aos filtros atuais.
        </div>
      )}
    </div>
  );
};

// ── Root CRM page ──
const CRMPage = () => {
  const init = loadState();
  const [leads, setLeads] = useStateC(init.leads);
  const [columns, setColumns] = useStateC(init.columns);
  const [view, setView] = useStateC("kanban");
  const [productFilter, setProductFilter] = useStateC("all");
  const [respFilter, setRespFilter] = useStateC("all");
  const [search, setSearch] = useStateC("");
  const [active, setActive] = useStateC(null);
  const [editingCols, setEditingCols] = useStateC(false);
  const [addingLead, setAddingLead] = useStateC(null); // stage id or true
  const [dupeDismissed, setDupeDismissed] = useStateC(false);

  useEffectC(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify({ leads, columns })); } catch (e) {}
  }, [leads, columns]);

  // filtering
  const filtered = useMemoC(() => {
    const q = search.trim().toLowerCase();
    return leads.filter(l => {
      if (productFilter !== "all" && !l.requests.some(r => r.product === productFilter)) return false;
      if (respFilter !== "all" && l.responsible !== respFilter) return false;
      if (q && !(`${l.company} ${l.name} ${l.email} ${l.role || ""}`.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [leads, productFilter, respFilter, search]);

  // stats
  const stats = useMemoC(() => {
    const openStages = columns.filter(c => !/fech|perd/.test(c.id)).map(c => c.id);
    const wonStage = columns.find(c => /fech/.test(c.id))?.id;
    const pf = productFilter !== "all" ? productFilter : null;
    let open = 0, won = 0;
    filtered.forEach(l => {
      const v = CRM.leadValue(l, pf);
      if (l.stage === wonStage) won += v;
      else if (openStages.includes(l.stage)) open += v;
    });
    return { count: filtered.length, open, won };
  }, [filtered, columns, productFilter]);

  const dupes = useMemoC(() => CRM.findDuplicates(leads), [leads]);

  // actions
  const moveLead = (id, stage) => setLeads(ls => ls.map(l => l.id === id ? { ...l, stage, lastActivity: "agora" } : l));
  const updateLead = (id, patch) => setLeads(ls => ls.map(l => l.id === id ? { ...l, ...patch } : l));
  const addLead = (lead) => {
    const id = `lead-${Date.now()}`;
    setLeads(ls => [{ ...lead, id }, ...ls]);
    setAddingLead(null);
    setActive(id);
  };
  const saveColumns = (next) => {
    const ids = new Set(next.map(c => c.id));
    const fallback = next[0]?.id;
    // reassign leads whose column was deleted
    setLeads(ls => ls.map(l => ids.has(l.stage) ? l : { ...l, stage: fallback }));
    setColumns(next);
    setEditingCols(false);
  };

  const exportCSV = () => {
    const withTitles = filtered.map(l => ({ ...l, _colTitle: columns.find(c => c.id === l.stage)?.title }));
    const label = productFilter === "all" ? "geral" : productFilter;
    CRM.download(`crianex-crm-${label}-${new Date().toISOString().slice(0, 10)}.csv`, CRM.toCSV(withTitles));
  };

  const activeLead = active ? leads.find(l => l.id === active) : null;
  const activeCol = activeLead ? columns.find(c => c.id === activeLead.stage) : null;

  return (
    <div className="crm-page">
      {/* Header */}
      <div className="crm-head">
        <div className="brand"><LogoMarkOnDark size={20}/> <span>Crianex CRM</span></div>
        <span className="crumb">/ comercial / pipeline de leads</span>
        <span className="grow"/>
        <div className="crm-seg">
          <button className={view === "kanban" ? "on" : ""} onClick={() => setView("kanban")}><Icon name="dashboard" size={14}/> Pipeline</button>
          <button className={view === "table" ? "on" : ""} onClick={() => setView("table")}><Icon name="layers" size={14}/> Tabela</button>
        </div>
        <button className="btn ghost sm" onClick={() => setEditingCols(true)} style={{ padding: "7px 12px" }}><Icon name="settings" size={14}/> Colunas</button>
        <button className="btn ghost sm" onClick={exportCSV} style={{ padding: "7px 12px" }}><Icon name="download" size={14}/> CSV</button>
        <button className="btn sm" onClick={() => setAddingLead(columns[0]?.id || "novo")}>+ Novo lead</button>
      </div>

      {/* Filter bar */}
      <div className="crm-bar">
        <span className="label-mono">Produto</span>
        <button className={`crm-prodchip ${productFilter === "all" ? "on" : ""}`}
          style={productFilter === "all" ? { background: "var(--text)", color: "var(--bg)" } : {}}
          onClick={() => setProductFilter("all")}>
          Geral <span className="ct">{leads.length}</span>
        </button>
        {CRM.PRODUCTS.map(p => {
          const ct = leads.filter(l => l.requests.some(r => r.product === p.id)).length;
          const on = productFilter === p.id;
          return (
            <button key={p.id} className={`crm-prodchip ${on ? "on" : ""}`}
              style={on ? { background: p.color + "22", borderColor: p.color, color: p.color } : {}}
              onClick={() => setProductFilter(p.id)}>
              <span className="swatch" style={{ background: p.color }}/>{p.name} <span className="ct">{ct}</span>
            </button>
          );
        })}
        <span className="vline"/>
        <select className="crm-select" value={respFilter} onChange={e => setRespFilter(e.target.value)}>
          <option value="all">Todos os responsáveis</option>
          {CRM.RESPONSIBLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <span className="grow"/>
        <div className="crm-search">
          <Icon name="search" size={14}/>
          <input placeholder="Buscar empresa, pessoa, e-mail…" value={search} onChange={e => setSearch(e.target.value)}/>
        </div>
      </div>

      {/* Stats */}
      <div className="crm-stats">
        <div className="stat"><div className="k">Leads {productFilter !== "all" ? "· " + CRM.PRODUCT_BY_ID[productFilter].name : "no filtro"}</div><div className="v">{stats.count}</div></div>
        <div className="stat"><div className="k">Pipeline em aberto</div><div className="v">{CRM.fmtBRL(stats.open)}<small>/mo</small></div></div>
        <div className="stat"><div className="k">Fechado (recorrente)</div><div className="v" style={{ color: "var(--green)" }}>{CRM.fmtBRL(stats.won)}<small>/mo</small></div></div>
        <div className="stat"><div className="k">Colunas no pipeline</div><div className="v">{columns.length}</div></div>
      </div>

      {/* Duplicate banner */}
      {dupes.length > 0 && !dupeDismissed && (
        <div className="crm-dupe-banner">
          <span className="dot"/>
          <span><b>{dupes.length}</b> empresa(s) com cadastros possivelmente duplicados — abra o lead para revisar e unificar os pedidos em um só card.</span>
          <button onClick={() => setDupeDismissed(true)}>Dispensar</button>
        </div>
      )}

      {/* Body */}
      <div className="crm-body">
        {view === "kanban" ? (
          <KanbanView columns={columns} leads={filtered} productFilter={productFilter}
            onOpen={setActive} onMove={moveLead}
            onAddLead={(stage) => setAddingLead(stage)}
            onEditCol={() => setEditingCols(true)}
            onAddCol={() => setEditingCols(true)}/>
        ) : (
          <TableView columns={columns} leads={filtered} productFilter={productFilter} onOpen={setActive}/>
        )}
      </div>

      {/* Drawer */}
      {activeLead && window.CRMDrawer && (
        <>
          <div className="admin-drawer-bg" onClick={() => setActive(null)}/>
          <window.CRMDrawer lead={activeLead} col={activeCol} columns={columns}
            onClose={() => setActive(null)}
            onUpdate={updateLead}
            onMove={moveLead}/>
        </>
      )}

      {/* Column editor */}
      {editingCols && window.CRMColumnEditor && (
        <window.CRMColumnEditor columns={columns} onClose={() => setEditingCols(false)} onSave={saveColumns}/>
      )}

      {/* New lead */}
      {addingLead && window.CRMNewLead && (
        <window.CRMNewLead columns={columns} initialStage={addingLead}
          onClose={() => setAddingLead(null)} onSave={addLead}/>
      )}
    </div>
  );
};

window.CRMPage = CRMPage;
window.ProductTag = ProductTag;
