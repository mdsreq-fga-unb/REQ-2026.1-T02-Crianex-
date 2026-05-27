// Crianex Hub — Admin modals: Notifications panel, New lead, Product CRUD + DnD,
// FAQ CRUD. Loaded AFTER admin-extras.jsx so it can replace V1 components.

const {
  useState: useStateMd,
  useEffect: useEffectMd,
  useRef: useRefMd,
  useMemo: useMemoMd,
} = React;

// ═══════════════════════════════════════════════════
// Shared helpers: bilingual fields, image dropzone, row menu
// ═══════════════════════════════════════════════════

const BilingualField = ({
  label,
  valuePT,
  valueEN,
  onChangePT,
  onChangeEN,
  placeholder,
  multiline = false,
}) => {
  const [tab, setTab] = useStateMd('pt');
  const InputEl = multiline ? 'textarea' : 'input';
  return (
    <div className="fld">
      <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {label}
        <div className="lang-tabs">
          <button type="button" className={tab === 'pt' ? 'on' : ''} onClick={() => setTab('pt')}>
            <span className="flag">🇧🇷</span>PT
          </button>
          <button type="button" className={tab === 'en' ? 'on' : ''} onClick={() => setTab('en')}>
            <span className="flag">🇺🇸</span>EN
          </button>
        </div>
      </label>
      {tab === 'pt' ? (
        <InputEl
          value={valuePT}
          onChange={(e) => onChangePT(e.target.value)}
          placeholder={placeholder?.pt || placeholder}
        />
      ) : (
        <InputEl
          value={valueEN}
          onChange={(e) => onChangeEN(e.target.value)}
          placeholder={placeholder?.en || placeholder}
        />
      )}
    </div>
  );
};

const ImageDropzone = ({ image, onChange, fallback, color }) => {
  const inputRef = useRefMd(null);
  const handle = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  };
  return (
    <div className="image-drop" onClick={() => inputRef.current?.click()}>
      <input type="file" accept="image/*" ref={inputRef} onChange={handle} />
      {image ? (
        <>
          <div className="preview-fill" style={{ backgroundImage: `url(${image})` }} />
          <button
            type="button"
            className="remove-btn"
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
            }}
          >
            <Icon name="x" size={13} />
          </button>
        </>
      ) : fallback ? (
        <>
          <div className="preview-mock" style={{ background: color || 'var(--purple)' }}>
            <span>{fallback}</span>
          </div>
          <button
            type="button"
            className="remove-btn"
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
          >
            <Icon name="plus" size={13} />
          </button>
        </>
      ) : (
        <>
          <div className="upload-ico">
            <Icon name="download" size={16} style={{ transform: 'rotate(180deg)' }} />
          </div>
          <div className="hint">Clique para fazer upload</div>
          <div className="formats">PNG · JPG · SVG · até 4 MB</div>
        </>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════
// NOTIFICATION PANEL
// ═══════════════════════════════════════════════════
const initialNotifFeed = [
  {
    id: 1,
    type: 'Novo lead recebido',
    desc: 'Folha Sistemas chegou via formulário público — produto: Avali.',
    color: '#7f3fe5',
    icon: 'users',
    t: 'agora',
    unread: true,
  },
  {
    id: 2,
    type: 'Ticket crítico aberto',
    desc: 'Notifly · #4821 — webhook intermitente para NIVERA Tech.',
    color: '#e71f84',
    icon: 'headset',
    t: '14m',
    unread: true,
  },
  {
    id: 3,
    type: 'Pagamento recebido',
    desc: 'R$ 24.8k confirmado — NIVERA Tech (Pontua).',
    color: '#66df7a',
    icon: 'check',
    t: '2h',
    unread: true,
  },
  {
    id: 4,
    type: 'Deploy em produção',
    desc: 'Avali v4.12.0 promovido para o cluster prod-a.',
    color: '#7f3fe5',
    icon: 'bolt',
    t: '4h',
    unread: false,
  },
  {
    id: 5,
    type: 'FAQ avaliado negativamente',
    desc: '"Como configurar fallback SMS" — 3 votos "não útil" hoje.',
    color: '#06b6d4',
    icon: 'x',
    t: '1d',
    unread: false,
  },
  {
    id: 6,
    type: 'Pagamento em atraso',
    desc: 'Editora Versa — fatura INV-20245 venceu há 2 dias.',
    color: '#e71f84',
    icon: 'bell',
    t: '1d',
    unread: false,
  },
  {
    id: 7,
    type: 'Novo lead recebido',
    desc: 'Praxis Soluções demonstrou interesse em Pontua.',
    color: '#7f3fe5',
    icon: 'users',
    t: '2d',
    unread: false,
  },
];

const NotificationPanel = ({ onClose }) => {
  const [tab, setTab] = useStateMd('all');
  const [feed, setFeed] = useStateMd(initialNotifFeed);
  const list = tab === 'unread' ? feed.filter((n) => n.unread) : feed;
  const unreadCt = feed.filter((n) => n.unread).length;

  return (
    <>
      <div style={{ position: 'absolute', inset: 0, zIndex: 49 }} onClick={onClose} />
      <div className="notif-panel">
        <div className="notif-panel-head">
          <h3>Notificações</h3>
          {unreadCt > 0 && (
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                padding: '2px 7px',
                borderRadius: 100,
                background: 'rgba(231,31,132,0.18)',
                color: 'var(--pink)',
                letterSpacing: '0.06em',
              }}
            >
              {unreadCt} NOVAS
            </span>
          )}
          <span style={{ flex: 1 }} />
          <button
            className="clear"
            onClick={() => setFeed((f) => f.map((x) => ({ ...x, unread: false })))}
          >
            marcar todas
          </button>
          <button className="close" onClick={onClose}>
            <Icon name="x" size={14} />
          </button>
        </div>
        <div className="tabs" style={{ padding: '0 14px' }}>
          <button className={`tab ${tab === 'all' ? 'on' : ''}`} onClick={() => setTab('all')}>
            Tudo <span className="badge">{feed.length}</span>
          </button>
          <button
            className={`tab ${tab === 'unread' ? 'on' : ''}`}
            onClick={() => setTab('unread')}
          >
            Não lidas <span className="badge">{unreadCt}</span>
          </button>
        </div>
        <div style={{ flex: 1, overflow: 'auto' }}>
          {list.length === 0 ? (
            <div className="empty">
              <Icon name="check" size={28} style={{ color: 'var(--green)', marginBottom: 10 }} />
              <div style={{ fontSize: 14, color: 'var(--text)' }}>Tudo em dia.</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>Nada novo para revisar agora.</div>
            </div>
          ) : (
            list.map((n) => (
              <div
                key={n.id}
                className={`notif-feed-row ${n.unread ? 'unread' : ''}`}
                onClick={() =>
                  setFeed((f) => f.map((x) => (x.id === n.id ? { ...x, unread: false } : x)))
                }
              >
                <div className="ico-cell" style={{ background: n.color }}>
                  <Icon name={n.icon} size={15} />
                </div>
                <div className="body">
                  <div className="title">{n.type}</div>
                  <div className="desc">{n.desc}</div>
                </div>
                <span className="t">{n.t}</span>
              </div>
            ))
          )}
        </div>
        <div className="notif-panel-foot">
          <button className="btn ghost sm" style={{ width: '100%', justifyContent: 'center' }}>
            Ver tudo no centro de atividades <Icon name="arrow" size={13} />
          </button>
        </div>
      </div>
    </>
  );
};

