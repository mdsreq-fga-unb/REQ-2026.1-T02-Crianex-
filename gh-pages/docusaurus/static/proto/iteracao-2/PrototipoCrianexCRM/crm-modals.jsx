// Crianex CRM — modals & drawer: lead detail (grouped pedidos + contact + interactions),
// column editor (rename/color/reorder/criteria/add/delete), new lead form.

const { useState: useStateM, useRef: useRefM } = React;

// ── self-contained modal shell (reuses styles.css admin-modal classes) ──
const CrmModal = ({ title, crumbs, wide, onClose, footer, children }) => (
  <div className="admin-overlay" onClick={onClose}>
    <div className={`admin-modal ${wide ? "wide" : ""}`} onClick={e => e.stopPropagation()}>
      <div className="admin-modal-head">
        <h3>{title}</h3>
        {crumbs && <span className="crumbs">{crumbs}</span>}
        <button className="x" onClick={onClose}><Icon name="x" size={14}/></button>
      </div>
      <div className="admin-modal-body">{children}</div>
      {footer && <div className="admin-modal-foot">{footer}</div>}
    </div>
  </div>
);

const COL_COLORS = ["#7f3fe5", "#e71f84", "#66df7a", "#3b82f6", "#f59e0b", "#06b6d4", "#ec4899", "#9a968e"];