// ═══════════════════════════════════════════════════
// NEW LEAD modal
// ═══════════════════════════════════════════════════
const NewLeadModal = ({
  onClose,
  onSave,
  products = ['Avali', 'Pontua', 'Notifly', 'Trilho', 'Atende', 'Ledger'],
  responsibles = ['Joana V.', 'Ricardo L.', 'Marina P.', 'Tiago A.'],
}) => {
  const [form, setForm] = useStateMd({
    name: '',
    contact: '',
    tag: products[0],
    value: '',
    responsible: responsibles[0],
    note: '',
    stage: 'novo',
  });
  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.name.trim()) return;
    onSave(form);
  };

  return (
    <AdminModal
      title="Cadastrar novo lead"
      crumbs="/ crm / novo"
      onClose={onClose}
      footer={
        <>
          <button className="btn ghost sm" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn sm" onClick={submit}>
            Adicionar ao pipeline <Icon name="arrow" size={13} />
          </button>
        </>
      }
    >
      <div className="fld-group">
        <div className="fld-row">
          <div className="fld">
            <label>Nome da empresa / lead</label>
            <input
              value={form.name}
              onChange={(e) => upd('name', e.target.value)}
              placeholder="ex. Folha Sistemas"
              autoFocus
            />
          </div>
          <div className="fld">
            <label>Contato (e-mail ou telefone)</label>
            <input
              value={form.contact}
              onChange={(e) => upd('contact', e.target.value)}
              placeholder="leandro@folha.io"
            />
          </div>
        </div>
        <div className="fld-row">
          <div className="fld">
            <label>Produto de interesse</label>
            <select value={form.tag} onChange={(e) => upd('tag', e.target.value)}>
              {products.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="fld">
            <label>Valor estimado / mês</label>
            <input
              value={form.value}
              onChange={(e) => upd('value', e.target.value)}
              placeholder="R$ 24k/mo"
            />
          </div>
        </div>
        <div className="fld-row">
          <div className="fld">
            <label>Responsável</label>
            <select value={form.responsible} onChange={(e) => upd('responsible', e.target.value)}>
              {responsibles.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="fld">
            <label>Estágio inicial</label>
            <select value={form.stage} onChange={(e) => upd('stage', e.target.value)}>
              <option value="novo">Novo lead</option>
              <option value="qual">Qualificado</option>
              <option value="neg">Em negociação</option>
              <option value="fech">Fechado</option>
            </select>
          </div>
        </div>
        <div className="fld">
          <label>Primeira interação (opcional)</label>
          <textarea
            value={form.note}
            onChange={(e) => upd('note', e.target.value)}
            placeholder="Como você conheceu este lead? Pontos importantes da primeira conversa…"
          />
        </div>
        <div
          style={{
            display: 'flex',
            gap: 10,
            alignItems: 'center',
            padding: 12,
            background: 'var(--bg-soft)',
            borderRadius: 10,
            border: '1px solid var(--line)',
            fontSize: 12,
            color: 'var(--text-muted)',
          }}
        >
          <Icon name="users" size={14} style={{ color: 'var(--purple)', flexShrink: 0 }} />O lead
          aparecerá imediatamente no kanban e pode ser arrastado entre as colunas para mudar de
          estágio.
        </div>
      </div>
    </AdminModal>
  );
};

// ═══════════════════════════════════════════════════
// PRODUCTS — enhanced with DnD reordering + add/edit/delete
// ═══════════════════════════════════════════════════
const buildInitialProducts = () =>
  CrxData.products.map((p, i) => ({
    id: p.id,
    name: p.name,
    iconText: p.iconText,
    color: p.color,
    image: null,
    cat: { pt: p.cat.pt, en: p.cat.en },
    tagline: { pt: p.tagline.pt, en: p.tagline.en },
    description: { pt: p.lede?.pt || p.tagline.pt, en: p.lede?.en || p.tagline.en },
    audience: { pt: p.audience?.pt || '', en: p.audience?.en || '' },
    usedBy:
      i === 0
        ? 'NIVERA Tech, Folha Sistemas, Editora Versa'
        : i === 1
          ? 'Bons Negócios SA, NIVERA Tech'
          : i === 2
            ? 'Aletheia Group, Quantum Lab, Cluster Verde'
            : '',
    published: i < 4,
    updatedAt:
      ['há 2 dias', 'há 5 dias', 'há 1 dia', 'há 12 dias', 'há 22 dias', 'há 30 dias'][i] || '—',
  }));

const AdminProductsV2 = () => {
  const [items, setItems] = useStateMd(buildInitialProducts);
  const [editing, setEditing] = useStateMd(null);
  const [adding, setAdding] = useStateMd(false);
  const [deleting, setDeleting] = useStateMd(null);
  const [menuOpen, setMenuOpen] = useStateMd(null);
  const [dragId, setDragId] = useStateMd(null);
  const [dropTarget, setDropTarget] = useStateMd(null);
  const [search, setSearch] = useStateMd('');

  const filter = (p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.cat.pt.toLowerCase().includes(q) ||
      p.tagline.pt.toLowerCase().includes(q)
    );
  };

  const published = items.filter((p) => p.published).filter(filter);
  const unpublished = items.filter((p) => !p.published).filter(filter);

  const upsert = (p) => {
    setItems((prev) => {
      if (prev.find((x) => x.id === p.id)) {
        return prev.map((x) => (x.id === p.id ? p : x));
      }
      return [...prev, { ...p, id: p.id || `prod-${Date.now()}`, updatedAt: 'agora' }];
    });
    setEditing(null);
    setAdding(false);
  };

  const remove = (id) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
    setDeleting(null);
  };

  const togglePublish = (id) => {
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, published: !p.published, updatedAt: 'agora' } : p))
    );
    setMenuOpen(null);
  };

  // DnD only within published list
  const handleDragStart = (id) => setDragId(id);
  const handleDragOver = (e, targetId) => {
    if (!dragId || dragId === targetId) return;
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const after = e.clientY > rect.top + rect.height / 2;
    setDropTarget({ id: targetId, after });
  };
  const handleDragLeave = () => setDropTarget(null);
  const handleDrop = (e, targetId) => {
    e.preventDefault();
    if (!dragId || dragId === targetId) {
      setDragId(null);
      setDropTarget(null);
      return;
    }
    const after = dropTarget?.after;
    setItems((prev) => {
      const next = [...prev];
      const fromIdx = next.findIndex((p) => p.id === dragId);
      if (fromIdx < 0) return prev;
      const [moved] = next.splice(fromIdx, 1);
      const toIdx = next.findIndex((p) => p.id === targetId);
      next.splice(toIdx + (after ? 1 : 0), 0, moved);
      return next;
    });
    setDragId(null);
    setDropTarget(null);
  };
  const handleDragEnd = () => {
    setDragId(null);
    setDropTarget(null);
  };

  return (
    <>
      <AdminTopbar
        title="Produtos da vitrine"
        crumbs="/ vitrine / produtos"
        extra={
          <button className="btn sm" onClick={() => setAdding(true)}>
            + Novo produto
          </button>
        }
      />
      <div className="admin-content">
        <div className="panel" style={{ padding: 14 }}>
          <div className="panel-head" style={{ marginBottom: 4 }}>
            <h3>
              {items.length} produtos · {items.filter((x) => x.published).length} publicados
            </h3>
            <span className="grow" />
            <span className="pill">vitrine.crianex.com</span>
            <div className="admin-search" style={{ width: 220 }}>
              <Icon name="search" size={13} />
              <input
                placeholder="Buscar produto…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Published section */}
          <div className="list-divider">
            <span>✓ Publicados</span>
            <span className="ct">arraste para reordenar a vitrine</span>
            <span className="ln" />
            <span className="ct">{published.length}</span>
          </div>

          {published.length === 0 && <div className="empty">Nenhum produto publicado.</div>}

          {published.map((p) => (
            <div
              key={p.id}
              draggable
              onDragStart={() => handleDragStart(p.id)}
              onDragOver={(e) => handleDragOver(e, p.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, p.id)}
              onDragEnd={handleDragEnd}
              className={`product-row dnd-row ${dragId === p.id ? 'dragging' : ''} ${dropTarget?.id === p.id ? (dropTarget.after ? 'drop-after' : 'drop-before') : ''}`}
            >
              <span className="dnd-handle" title="arraste para reordenar">
                <Icon name="moreV" size={12} />
                <Icon name="moreV" size={12} style={{ marginLeft: -8 }} />
              </span>
              <span
                className="pico"
                style={{
                  background: p.color,
                  backgroundImage: p.image ? `url(${p.image})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {!p.image && p.iconText}
              </span>
              <div>
                <div className="pname">{p.name}</div>
                <div className="psub">{p.tagline.pt}</div>
              </div>
              <span className="pcat">{p.cat.pt}</span>
              <span>
                <span className="status-pill paid">
                  <span className="dt" />
                  publicado
                </span>
              </span>
              <span className="pdate">edit. {p.updatedAt}</span>
              <span className="mono" style={{ fontSize: 10.5, color: 'var(--text-faint)' }}>
                PT · EN
              </span>
              <div style={{ position: 'relative' }}>
                <button
                  className="menu-btn"
                  onClick={() => setMenuOpen(menuOpen === p.id ? null : p.id)}
                >
                  <Icon name="moreV" size={14} />
                </button>
                {menuOpen === p.id && (
                  <ProductRowMenu
                    p={p}
                    onClose={() => setMenuOpen(null)}
                    onEdit={() => {
                      setEditing(p);
                      setMenuOpen(null);
                    }}
                    onTogglePublish={() => togglePublish(p.id)}
                    onDelete={() => {
                      setDeleting(p);
                      setMenuOpen(null);
                    }}
                  />
                )}
              </div>
            </div>
          ))}

          {/* Unpublished */}
          <div className="list-divider">
            <span>○ Não publicados</span>
            <span className="ct">não aparecem na vitrine pública</span>
            <span className="ln" />
            <span className="ct">{unpublished.length}</span>
          </div>

          {unpublished.length === 0 && (
            <div className="empty">Todos os produtos estão publicados.</div>
          )}

          {unpublished.map((p) => (
            <div key={p.id} className="product-row unpub">
              <span />
              <span
                className="pico"
                style={{
                  background: p.color,
                  backgroundImage: p.image ? `url(${p.image})` : 'none',
                  backgroundSize: 'cover',
                }}
              >
                {!p.image && p.iconText}
              </span>
              <div>
                <div className="pname">{p.name}</div>
                <div className="psub">{p.tagline.pt}</div>
              </div>
              <span className="pcat">{p.cat.pt}</span>
              <span>
                <span className="status-pill inactive">
                  <span className="dt" />
                  rascunho
                </span>
              </span>
              <span className="pdate">edit. {p.updatedAt}</span>
              <span className="mono" style={{ fontSize: 10.5, color: 'var(--text-faint)' }}>
                PT · EN
              </span>
              <div style={{ position: 'relative' }}>
                <button
                  className="menu-btn"
                  onClick={() => setMenuOpen(menuOpen === p.id ? null : p.id)}
                >
                  <Icon name="moreV" size={14} />
                </button>
                {menuOpen === p.id && (
                  <ProductRowMenu
                    p={p}
                    onClose={() => setMenuOpen(null)}
                    onEdit={() => {
                      setEditing(p);
                      setMenuOpen(null);
                    }}
                    onTogglePublish={() => togglePublish(p.id)}
                    onDelete={() => {
                      setDeleting(p);
                      setMenuOpen(null);
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {(adding || editing) && (
        <ProductEditor
          product={editing}
          isNew={adding}
          onClose={() => {
            setEditing(null);
            setAdding(false);
          }}
          onSave={upsert}
        />
      )}

      {deleting && (
        <DeleteConfirm
          title="Excluir produto?"
          name={deleting.name}
          warning="Esta ação remove o produto da vitrine pública imediatamente e exclui suas informações localizadas (PT/EN). Não pode ser desfeita."
          onClose={() => setDeleting(null)}
          onConfirm={() => remove(deleting.id)}
        />
      )}
    </>
  );
};

const ProductRowMenu = ({ p, onClose, onEdit, onTogglePublish, onDelete }) => (
  <>
    <div style={{ position: 'fixed', inset: 0, zIndex: 30 }} onClick={onClose} />
    <div className="row-menu-pop">
      <button onClick={onEdit}>
        <Icon name="settings" size={13} /> Editar produto
      </button>
      <button onClick={onTogglePublish}>
        <Icon name={p.published ? 'x' : 'check'} size={13} />
        {p.published ? 'Despublicar' : 'Publicar agora'}
      </button>
      <div className="sep" />
      <button className="danger" onClick={onDelete}>
        <Icon name="x" size={13} /> Excluir
      </button>
    </div>
  </>
);

// Product editor modal — bilingual fields, image, status
const PRODUCT_COLORS = [
  '#7f3fe5',
  '#e71f84',
  '#66df7a',
  '#3b82f6',
  '#f59e0b',
  '#06b6d4',
  '#10b981',
  '#ef4444',
];

const ProductEditor = ({ product, isNew, onClose, onSave }) => {
  const [p, setP] = useStateMd(
    product || {
      id: null,
      name: '',
      iconText: '??',
      color: PRODUCT_COLORS[0],
      image: null,
      cat: { pt: '', en: '' },
      tagline: { pt: '', en: '' },
      description: { pt: '', en: '' },
      audience: { pt: '', en: '' },
      usedBy: '',
      published: false,
    }
  );

  const upd = (k, v) => setP((prev) => ({ ...prev, [k]: v }));
  const updI18n = (k, lang, v) => setP((prev) => ({ ...prev, [k]: { ...prev[k], [lang]: v } }));

  const handleSave = () => {
    const iconText =
      p.iconText && p.iconText !== '??' ? p.iconText : p.name.slice(0, 2).toUpperCase();
    onSave({ ...p, iconText });
  };

  return (
    <AdminModal
      title={isNew ? 'Cadastrar novo produto' : `Editar · ${p.name}`}
      crumbs="/ produtos / formulário"
      wide
      onClose={onClose}
      footer={
        <>
          <span
            className="mono"
            style={{
              fontSize: 10.5,
              color: 'var(--text-faint)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginRight: 'auto',
            }}
          >
            ⚠ versões PT e EN são gravadas separadamente
          </span>
          <button className="btn ghost sm" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn sm" onClick={handleSave}>
            {isNew ? 'Cadastrar produto' : 'Salvar alterações'} <Icon name="check" size={13} />
          </button>
        </>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 20 }}>
        {/* Left column: image + identity */}
        <div className="fld-group">
          <div className="fld">
            <label>Imagem / capa</label>
            <ImageDropzone
              image={p.image}
              onChange={(img) => upd('image', img)}
              fallback={p.iconText}
              color={p.color}
            />
          </div>
          <div className="fld">
            <label>Cor de marca</label>
            <div className="color-row" style={{ flexWrap: 'wrap' }}>
              {PRODUCT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`color-swatch ${p.color === c ? 'on' : ''}`}
                  style={{ background: c }}
                  onClick={() => upd('color', c)}
                />
              ))}
            </div>
          </div>
          <div className="fld">
            <label>Sigla (2 letras)</label>
            <input
              maxLength={3}
              value={p.iconText}
              onChange={(e) => upd('iconText', e.target.value.toUpperCase())}
              placeholder="AV"
            />
          </div>
        </div>

        {/* Right column: content */}
        <div className="fld-group">
          <div className="fld">
            <label>Nome do produto</label>
            <input
              value={p.name}
              onChange={(e) => upd('name', e.target.value)}
              placeholder="ex. Avali"
            />
          </div>

          <BilingualField
            label="Categoria"
            valuePT={p.cat.pt}
            valueEN={p.cat.en}
            onChangePT={(v) => updI18n('cat', 'pt', v)}
            onChangeEN={(v) => updI18n('cat', 'en', v)}
            placeholder={{ pt: 'ex. Gestão Educacional', en: 'ex. Education Management' }}
          />

          <BilingualField
            label="Tagline (1 linha)"
            valuePT={p.tagline.pt}
            valueEN={p.tagline.en}
            onChangePT={(v) => updI18n('tagline', 'pt', v)}
            onChangeEN={(v) => updI18n('tagline', 'en', v)}
            placeholder={{
              pt: 'Frase de impacto que descreve o produto',
              en: 'One-line product description',
            }}
          />

          <BilingualField
            label="Descrição completa"
            valuePT={p.description.pt}
            valueEN={p.description.en}
            onChangePT={(v) => updI18n('description', 'pt', v)}
            onChangeEN={(v) => updI18n('description', 'en', v)}
            multiline
            placeholder={{
              pt: 'Descreva o produto em 2-3 parágrafos…',
              en: 'Describe the product in 2-3 paragraphs…',
            }}
          />

          <BilingualField
            label="Público-alvo"
            valuePT={p.audience.pt}
            valueEN={p.audience.en}
            onChangePT={(v) => updI18n('audience', 'pt', v)}
            onChangeEN={(v) => updI18n('audience', 'en', v)}
            placeholder={{
              pt: 'ex. Redes de ensino, colégios particulares…',
              en: 'e.g. School networks, K-12…',
            }}
          />

          <div className="fld">
            <label>Quem está usando (clientes / logos)</label>
            <input
              value={p.usedBy}
              onChange={(e) => upd('usedBy', e.target.value)}
              placeholder="NIVERA Tech, Folha Sistemas, Editora Versa"
            />
          </div>

          {/* Status block */}
          <div
            style={{
              background: 'var(--bg-soft)',
              border: '1px solid var(--line)',
              borderRadius: 10,
              padding: 14,
            }}
          >
            <div
              className="mono"
              style={{
                fontSize: 10,
                color: 'var(--text-faint)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: 10,
              }}
            >
              Status de publicação
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                onClick={() => upd('published', true)}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: p.published ? '1.5px solid var(--green)' : '1px solid var(--line)',
                  background: p.published ? 'rgba(102,223,122,0.18)' : 'var(--bg)',
                  color: p.published ? 'var(--pos-deep)' : 'var(--text-muted)',
                  fontFamily: 'inherit',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  textAlign: 'left',
                }}
              >
                <Icon name="check" size={13} />
                <div style={{ flex: 1 }}>
                  <div>Publicado</div>
                  <div style={{ fontSize: 11, fontWeight: 400, marginTop: 2, opacity: 0.8 }}>
                    Visível na vitrine pública
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => upd('published', false)}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: !p.published ? '1.5px solid var(--text-muted)' : '1px solid var(--line)',
                  background: !p.published ? 'var(--bg-elev)' : 'var(--bg)',
                  color: !p.published ? 'var(--text)' : 'var(--text-muted)',
                  fontFamily: 'inherit',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  textAlign: 'left',
                }}
              >
                <Icon name="x" size={13} />
                <div style={{ flex: 1 }}>
                  <div>Rascunho</div>
                  <div style={{ fontSize: 11, fontWeight: 400, marginTop: 2, opacity: 0.8 }}>
                    Salvo, oculto do público
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminModal>
  );
};

// ═══════════════════════════════════════════════════
// FAQ — enhanced CRUD
// ═══════════════════════════════════════════════════
const buildInitialFAQs = () =>
  CrxData.faqs.map((f, i) => ({
    id: `faq-${i + 1}`,
    cat: f.cat,
    q: { pt: f.q.pt, en: f.q.en },
    a: { pt: f.a.pt, en: f.a.en },
    status: i === 4 ? 'draft' : 'published',
    views: 100 + Math.round(Math.random() * 900),
    helpfulPct: 60 + Math.round(Math.random() * 35),
    updatedAt: ['há 1 dia', 'há 3 dias', 'há 5 dias', 'há 8 dias', 'há 14 dias'][i % 5],
  }));

const FAQ_CATEGORIES = ['geral', 'avali', 'pontua', 'notifly', 'billing', 'security'];

const AdminFaqMgrV2 = () => {
  const [items, setItems] = useStateMd(buildInitialFAQs);
  const [editing, setEditing] = useStateMd(null);
  const [adding, setAdding] = useStateMd(false);
  const [deleting, setDeleting] = useStateMd(null);
  const [menuOpen, setMenuOpen] = useStateMd(null);
  const [search, setSearch] = useStateMd('');
  const [catFilter, setCatFilter] = useStateMd('all');

  const filtered = items
    .filter((i) => catFilter === 'all' || i.cat === catFilter)
    .filter((i) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return i.q.pt.toLowerCase().includes(q) || i.a.pt.toLowerCase().includes(q);
    });

  const published = filtered.filter((i) => i.status === 'published');
  const drafts = filtered.filter((i) => i.status === 'draft');

  const upsert = (f) => {
    setItems((prev) =>
      prev.find((p) => p.id === f.id)
        ? prev.map((p) => (p.id === f.id ? f : p))
        : [
            ...prev,
            { ...f, id: f.id || `faq-${Date.now()}`, updatedAt: 'agora', views: 0, helpfulPct: 0 },
          ]
    );
    setEditing(null);
    setAdding(false);
  };
  const remove = (id) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
    setDeleting(null);
  };
  const togglePublish = (id) => {
    setItems((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === 'published' ? 'draft' : 'published', updatedAt: 'agora' }
          : p
      )
    );
    setMenuOpen(null);
  };

  return (
    <>
      <AdminTopbar
        title="FAQ · artigos"
        crumbs="/ vitrine / faq"
        extra={
          <button className="btn sm" onClick={() => setAdding(true)}>
            + Novo artigo
          </button>
        }
      />
      <div className="admin-content">
        <div className="panel" style={{ padding: 14 }}>
          <div className="panel-head" style={{ marginBottom: 4 }}>
            <h3>
              {items.length} artigos · {published.length} publicados
            </h3>
            <span className="grow" />
            <div className="admin-search" style={{ width: 220 }}>
              <Icon name="search" size={13} />
              <input
                placeholder="Buscar pergunta…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
            <button
              className={`filter-chip ${catFilter === 'all' ? 'on' : ''}`}
              onClick={() => setCatFilter('all')}
            >
              todas{' '}
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, opacity: 0.7 }}>
                {items.length}
              </span>
            </button>
            {FAQ_CATEGORIES.map((c) => {
              const ct = items.filter((i) => i.cat === c).length;
              return (
                <button
                  key={c}
                  className={`filter-chip ${catFilter === c ? 'on' : ''}`}
                  onClick={() => setCatFilter(c)}
                >
                  {c}{' '}
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, opacity: 0.7 }}>
                    {ct}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="list-divider">
            <span>✓ Publicados</span>
            <span className="ln" />
            <span className="ct">{published.length}</span>
          </div>

          {published.length === 0 && (
            <div className="empty">Nenhum artigo publicado nesta categoria.</div>
          )}

          {published.map((item) => (
            <FaqRow
              key={item.id}
              item={item}
              menuOpen={menuOpen === item.id}
              onMenuToggle={() => setMenuOpen(menuOpen === item.id ? null : item.id)}
              onMenuClose={() => setMenuOpen(null)}
              onEdit={() => {
                setEditing(item);
                setMenuOpen(null);
              }}
              onTogglePublish={() => togglePublish(item.id)}
              onDelete={() => {
                setDeleting(item);
                setMenuOpen(null);
              }}
            />
          ))}

          <div className="list-divider">
            <span>○ Rascunhos</span>
            <span className="ln" />
            <span className="ct">{drafts.length}</span>
          </div>

          {drafts.length === 0 && <div className="empty">Nenhum rascunho.</div>}

          {drafts.map((item) => (
            <FaqRow
              key={item.id}
              item={item}
              menuOpen={menuOpen === item.id}
              onMenuToggle={() => setMenuOpen(menuOpen === item.id ? null : item.id)}
              onMenuClose={() => setMenuOpen(null)}
              onEdit={() => {
                setEditing(item);
                setMenuOpen(null);
              }}
              onTogglePublish={() => togglePublish(item.id)}
              onDelete={() => {
                setDeleting(item);
                setMenuOpen(null);
              }}
            />
          ))}
        </div>
      </div>

      {(adding || editing) && (
        <FaqEditor
          faq={editing}
          isNew={adding}
          onClose={() => {
            setEditing(null);
            setAdding(false);
          }}
          onSave={upsert}
        />
      )}

      {deleting && (
        <DeleteConfirm
          title="Excluir artigo?"
          name={deleting.q.pt}
          warning="O artigo será removido permanentemente do FAQ público. As avaliações e métricas de visualização também serão apagadas."
          onClose={() => setDeleting(null)}
          onConfirm={() => remove(deleting.id)}
        />
      )}
    </>
  );
};

const FaqRow = ({
  item,
  menuOpen,
  onMenuToggle,
  onMenuClose,
  onEdit,
  onTogglePublish,
  onDelete,
}) => (
  <div className={`faq-row ${item.status === 'draft' ? 'draft' : ''}`}>
    <span className="qmark">?</span>
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
      {item.cat}
    </span>
    <div style={{ minWidth: 0 }}>
      <div className="qtext">{item.q.pt}</div>
      <div className="qpreview">{item.a.pt}</div>
    </div>
    <span>
      <span className={`status-pill ${item.status === 'published' ? 'paid' : 'inactive'}`}>
        <span className="dt" />
        {item.status === 'published' ? 'publicado' : 'rascunho'}
      </span>
    </span>
    <span className="mono" style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'right' }}>
      {item.helpfulPct}% útil
    </span>
    <span
      className="mono"
      style={{ fontSize: 10.5, color: 'var(--text-faint)', textAlign: 'right' }}
    >
      {item.views} views
    </span>
    <div style={{ position: 'relative' }}>
      <button className="menu-btn" onClick={onMenuToggle}>
        <Icon name="moreV" size={14} />
      </button>
      {menuOpen && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 30 }} onClick={onMenuClose} />
          <div className="row-menu-pop">
            <button onClick={onEdit}>
              <Icon name="settings" size={13} /> Editar artigo
            </button>
            <button onClick={onTogglePublish}>
              <Icon name={item.status === 'published' ? 'x' : 'check'} size={13} />
              {item.status === 'published' ? 'Despublicar' : 'Publicar'}
            </button>
            <div className="sep" />
            <button className="danger" onClick={onDelete}>
              <Icon name="x" size={13} /> Excluir
            </button>
          </div>
        </>
      )}
    </div>
  </div>
);

const FaqEditor = ({ faq, isNew, onClose, onSave }) => {
  const [f, setF] = useStateMd(
    faq || {
      id: null,
      cat: FAQ_CATEGORIES[0],
      q: { pt: '', en: '' },
      a: { pt: '', en: '' },
      status: 'draft',
    }
  );
  const upd = (k, v) => setF((prev) => ({ ...prev, [k]: v }));
  const updI18n = (k, lang, v) => setF((prev) => ({ ...prev, [k]: { ...prev[k], [lang]: v } }));

  return (
    <AdminModal
      title={isNew ? 'Novo artigo de FAQ' : `Editar · ${f.q.pt || 'Artigo'}`}
      crumbs="/ faq / formulário"
      wide
      onClose={onClose}
      footer={
        <>
          <span
            className="mono"
            style={{
              fontSize: 10.5,
              color: 'var(--text-faint)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginRight: 'auto',
            }}
          >
            PT obrigatório · EN opcional
          </span>
          <button className="btn ghost sm" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn sm" onClick={() => onSave(f)}>
            {isNew ? 'Criar artigo' : 'Salvar alterações'} <Icon name="check" size={13} />
          </button>
        </>
      }
    >
      <div className="fld-group">
        <div className="fld-row">
          <div className="fld">
            <label>Categoria</label>
            <select value={f.cat} onChange={(e) => upd('cat', e.target.value)}>
              {FAQ_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="fld">
            <label>Status</label>
            <select value={f.status} onChange={(e) => upd('status', e.target.value)}>
              <option value="published">Publicado</option>
              <option value="draft">Rascunho</option>
            </select>
          </div>
        </div>

        <BilingualField
          label="Pergunta"
          valuePT={f.q.pt}
          valueEN={f.q.en}
          onChangePT={(v) => updI18n('q', 'pt', v)}
          onChangeEN={(v) => updI18n('q', 'en', v)}
          placeholder={{
            pt: 'Como funciona a contratação?',
            en: 'How does the subscription work?',
          }}
        />

        <BilingualField
          label="Resposta"
          valuePT={f.a.pt}
          valueEN={f.a.en}
          onChangePT={(v) => updI18n('a', 'pt', v)}
          onChangeEN={(v) => updI18n('a', 'en', v)}
          multiline
          placeholder={{ pt: 'Explique em 1-3 parágrafos…', en: 'Explain in 1-3 paragraphs…' }}
        />

        <div
          style={{
            background: 'var(--accent-soft)',
            border: '1px solid var(--accent-line)',
            borderRadius: 10,
            padding: 12,
            fontSize: 12.5,
            color: 'var(--text)',
            display: 'flex',
            gap: 10,
            alignItems: 'flex-start',
          }}
        >
          <Icon
            name="sparkle"
            size={14}
            style={{ flexShrink: 0, marginTop: 2, color: 'var(--purple)' }}
          />
          <div>
            <div style={{ fontWeight: 500, marginBottom: 2 }}>Dica</div>
            <div style={{ color: 'var(--text-muted)' }}>
              Mantenha respostas curtas e objetivas. Use markdown leve (negrito, listas) — está
              habilitado.
            </div>
          </div>
        </div>
      </div>
    </AdminModal>
  );
};

// ═══════════════════════════════════════════════════
// DELETE confirmation modal
// ═══════════════════════════════════════════════════
const DeleteConfirm = ({ title, name, warning, onClose, onConfirm }) => (
  <div className="admin-overlay" onClick={onClose}>
    <div className="admin-modal" style={{ maxWidth: 460 }} onClick={(e) => e.stopPropagation()}>
      <div className="admin-modal-body danger-modal">
        <div className="danger-icon">
          <Icon name="x" size={24} />
        </div>
        <h4>{title}</h4>
        <p>{warning}</p>
        <div className="name-confirm">
          <span className="lbl">Item:</span>
          <span className="val">{name}</span>
        </div>
      </div>
      <div className="admin-modal-foot">
        <button className="btn ghost sm" onClick={onClose}>
          Cancelar
        </button>
        <button className="btn-danger" onClick={onConfirm}>
          <Icon name="x" size={13} /> Excluir definitivamente
        </button>
      </div>
    </div>
  </div>
);

window.NotificationPanel = NotificationPanel;
window.NewLeadModal = NewLeadModal;
window.AdminProductsV2 = AdminProductsV2;
window.AdminFaqMgrV2 = AdminFaqMgrV2;
window.DeleteConfirm = DeleteConfirm;
window.BilingualField = BilingualField;
window.ImageDropzone = ImageDropzone;