// ═══════════════════════════════════════════════
// LEAD DRAWER — one person, all their pedidos + actions + interactions
// ═══════════════════════════════════════════════
const CRMDrawer = ({ lead, col, columns, onClose, onUpdate, onMove }) => {
  const [kind, setKind] = useStateM("note");
  const [body, setBody] = useStateM("");
  const total = CRM.leadValue(lead);

  const addInteraction = () => {
    if (!body.trim()) return;
    onUpdate(lead.id, {
      lastActivity: "agora",
      interactions: [{ t: "agora", who: lead.responsible || "Você", kind, body: body.trim() }, ...lead.interactions]
    });
    setBody(""); setKind("note");
  };

  return (
    <aside className="admin-drawer crm-drawer">
      <div className="admin-drawer-head">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", padding: "3px 9px", borderRadius: 100, background: "var(--bg-soft)", color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: 50, background: col?.color, marginRight: 6, verticalAlign: "middle" }}/>{col?.title}
          </span>
          {lead.requests.length > 1 && (
            <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", padding: "3px 9px", borderRadius: 100, background: "var(--accent-soft)", color: "var(--purple)", border: "1px solid var(--accent-line)", display: "inline-flex", alignItems: "center", gap: 5 }}>
              <Icon name="merge" size={11}/> {lead.requests.length} pedidos unificados
            </span>
          )}
          <span style={{ flex: 1 }}/>
          <button className="x" onClick={onClose} style={{ background: "transparent", border: 0, color: "var(--text-muted)", cursor: "pointer", width: 28, height: 28, borderRadius: 8, display: "grid", placeItems: "center" }}><Icon name="x" size={14}/></button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14 }}>
          <span className="crm-avatar" style={{ width: 42, height: 42, fontSize: 14, background: col?.color || "var(--purple)" }}>{CRM.initials(lead.company)}</span>
          <div>
            <h3 style={{ fontSize: 21, letterSpacing: "-0.02em", fontWeight: 600 }}>{lead.company}</h3>
            <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 2 }}>{lead.name}{lead.role ? ` · ${lead.role}` : ""}</div>
          </div>
        </div>

        {/* Contact actions */}
        <div className="crm-drawer-actions">
          <a className="wa" href={CRM.waLink(lead)} target="_blank" rel="noopener"><Icon name="whatsapp" size={15}/> WhatsApp</a>
          <a className="mail" href={CRM.mailLink(lead)}><Icon name="mail" size={15}/> E-mail</a>
          <a className="call" href={`tel:${CRM.phoneDigits(lead.phone)}`}><Icon name="phone" size={14}/> Ligar</a>
        </div>

        <div className="crm-kv" style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--line)" }}>
          <div><div className="k">Valor total / mês</div><div className="v" style={{ fontWeight: 600 }}>{CRM.fmtBRL(total)}</div></div>
          <div><div className="k">Responsável</div><div className="v">{lead.responsible}</div></div>
          <div><div className="k">Origem</div><div className="v">{lead.source}</div></div>
        </div>
        <div className="crm-kv" style={{ marginTop: 12 }}>
          <div><div className="k">E-mail</div><div className="v mono" style={{ fontSize: 12 }}>{lead.email}</div></div>
          <div><div className="k">Telefone</div><div className="v mono" style={{ fontSize: 12 }}>{lead.phone}</div></div>
        </div>

        {/* Stage move */}
        <div style={{ marginTop: 14 }}>
          <div className="k" style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-faint)", marginBottom: 7 }}>Mover estágio</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {columns.map(c => (
              <button key={c.id} onClick={() => onMove(lead.id, c.id)}
                className="crm-prodchip"
                style={c.id === lead.stage ? { background: c.color + "22", borderColor: c.color, color: c.color, padding: "5px 10px" } : { padding: "5px 10px" }}>
                <span className="swatch" style={{ background: c.color }}/>{c.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="admin-drawer-body">
        {/* Pedidos */}
        <div>
          <div className="crm-section-h">
            <h4>Pedidos recebidos</h4>
            <span className="pill">{lead.requests.length}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {lead.requests.map(r => {
              const p = CRM.PRODUCT_BY_ID[r.product];
              return (
                <div className="crm-deal" key={r.id}>
                  <div className="dh">
                    <span className="crm-prodtag" style={{ background: p.color + "22", color: p.color }}><span className="d" style={{ background: p.color }}/>{p.name}</span>
                    <span className="dmeta">{r.plan}</span>
                    <span className="pval">{CRM.fmtBRL(r.value)}</span>
                  </div>
                  <div className="dmsg">{r.message}</div>
                  <div className="dmeta">recebido em {r.date} · status: {r.status}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactions */}
        <div>
          <div className="crm-section-h">
            <h4>Histórico de interações</h4>
            <span className="pill">{lead.interactions.length}</span>
          </div>
          {lead.interactions.length === 0 ? (
            <div style={{ padding: 18, border: "1px dashed var(--line)", borderRadius: 10, color: "var(--text-muted)", fontSize: 12.5, textAlign: "center" }}>
              Nenhuma interação registrada ainda.
            </div>
          ) : (
            <div className="timeline">
              {lead.interactions.map((it, i) => (
                <div key={i} className={`timeline-item ${it.kind}`}>
                  <div className="pip"><Icon name={it.kind === "call" ? "headset" : it.kind === "email" ? "mail" : "bot"} size={12}/></div>
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

      {/* Add interaction */}
      <div className="admin-drawer-foot">
        <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
          {[{ id: "note", label: "Nota", ico: "bot" }, { id: "call", label: "Ligação", ico: "headset" }, { id: "email", label: "E-mail", ico: "mail" }].map(t => (
            <button key={t.id} type="button" onClick={() => setKind(t.id)} className={`filter-chip ${kind === t.id ? "on" : ""}`}>
              <Icon name={t.ico} size={11}/> {t.label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
          <textarea value={body} onChange={e => setBody(e.target.value)}
            placeholder={kind === "note" ? "Anotação interna…" : kind === "call" ? "Resumo da ligação, próximos passos…" : "Conteúdo enviado…"}
            style={{ flex: 1, resize: "none", height: 60, border: "1px solid var(--line)", borderRadius: 8, padding: "8px 12px", fontFamily: "inherit", fontSize: 13, color: "var(--text)", background: "var(--bg)", outline: "none" }}
            onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) addInteraction(); }}/>
          <button className="btn sm" style={{ alignSelf: "flex-end" }} onClick={addInteraction}>Registrar <Icon name="arrow" size={13}/></button>
        </div>
      </div>
    </aside>
  );
};

// ═══════════════════════════════════════════════
// COLUMN EDITOR — rename, recolor, reorder (drag), entry/exit criteria, add/delete
// ═══════════════════════════════════════════════
const CRMColumnEditor = ({ columns, onClose, onSave }) => {
  const [cols, setCols] = useStateM(columns.map(c => ({ ...c })));
  const [dragId, setDragId] = useStateM(null);
  const [dropT, setDropT] = useStateM(null);

  const upd = (id, patch) => setCols(cs => cs.map(c => c.id === id ? { ...c, ...patch } : c));
  const del = (id) => setCols(cs => cs.length > 1 ? cs.filter(c => c.id !== id) : cs);
  const add = () => setCols(cs => [...cs, { id: `col-${Date.now()}`, title: "Nova coluna", color: COL_COLORS[cs.length % COL_COLORS.length], entry: "", exit: "" }]);

  const onDrop = (targetId) => {
    if (!dragId || dragId === targetId) { setDragId(null); setDropT(null); return; }
    setCols(cs => {
      const next = [...cs];
      const from = next.findIndex(c => c.id === dragId);
      const [moved] = next.splice(from, 1);
      let to = next.findIndex(c => c.id === targetId);
      if (dropT?.after) to += 1;
      next.splice(to, 0, moved);
      return next;
    });
    setDragId(null); setDropT(null);
  };

  return (
    <CrmModal title="Editar colunas do pipeline" crumbs="/ crm / colunas" wide onClose={onClose}
      footer={<>
        <span className="mono" style={{ fontSize: 10.5, color: "var(--text-faint)", letterSpacing: "0.06em", textTransform: "uppercase", marginRight: "auto" }}>arraste pelo ⠿ para reordenar</span>
        <button className="btn ghost sm" onClick={onClose}>Cancelar</button>
        <button className="btn sm" onClick={() => onSave(cols)}>Salvar pipeline <Icon name="check" size={13}/></button>
      </>}>
      <div className="crm-coleditor">
        {cols.map(c => (
          <div key={c.id}
            className={`crm-colrow ${dragId === c.id ? "dragging" : ""} ${dropT?.id === c.id ? (dropT.after ? "drop-after" : "drop-before") : ""}`}
            onDragOver={e => { if (dragId && dragId !== c.id) { e.preventDefault(); const r = e.currentTarget.getBoundingClientRect(); setDropT({ id: c.id, after: e.clientY > r.top + r.height / 2 }); } }}
            onDrop={e => { e.preventDefault(); onDrop(c.id); }}>
            <div className="r1">
              <span className="handle" draggable onDragStart={() => setDragId(c.id)} onDragEnd={() => { setDragId(null); setDropT(null); }} title="arraste">
                <Icon name="moreV" size={14}/><Icon name="moreV" size={14} style={{ marginLeft: -9 }}/>
              </span>
              <input className="cname" value={c.title} onChange={e => upd(c.id, { title: e.target.value })}/>
              <div className="crm-swatches">
                {COL_COLORS.map(col => (
                  <button key={col} className={`crm-swatch ${c.color === col ? "on" : ""}`} style={{ background: col }} onClick={() => upd(c.id, { color: col })}/>
                ))}
              </div>
              <button className="del" onClick={() => del(c.id)} title="Excluir coluna" disabled={cols.length <= 1}><Icon name="x" size={15}/></button>
            </div>
            <div className="crit">
              <div className="f">
                <label>Filtro de entrada</label>
                <textarea value={c.entry || ""} onChange={e => upd(c.id, { entry: e.target.value })} placeholder="Quando um lead entra nesta coluna?"/>
              </div>
              <div className="f">
                <label>Filtro de saída</label>
                <textarea value={c.exit || ""} onChange={e => upd(c.id, { exit: e.target.value })} placeholder="Quando um lead sai desta coluna?"/>
              </div>
            </div>
          </div>
        ))}
        <button className="crm-addcard" style={{ padding: 12 }} onClick={add}>+ adicionar coluna</button>
      </div>
    </CrmModal>
  );
};

// ═══════════════════════════════════════════════
// NEW LEAD — person + first pedido
// ═══════════════════════════════════════════════
const CRMNewLead = ({ columns, initialStage, onClose, onSave }) => {
  const [f, setF] = useStateM({
    company: "", name: "", role: "", email: "", phone: "",
    product: CRM.PRODUCTS[0].id, value: "", plan: "Pro · mensal", message: "",
    responsible: CRM.RESPONSIBLES[0], source: "Cadastro manual", stage: initialStage || columns[0].id
  });
  const upd = (k, v) => setF(s => ({ ...s, [k]: v }));

  const submit = () => {
    if (!f.company.trim()) return;
    const value = parseInt(String(f.value).replace(/\D/g, "")) || 0;
    onSave({
      company: f.company, name: f.name || "Contato", role: f.role,
      email: f.email, phone: f.phone, responsible: f.responsible,
      stage: f.stage, source: f.source, createdAt: new Date().toISOString().slice(0, 10), lastActivity: "agora",
      requests: [{ id: `r-${Date.now()}`, product: f.product, value, plan: f.plan, date: "hoje", message: f.message || "—", status: "novo" }],
      interactions: f.message ? [{ t: "agora", who: f.responsible, kind: "note", body: f.message }] : []
    });
  };

  return (
    <CrmModal title="Cadastrar novo lead" crumbs="/ crm / novo" wide onClose={onClose}
      footer={<>
        <button className="btn ghost sm" onClick={onClose}>Cancelar</button>
        <button className="btn sm" onClick={submit}>Adicionar ao pipeline <Icon name="arrow" size={13}/></button>
      </>}>
      <div className="fld-group">
        <div className="fld-row">
          <div className="fld"><label>Empresa</label><input value={f.company} onChange={e => upd("company", e.target.value)} placeholder="ex. Folha Sistemas" autoFocus/></div>
          <div className="fld"><label>Contato</label><input value={f.name} onChange={e => upd("name", e.target.value)} placeholder="ex. Leandro Prado"/></div>
        </div>
        <div className="fld-row">
          <div className="fld"><label>Cargo</label><input value={f.role} onChange={e => upd("role", e.target.value)} placeholder="ex. CTO"/></div>
          <div className="fld"><label>Origem</label>
            <select value={f.source} onChange={e => upd("source", e.target.value)}>
              {["Cadastro manual", "Formulário público", "Indicação", "Evento", "Outbound"].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="fld-row">
          <div className="fld"><label>E-mail</label><input value={f.email} onChange={e => upd("email", e.target.value)} placeholder="contato@empresa.com"/></div>
          <div className="fld"><label>Telefone (com DDD)</label><input value={f.phone} onChange={e => upd("phone", e.target.value)} placeholder="+55 11 90000-0000"/></div>
        </div>
        <div style={{ height: 1, background: "var(--line)", margin: "4px 0" }}/>
        <div className="fld-row">
          <div className="fld"><label>Produto de interesse</label>
            <select value={f.product} onChange={e => upd("product", e.target.value)}>
              {CRM.PRODUCTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="fld"><label>Valor estimado / mês (R$)</label><input value={f.value} onChange={e => upd("value", e.target.value)} placeholder="24000"/></div>
        </div>
        <div className="fld-row">
          <div className="fld"><label>Plano</label>
            <select value={f.plan} onChange={e => upd("plan", e.target.value)}>
              {["Starter · mensal", "Pro · mensal", "Enterprise · mensal", "Enterprise · anual", "A definir"].map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div className="fld"><label>Responsável</label>
            <select value={f.responsible} onChange={e => upd("responsible", e.target.value)}>
              {CRM.RESPONSIBLES.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
        </div>
        <div className="fld-row">
          <div className="fld"><label>Estágio inicial</label>
            <select value={f.stage} onChange={e => upd("stage", e.target.value)}>
              {columns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div className="fld"/>
        </div>
        <div className="fld"><label>Mensagem / primeiro pedido</label>
          <textarea value={f.message} onChange={e => upd("message", e.target.value)} placeholder="O que o lead solicitou? Pontos importantes da primeira conversa…"/>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", padding: 12, background: "var(--accent-soft)", borderRadius: 10, border: "1px solid var(--accent-line)", fontSize: 12, color: "var(--text-muted)" }}>
          <Icon name="merge" size={14} style={{ color: "var(--purple)", flexShrink: 0 }}/>
          Se já existir um lead com a mesma empresa, novos pedidos podem ser unificados no mesmo card pelo botão de mesclar.
        </div>
      </div>
    </CrmModal>
  );
};

window.CRMDrawer = CRMDrawer;
window.CRMColumnEditor = CRMColumnEditor;
window.CRMNewLead = CRMNewLead;
