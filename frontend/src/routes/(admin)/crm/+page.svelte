<script lang="ts">
  import {
    LayoutDashboard, Layers, Settings, Download, Search,
    Users, Mail, Phone, Bell, FileText, Bot, Headphones,
    GitMerge, Check, X, MoreVertical, ArrowRight, Plus
  } from 'lucide-svelte';
  import { apiFetch } from '$lib/api/backend';
  import { onMount } from 'svelte';

  type CrmColumn = {
    id: string; title: string; color: string; position: number;
    is_default: boolean; entry_hint: string | null; exit_hint: string | null;
  };

  type Request = { id: string; product: string; value: number; plan: string; date: string; message: string; status: string; };
  type Interaction = { t: string; who: string; kind: 'note' | 'call' | 'email'; body: string; };
  type Lead = {
    id: string; name: string; company: string; role: string;
    email: string; phone: string; responsible: string;
    stage: string; source: string; createdAt: string; lastActivity: string;
    requests: Request[]; interactions: Interaction[];
  };

  const PRODUCTS = [
    { id: 'avali',   name: 'Avali',   color: '#7f3fe5' },
    { id: 'pontua',  name: 'Pontua',  color: '#e71f84' },
    { id: 'notifly', name: 'Notifly', color: '#66df7a' },
    { id: 'trilho',  name: 'Trilho',  color: '#3b82f6' },
    { id: 'atende',  name: 'Atende',  color: '#f59e0b' },
    { id: 'ledger',  name: 'Ledger',  color: '#06b6d4' },
  ];
  const PRODUCT_BY_ID = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));
  const RESPONSIBLES = ['Joana V.', 'Ricardo L.', 'Marina P.', 'Tiago A.'];
  const COL_COLORS = ['#7f3fe5','#e71f84','#66df7a','#3b82f6','#f59e0b','#06b6d4','#ec4899','#9a968e'];

  const SEED_LEADS: Lead[] = [
    { id:'l1', name:'Carla Mendes', company:'NIVERA Tech', role:'Head de RH', email:'carla@nivera.com', phone:'+55 11 98421-0042', responsible:'Joana V.', stage:'novo', source:'Formulário público', createdAt:'2026-06-12', lastActivity:'há 2h',
      requests:[{id:'r1a',product:'pontua',value:18000,plan:'Pro · mensal',date:'12 jun',message:'Quer rever o programa de incentivos do time comercial.',status:'novo'},{id:'r1b',product:'notifly',value:6000,plan:'Starter · mensal',date:'13 jun',message:'Avaliando disparo de notificações para vendedores.',status:'novo'}],
      interactions:[{t:'hoje · 09:14',who:'Joana V.',kind:'note',body:'Contato inicial via LinkedIn. RH quer rever programa de incentivos.'},{t:'ontem · 17:42',who:'Sistema',kind:'email',body:'Lead capturado via formulário público — produto: Pontua.'}] },
    { id:'l2', name:'Leandro Prado', company:'Folha Sistemas', role:'CTO', email:'leandro@folha.io', phone:'+55 21 99654-1180', responsible:'Ricardo L.', stage:'novo', source:'Indicação', createdAt:'2026-06-14', lastActivity:'há 5h',
      requests:[{id:'r2a',product:'avali',value:42000,plan:'Enterprise · mensal',date:'14 jun',message:'POC com 800 alunos antes de assinar.',status:'novo'}],
      interactions:[{t:'hoje · 11:30',who:'Ricardo L.',kind:'call',body:'Call com CTO. Eles querem POC com 800 alunos antes de assinar.'}] },
    { id:'l3', name:'Diretoria', company:'Editora Versa', role:'Diretoria', email:'diretoria@versa.com.br', phone:'+55 11 3344-1290', responsible:'—', stage:'novo', source:'Formulário público', createdAt:'2026-06-15', lastActivity:'há 1d',
      requests:[{id:'r3a',product:'avali',value:0,plan:'A definir',date:'15 jun',message:'Pediram material sobre correção por IA.',status:'novo'}],
      interactions:[] },
    { id:'l4', name:'Ana Tavares', company:'Quantum Lab', role:'Product Lead', email:'ana@quantum.app', phone:'+55 11 97712-3380', responsible:'Joana V.', stage:'qual', source:'Evento', createdAt:'2026-06-08', lastActivity:'há 3d',
      requests:[{id:'r4a',product:'notifly',value:9000,plan:'Pro · mensal',date:'08 jun',message:'Aprovado tecnicamente, aguardando aprovação financeira.',status:'qualificado'}],
      interactions:[{t:'anteontem · 14:00',who:'Joana V.',kind:'call',body:'Demo de 45min. Aprovaram tecnicamente. Aguardando aprovação financeira interna.'}] },
    { id:'l5', name:'Compras', company:'RedeFort Educação', role:'Setor de Compras', email:'compras@redefort.com.br', phone:'+55 31 98220-4471', responsible:'Ricardo L.', stage:'qual', source:'Formulário público', createdAt:'2026-06-05', lastActivity:'há 3d',
      requests:[{id:'r5a',product:'avali',value:58000,plan:'Enterprise · mensal',date:'05 jun',message:'Proposta enviada, diretoria revisa quinta.',status:'qualificado'},{id:'r5b',product:'trilho',value:12000,plan:'Pro · mensal',date:'07 jun',message:'Interesse adicional em trilhas de onboarding de professores.',status:'novo'}],
      interactions:[{t:'há 3 dias',who:'Ricardo L.',kind:'note',body:'Proposta enviada. Diretoria revisa na próxima quinta.'}] },
    { id:'l6', name:'Roberto Diniz', company:'Aletheia Group', role:'Diretor de Operações', email:'diretor@aletheia.co', phone:'+55 11 96541-8890', responsible:'Joana V.', stage:'neg', source:'Indicação', createdAt:'2026-05-28', lastActivity:'há 1d',
      requests:[{id:'r6a',product:'notifly',value:24000,plan:'Enterprise · mensal',date:'28 mai',message:'Negociando volume de mensagens e SLA.',status:'negociacao'}],
      interactions:[{t:'há 1 dia',who:'Joana V.',kind:'email',body:'Enviada revisão de proposta com desconto por volume anual.'}] },
    { id:'l7', name:'Tiago Rocha', company:'Praxis Soluções', role:'Founder', email:'tiago@praxis.tech', phone:'+55 47 99135-2204', responsible:'Ricardo L.', stage:'neg', source:'Formulário público', createdAt:'2026-06-01', lastActivity:'há 6h',
      requests:[{id:'r7a',product:'pontua',value:16000,plan:'Pro · mensal',date:'01 jun',message:'Quer fechar até o fim do mês.',status:'negociacao'}],
      interactions:[] },
    { id:'l8', name:'RH Corporativo', company:'ICE Educação', role:'RH', email:'rh@ice.org.br', phone:'+55 85 98876-0021', responsible:'Joana V.', stage:'neg', source:'Formulário público', createdAt:'2026-05-20', lastActivity:'há 12d',
      requests:[{id:'r8a',product:'avali',value:88000,plan:'Enterprise · anual',date:'20 mai',message:'Maior conta do trimestre. Jurídico revisando contrato.',status:'negociacao'},{id:'r8b',product:'atende',value:14000,plan:'Pro · mensal',date:'22 mai',message:'Quer pacote com help-desk integrado.',status:'qualificado'},{id:'r8c',product:'ledger',value:9000,plan:'Starter · mensal',date:'24 mai',message:'Avaliando faturamento recorrente das unidades.',status:'novo'}],
      interactions:[{t:'há 12 dias',who:'Joana V.',kind:'note',body:'Jurídico do cliente revisando contrato master. Sem resposta há quase 2 semanas — acompanhar.'}] },
    { id:'l9', name:'TI', company:'Cluster Verde', role:'Infra', email:'ti@cluster.com', phone:'+55 11 95523-7788', responsible:'Ricardo L.', stage:'fech', source:'Indicação', createdAt:'2026-05-02', lastActivity:'há 4d',
      requests:[{id:'r9a',product:'notifly',value:12000,plan:'Pro · mensal',date:'02 mai',message:'Contrato assinado, em onboarding.',status:'fechado'}],
      interactions:[{t:'há 4 dias',who:'Sistema',kind:'email',body:'Contrato assinado. Provisionamento de tenant iniciado.'}] },
    { id:'l10', name:'Patrícia Lemos', company:'Bons Negócios SA', role:'CIO', email:'cio@bn.com.br', phone:'+55 11 94410-9087', responsible:'Joana V.', stage:'fech', source:'Formulário público', createdAt:'2026-04-18', lastActivity:'há 1d',
      requests:[{id:'r10a',product:'pontua',value:28000,plan:'Enterprise · mensal',date:'18 abr',message:'Cliente ativo, expandindo para 3 filiais.',status:'fechado'},{id:'r10b',product:'atende',value:11000,plan:'Pro · mensal',date:'10 mai',message:'Upsell de suporte aprovado.',status:'fechado'}],
      interactions:[{t:'há 1 dia',who:'Joana V.',kind:'call',body:'Renovação confirmada + upsell de Atende para o time de suporte.'}] },
    { id:'l11', name:'Marcos Vaz', company:'Lumen Edu', role:'Coordenador', email:'marcos@lumenedu.com', phone:'+55 62 99201-3345', responsible:'Marina P.', stage:'perd', source:'Formulário público', createdAt:'2026-04-30', lastActivity:'há 22d',
      requests:[{id:'r11a',product:'avali',value:22000,plan:'Pro · mensal',date:'30 abr',message:'Optou por concorrente por questão de preço.',status:'perdido'}],
      interactions:[{t:'há 22 dias',who:'Marina P.',kind:'note',body:'Perdido para concorrente. Reavaliar em Q4 — orçamento pode mudar.'}] },
    { id:'l12', name:'Juliana Reis', company:'Cortex Saúde', role:'Gerente de Produto', email:'juliana@cortexsaude.com', phone:'+55 11 93388-1102', responsible:'Tiago A.', stage:'novo', source:'Formulário público', createdAt:'2026-06-16', lastActivity:'há 30min',
      requests:[{id:'r12a',product:'notifly',value:15000,plan:'Pro · mensal',date:'16 jun',message:'Disparos transacionais para app de telemedicina.',status:'novo'}],
      interactions:[] },
  ];

  // ── helpers ──
  function fmtBRL(n: number) {
    if (!n) return '—';
    if (n >= 1000) return 'R$ ' + (n / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + 'k';
    return 'R$ ' + n.toLocaleString('pt-BR');
  }
  function leadValue(lead: Lead, productId?: string | null) {
    return lead.requests.filter(r => !productId || r.product === productId).reduce((s, r) => s + (r.value || 0), 0);
  }
  function leadProducts(lead: Lead) { return [...new Set(lead.requests.map(r => r.product))]; }
  function initials(name: string) { return name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase(); }
  function phoneDigits(phone: string) { return (phone || '').replace(/\D/g, ''); }
  function waLink(lead: Lead) {
    const text = encodeURIComponent(`Olá ${lead.name}, aqui é da Crianex. Tudo bem?`);
    return `https://wa.me/${phoneDigits(lead.phone)}?text=${text}`;
  }
  function mailLink(lead: Lead) {
    return `mailto:${lead.email}?subject=${encodeURIComponent('Crianex — sobre sua solicitação')}&body=${encodeURIComponent(`Olá ${lead.name},\n\n`)}`;
  }
  function findDuplicates(leads: Lead[]) {
    const byCompany: Record<string, Lead[]> = {};
    leads.forEach(l => { const k = l.company.trim().toLowerCase(); (byCompany[k] = byCompany[k] || []).push(l); });
    return Object.values(byCompany).filter(g => g.length > 1);
  }
  function toCSV(rows: (Lead & { _colTitle?: string })[]) {
    const head = ['Empresa','Contato','Cargo','Email','Telefone','Estágio','Responsável','Origem','Produto','Plano','Valor/mês (R$)','Status do pedido','Data','Criado em'];
    const lines = [head];
    rows.forEach(lead => {
      (lead.requests.length ? lead.requests : [{}] as unknown as Request[]).forEach(r => {
        lines.push([lead.company,lead.name,lead.role||'',lead.email,lead.phone,lead._colTitle||lead.stage,lead.responsible,lead.source,r.product?PRODUCT_BY_ID[r.product]?.name||'':'',r.plan||'',String(r.value||0),r.status||'',r.date||'',lead.createdAt||'']);
      });
    });
    return lines.map(r => r.map(c => { const s = String(c ?? ''); return /[",\n;]/.test(s) ? `"${s.replace(/"/g,'""')}"` : s; }).join(';')).join('\n');
  }
  function download(filename: string, text: string) {
    const blob = new Blob(['﻿' + text], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // ── Props from server load ──
  let { data } = $props<{ data: { columns: CrmColumn[]; error?: string; forbidden?: boolean } }>();

  // ── State ──
  let columns = $state<CrmColumn[]>([]);
  let leads = $state<Lead[]>([...SEED_LEADS]);
  let view = $state<'kanban' | 'table'>('kanban');
  let productFilter = $state('all');
  let respFilter = $state('all');
  let search = $state('');
  let activeLeadId = $state<string | null>(null);
  let editingCols = $state(false);
  let addingLead = $state<string | null>(null);
  let dupeDismissed = $state(false);
  let colsLoading = $state(false);
  let colsError = $state('');

  // Drawer interaction state
  let interactionKind = $state<'note' | 'call' | 'email'>('note');
  let interactionBody = $state('');

  // Column editor state
  let editCols = $state<(CrmColumn & { _new?: boolean; _deleted?: boolean })[]>([]);
  let colDragId = $state<string | null>(null);
  let colDropTarget = $state<{ id: string; after: boolean } | null>(null);
  let colSaving = $state(false);

  // New lead form state
  let newLead = $state({ company:'', name:'', role:'', email:'', phone:'', product:PRODUCTS[0].id, value:'', plan:'Pro · mensal', message:'', responsible:RESPONSIBLES[0], source:'Cadastro manual', stage:'' });

  // Kanban drag state
  let dragLeadId = $state<string | null>(null);
  let dropColId = $state<string | null>(null);

  // Table sort state
  let sortKey = $state('lastActivity');
  let sortDir = $state(1);

  // Table expand state
  let tableExpanded = $state<Record<string, boolean>>({});

  $effect(() => {
    if (data.columns?.length) {
      columns = [...data.columns].sort((a, b) => a.position - b.position);
    }
  });

  // ── Derived ──
  const filtered = $derived(leads.filter(l => {
    if (productFilter !== 'all' && !l.requests.some(r => r.product === productFilter)) return false;
    if (respFilter !== 'all' && l.responsible !== respFilter) return false;
    const q = search.trim().toLowerCase();
    if (q && !`${l.company} ${l.name} ${l.email} ${l.role}`.toLowerCase().includes(q)) return false;
    return true;
  }));

  const stats = $derived(() => {
    const openIds = columns.filter(c => !/fech|perd/.test(c.id)).map(c => c.id);
    const wonId = columns.find(c => /fech/.test(c.id))?.id;
    const pf = productFilter !== 'all' ? productFilter : null;
    let open = 0, won = 0;
    filtered.forEach(l => {
      const v = leadValue(l, pf);
      if (l.stage === wonId) won += v;
      else if (openIds.includes(l.stage)) open += v;
    });
    return { count: filtered.length, open, won };
  });

  const dupes = $derived(findDuplicates(leads));
  const activeLead = $derived(activeLeadId ? leads.find(l => l.id === activeLeadId) ?? null : null);
  const activeCol = $derived(activeLead ? columns.find(c => c.id === activeLead.stage) ?? null : null);

  const sortedLeads = $derived(() => {
    const val = (l: Lead): string | number => {
      switch (sortKey) {
        case 'company': return l.company.toLowerCase();
        case 'value': return leadValue(l, productFilter !== 'all' ? productFilter : null);
        case 'pedidos': return l.requests.length;
        case 'stage': return columns.findIndex(c => c.id === l.stage);
        case 'responsible': return l.responsible;
        default: return l.createdAt || '';
      }
    };
    return [...filtered].sort((a, b) => {
      const va = val(a), vb = val(b);
      if (va < vb) return -sortDir;
      if (va > vb) return sortDir;
      return 0;
    });
  });

  // ── Actions ──
  function moveLead(id: string, stage: string) {
    leads = leads.map(l => l.id === id ? { ...l, stage, lastActivity: 'agora' } : l);
  }
  function updateLead(id: string, patch: Partial<Lead>) {
    leads = leads.map(l => l.id === id ? { ...l, ...patch } : l);
  }
  function addInteraction() {
    if (!interactionBody.trim() || !activeLead) return;
    updateLead(activeLead.id, {
      lastActivity: 'agora',
      interactions: [{ t: 'agora', who: activeLead.responsible || 'Você', kind: interactionKind, body: interactionBody.trim() }, ...activeLead.interactions],
    });
    interactionBody = ''; interactionKind = 'note';
  }
  function doAddLead() {
    if (!newLead.company.trim()) return;
    const value = parseInt(String(newLead.value).replace(/\D/g, '')) || 0;
    const id = `lead-${Date.now()}`;
    const stage = newLead.stage || columns[0]?.id || 'novo';
    leads = [{ ...newLead, id, stage, value: undefined as unknown as number, createdAt: new Date().toISOString().slice(0, 10), lastActivity: 'agora',
      requests: [{ id: `r-${Date.now()}`, product: newLead.product, value, plan: newLead.plan, date: 'hoje', message: newLead.message || '—', status: 'novo' }],
      interactions: newLead.message ? [{ t: 'agora', who: newLead.responsible, kind: 'note', body: newLead.message }] : [],
    }, ...leads];
    addingLead = null;
    activeLeadId = id;
    newLead = { company:'', name:'', role:'', email:'', phone:'', product:PRODUCTS[0].id, value:'', plan:'Pro · mensal', message:'', responsible:RESPONSIBLES[0], source:'Cadastro manual', stage:'' };
  }

  function exportCSV() {
    const withTitles = filtered.map(l => ({ ...l, _colTitle: columns.find(c => c.id === l.stage)?.title }));
    const label = productFilter === 'all' ? 'geral' : productFilter;
    download(`crianex-crm-${label}-${new Date().toISOString().slice(0,10)}.csv`, toCSV(withTitles));
  }

  // ── Column editor ──
  function openEditor() {
    editCols = columns.map(c => ({ ...c }));
    editingCols = true;
  }
  function editorUpd(id: string, patch: Partial<CrmColumn>) {
    editCols = editCols.map(c => c.id === id ? { ...c, ...patch } : c);
  }
  function editorAdd() {
    editCols = [...editCols, { id: `col-${Date.now()}`, title: 'Nova coluna', color: COL_COLORS[editCols.length % COL_COLORS.length], position: editCols.length, is_default: false, entry_hint: '', exit_hint: '', created_at: '', updated_at: '', _new: true }];
  }
  function editorDel(id: string) {
    if (editCols.length <= 1) return;
    const col = editCols.find(c => c.id === id);
    if (col?.is_default) return; // can't delete default
    editCols = editCols.filter(c => c.id !== id);
  }
  function editorDrop(targetId: string) {
    if (!colDragId || colDragId === targetId) { colDragId = null; colDropTarget = null; return; }
    const next = [...editCols];
    const from = next.findIndex(c => c.id === colDragId);
    const [moved] = next.splice(from, 1);
    let to = next.findIndex(c => c.id === targetId);
    if (colDropTarget?.after) to += 1;
    next.splice(to, 0, moved);
    editCols = next; colDragId = null; colDropTarget = null;
  }

  async function saveColumns() {
    colSaving = true; colsError = '';
    try {
      const originalIds = new Set(columns.map(c => c.id));
      const newIds = new Set(editCols.map(c => c.id));

      // Delete removed columns
      const toDelete = columns.filter(c => !newIds.has(c.id));
      for (const col of toDelete) {
        const res = await apiFetch<void>(`/admin/crm/columns/${col.id}`, { method: 'DELETE' });
        void res;
      }

      // Create new columns and update existing
      const saved: CrmColumn[] = [];
      for (let i = 0; i < editCols.length; i++) {
        const col = editCols[i]!;
        const pos = i;
        if (!originalIds.has(col.id)) {
          const created = await apiFetch<CrmColumn>('/admin/crm/columns', { method: 'POST', body: JSON.stringify({ title: col.title, color: col.color, position: pos, entry_hint: col.entry_hint, exit_hint: col.exit_hint }) });
          saved.push(created);
        } else {
          const orig = columns.find(c => c.id === col.id)!;
          const changed = col.title !== orig.title || col.color !== orig.color || col.entry_hint !== orig.entry_hint || col.exit_hint !== orig.exit_hint || pos !== orig.position;
          if (changed) {
            const updated = await apiFetch<CrmColumn>(`/admin/crm/columns/${col.id}`, { method: 'PATCH', body: JSON.stringify({ title: col.title, color: col.color, position: pos, entry_hint: col.entry_hint, exit_hint: col.exit_hint }) });
            saved.push(updated);
          } else {
            saved.push({ ...col, position: pos });
          }
        }
      }

      // Reassign leads whose column was deleted
      const savedIds = new Set(saved.map(c => c.id));
      const fallback = saved[0]?.id;
      if (fallback) leads = leads.map(l => savedIds.has(l.stage) ? l : { ...l, stage: fallback });

      columns = saved.sort((a, b) => a.position - b.position);
      editingCols = false;
    } catch (err) {
      const e = err as { status?: number; message?: string };
      if (e.status === 409) {
        colsError = e.message || 'Não foi possível remover uma coluna com leads. Mova os leads primeiro.';
      } else {
        colsError = e.message || 'Erro ao salvar colunas.';
      }
    } finally {
      colSaving = false;
    }
  }

  // Reload columns from backend on mount to stay fresh
  onMount(async () => {
    try {
      colsLoading = true;
      const fresh = await apiFetch<CrmColumn[]>('/admin/crm/columns');
      if (fresh?.length) columns = fresh.sort((a, b) => a.position - b.position);
    } catch { /* keep server-loaded data */ } finally {
      colsLoading = false;
    }
  });
</script>

<div class="crm-root">
  <!-- ── Header ── -->
  <div class="crm-head">
    <div class="crm-brand">
      <svg viewBox="0 0 90 80" width="18" height="16" aria-hidden="true">
        <polygon fill="#E71F84" points="5,5 33,5 45,37 17,37"/>
        <polygon fill="#66DF7A" points="57,5 85,5 73,37 45,37"/>
        <polygon fill="#FCFCFC" points="17,43 45,43 33,75 5,75"/>
        <polygon fill="#7F3FE5" points="45,43 73,43 85,75 57,75"/>
      </svg>
      <span>Crianex CRM</span>
    </div>
    <span class="crm-crumb">/ comercial / pipeline de leads</span>
    <span class="grow"></span>
    <div class="crm-seg">
      <button class={view === 'kanban' ? 'on' : ''} onclick={() => view = 'kanban'}>
        <LayoutDashboard size={13}/> Pipeline
      </button>
      <button class={view === 'table' ? 'on' : ''} onclick={() => view = 'table'}>
        <Layers size={13}/> Tabela
      </button>
    </div>
    <button class="btn ghost sm" onclick={openEditor}><Settings size={13}/> Colunas</button>
    <button class="btn ghost sm" onclick={exportCSV}><Download size={13}/> CSV</button>
    <button class="btn sm" onclick={() => { newLead.stage = columns[0]?.id || ''; addingLead = columns[0]?.id || 'novo'; }}>
      <Plus size={13}/> Novo lead
    </button>
  </div>

  <!-- ── Filter bar ── -->
  <div class="crm-bar">
    <span class="label-mono">Produto</span>
    <button class="crm-prodchip {productFilter === 'all' ? 'on' : ''}"
      style={productFilter === 'all' ? 'background:var(--text);color:var(--bg)' : ''}
      onclick={() => productFilter = 'all'}>
      Geral <span class="ct">{leads.length}</span>
    </button>
    {#each PRODUCTS as p}
      {@const ct = leads.filter(l => l.requests.some(r => r.product === p.id)).length}
      {@const on = productFilter === p.id}
      <button class="crm-prodchip {on ? 'on' : ''}"
        style={on ? `background:${p.color}22;border-color:${p.color};color:${p.color}` : ''}
        onclick={() => productFilter = p.id}>
        <span class="swatch" style="background:{p.color}"></span>{p.name} <span class="ct">{ct}</span>
      </button>
    {/each}
    <span class="vline"></span>
    <select class="crm-select" bind:value={respFilter}>
      <option value="all">Todos os responsáveis</option>
      {#each RESPONSIBLES as r}<option value={r}>{r}</option>{/each}
    </select>
    <span class="grow"></span>
    <div class="crm-search">
      <Search size={13}/>
      <input placeholder="Buscar empresa, pessoa, e-mail…" bind:value={search}/>
    </div>
  </div>

  <!-- ── Stats ── -->
  <div class="crm-stats">
    <div class="stat"><div class="k">Leads {productFilter !== 'all' ? '· ' + PRODUCT_BY_ID[productFilter]?.name : 'no filtro'}</div><div class="v">{stats().count}</div></div>
    <div class="stat"><div class="k">Pipeline em aberto</div><div class="v">{fmtBRL(stats().open)}<small>/mo</small></div></div>
    <div class="stat"><div class="k">Fechado (recorrente)</div><div class="v" style="color:var(--green)">{fmtBRL(stats().won)}<small>/mo</small></div></div>
    <div class="stat"><div class="k">Colunas no pipeline</div><div class="v">{columns.length}</div></div>
  </div>

  <!-- ── Duplicate banner ── -->
  {#if dupes.length > 0 && !dupeDismissed}
    <div class="crm-dupe-banner">
      <span class="dot"></span>
      <span><b>{dupes.length}</b> empresa(s) com cadastros possivelmente duplicados — abra o lead para revisar e unificar os pedidos em um só card.</span>
      <button onclick={() => dupeDismissed = true}>Dispensar</button>
    </div>
  {/if}

  <!-- ── Body ── -->
  <div class="crm-body">
    {#if view === 'kanban'}
      <!-- Kanban -->
      <div class="crm-kanban">
        {#each columns as col (col.id)}
          {@const cards = filtered.filter(l => l.stage === col.id)}
          {@const total = cards.reduce((s, l) => s + leadValue(l, productFilter !== 'all' ? productFilter : null), 0)}
          <div class="crm-col {dropColId === col.id ? 'drop-active' : ''}"
            role="region" aria-label={col.title}
            ondragover={(e) => { if (dragLeadId) { e.preventDefault(); dropColId = col.id; } }}
            ondragleave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) dropColId = null; }}
            ondrop={(e) => { e.preventDefault(); if (dragLeadId) moveLead(dragLeadId, col.id); dragLeadId = null; dropColId = null; }}>
            <div class="crm-col-head">
              <span class="dot" style="background:{col.color}"></span>
              <span class="title">{col.title}</span>
              <span class="ct">{cards.length}</span>
              <button class="gear" title="Editar colunas" onclick={openEditor}><Settings size={12}/></button>
            </div>
            <div class="crm-col-total">
              <span>pipeline</span>
              <b>{fmtBRL(total)}{total ? '/mo' : ''}</b>
            </div>
            {#each cards as lead (lead.id)}
              {@const prods = leadProducts(lead)}
              {@const val = leadValue(lead, productFilter !== 'all' ? productFilter : null)}
              {@const stale = /\d+d/.test(lead.lastActivity) && parseInt(lead.lastActivity) >= 7}
              <div class="crm-card {dragLeadId === lead.id ? 'dragging' : ''}"
                draggable="true"
                ondragstart={(e) => { dragLeadId = lead.id; if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'; }}
                ondragend={() => { dragLeadId = null; dropColId = null; }}
                role="button" tabindex="0"
                onclick={() => activeLeadId = lead.id}
                onkeydown={(e) => e.key === 'Enter' && (activeLeadId = lead.id)}>
                <div class="top">
                  <span class="crm-avatar" style="background:{col.color}">{initials(lead.company)}</span>
                  <div class="who">
                    <div class="company">{lead.company}</div>
                    <div class="person">{lead.name}{lead.role ? ` · ${lead.role}` : ''}</div>
                  </div>
                </div>
                <div class="crm-prods">
                  {#each prods as pid}
                    {@const p = PRODUCT_BY_ID[pid]}
                    {#if p}
                      {@const cnt = lead.requests.filter(r => r.product === pid).length}
                      <span class="crm-prodtag" style="background:{p.color}22;color:{p.color}">
                        <span class="d" style="background:{p.color}"></span>{p.name}{cnt > 1 ? ` ×${cnt}` : ''}
                      </span>
                    {/if}
                  {/each}
                </div>
                <div class="meta-row">
                  <span class="crm-pedidos">
                    {#if lead.requests.length > 1}
                      <span class="badge">{lead.requests.length} pedidos</span>
                    {:else}
                      <FileText size={10}/> 1 pedido
                    {/if}
                  </span>
                  <span class="val">{fmtBRL(val)}{val ? <span style="color:var(--text-faint);font-weight:400">/mo</span> : ''}</span>
                </div>
                <div class="meta-row" style="border-top:0;padding-top:0">
                  <span class="respo">
                    {#if stale}<span class="agewarn" title="Sem interação recente"><Bell size={9}/> </span>{/if}
                    {lead.responsible} · {lead.lastActivity}
                  </span>
                  <div class="crm-actions" onclick={(e) => e.stopPropagation()} role="presentation">
                    <a class="crm-iconbtn wa" href={waLink(lead)} target="_blank" rel="noopener" title="WhatsApp">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    </a>
                    <a class="crm-iconbtn mail" href={mailLink(lead)} title="E-mail"><Mail size={12}/></a>
                  </div>
                </div>
              </div>
            {/each}
            <button class="crm-addcard" onclick={() => { newLead.stage = col.id; addingLead = col.id; }}>+ adicionar lead</button>
          </div>
        {/each}
        <button class="crm-addcol" onclick={openEditor} title="Nova coluna">+ COLUNA</button>
      </div>
    {:else}
      <!-- Table -->
      <div class="crm-table-wrap">
        <table class="crm-table">
          <thead>
            <tr>
              <th class="no-sort" style="width:30px"></th>
              {#each [['company','Empresa · contato'],['pedidos','Pedidos'],['value','Valor / mês'],['stage','Estágio'],['responsible','Responsável'],['lastActivity','Atividade']] as [key, label]}
                <th class={sortKey === key ? 'sorted' : ''} style={key==='pedidos'?'text-align:center':key==='value'?'text-align:right':''}
                  onclick={() => { if (sortKey === key) sortDir = -sortDir; else { sortKey = key; sortDir = 1; } }}>
                  {label}<span class="sortcaret">{sortKey === key ? (sortDir > 0 ? '▲' : '▼') : '▲'}</span>
                </th>
              {/each}
              <th class="no-sort">Produtos</th>
              <th class="no-sort" style="text-align:right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {#each sortedLeads() as l (l.id)}
              {@const open = tableExpanded[l.id]}
              {@const val = leadValue(l, productFilter !== 'all' ? productFilter : null)}
              {@const col = columns.find(c => c.id === l.stage)}
              <tr class="lead-row" onclick={() => activeLeadId = l.id}>
                <td onclick={(e) => { e.stopPropagation(); tableExpanded = { ...tableExpanded, [l.id]: !tableExpanded[l.id] }; }}>
                  {#if l.requests.length > 1}
                    <button class="crm-texpand {open ? 'open' : ''}"><ArrowRight size={12}/></button>
                  {/if}
                </td>
                <td>
                  <div class="crm-tname">{l.company}</div>
                  <div class="crm-tsub">{l.name} · {l.email}</div>
                </td>
                <td style="text-align:center;font-family:var(--font-mono);font-size:12px">{l.requests.length}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-weight:600">{fmtBRL(val)}</td>
                <td><span class="crm-tstage"><span class="d" style="background:{col?.color || '#9a968e'}"></span>{col?.title || l.stage}</span></td>
                <td style="font-size:12.5px;color:var(--text-muted)">{l.responsible}</td>
                <td class="crm-tsub" style="font-size:11.5px">{l.lastActivity}</td>
                <td>
                  <div class="crm-prods">
                    {#each leadProducts(l) as pid}
                      {@const p = PRODUCT_BY_ID[pid]}
                      {#if p}
                        {@const cnt = l.requests.filter(r => r.product === pid).length}
                        <span class="crm-prodtag" style="background:{p.color}22;color:{p.color}">
                          <span class="d" style="background:{p.color}"></span>{p.name}{cnt > 1 ? ` ×${cnt}` : ''}
                        </span>
                      {/if}
                    {/each}
                  </div>
                </td>
                <td>
                  <div class="col-actions" style="justify-content:flex-end">
                    <a class="crm-iconbtn wa" href={waLink(l)} target="_blank" rel="noopener" onclick={(e) => e.stopPropagation()} title="WhatsApp">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    </a>
                    <a class="crm-iconbtn mail" href={mailLink(l)} onclick={(e) => e.stopPropagation()} title="E-mail"><Mail size={11}/></a>
                  </div>
                </td>
              </tr>
              {#if open && l.requests.length > 1}
                <tr class="crm-subrow">
                  <td colspan="9">
                    <div class="inner">
                      {#each l.requests as r}
                        {@const p = PRODUCT_BY_ID[r.product]}
                        <div class="crm-pedido-line">
                          {#if p}<span class="crm-prodtag" style="background:{p.color}22;color:{p.color}"><span class="d" style="background:{p.color}"></span>{p.name}</span>{/if}
                          <span class="msg">{r.message}</span>
                          <span style="font-family:var(--font-mono);color:var(--text-faint);font-size:11px">{r.date}</span>
                          <span style="font-family:var(--font-mono);font-weight:600;text-align:right">{fmtBRL(r.value)}</span>
                        </div>
                      {/each}
                    </div>
                  </td>
                </tr>
              {/if}
            {/each}
          </tbody>
        </table>
        {#if sortedLeads().length === 0}
          <div class="crm-empty">
            <div class="ico"><Users size={18}/></div>
            Nenhum lead corresponde aos filtros atuais.
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>

<!-- ── Lead Drawer ── -->
{#if activeLead}
  <div class="admin-drawer-bg" role="presentation" onclick={() => activeLeadId = null}></div>
  <aside class="admin-drawer crm-drawer">
    <div class="admin-drawer-head">
      <div style="display:flex;align-items:center;gap:10px">
        <span style="font-size:11px;font-family:var(--font-mono);padding:3px 9px;border-radius:100px;background:var(--bg-soft);color:var(--text-muted);letter-spacing:0.06em;text-transform:uppercase">
          <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:{activeCol?.color};margin-right:6px;vertical-align:middle"></span>{activeCol?.title}
        </span>
        {#if activeLead.requests.length > 1}
          <span style="font-size:11px;font-family:var(--font-mono);padding:3px 9px;border-radius:100px;background:var(--accent-soft);color:var(--purple);border:1px solid var(--accent-line);display:inline-flex;align-items:center;gap:5px">
            <GitMerge size={10}/> {activeLead.requests.length} pedidos unificados
          </span>
        {/if}
        <span style="flex:1"></span>
        <button class="x" onclick={() => activeLeadId = null} style="background:transparent;border:0;color:var(--text-muted);cursor:pointer;width:28px;height:28px;border-radius:8px;display:grid;place-items:center"><X size={13}/></button>
      </div>
      <div style="display:flex;align-items:center;gap:12px;margin-top:14px">
        <span class="crm-avatar" style="width:42px;height:42px;font-size:14px;background:{activeCol?.color || 'var(--purple)'}">{initials(activeLead.company)}</span>
        <div>
          <h3 style="font-size:21px;letter-spacing:-0.02em;font-weight:600">{activeLead.company}</h3>
          <div style="font-size:12.5px;color:var(--text-muted);margin-top:2px">{activeLead.name}{activeLead.role ? ` · ${activeLead.role}` : ''}</div>
        </div>
      </div>
      <div class="crm-drawer-actions">
        <a class="wa" href={waLink(activeLead)} target="_blank" rel="noopener">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          WhatsApp
        </a>
        <a class="mail" href={mailLink(activeLead)}><Mail size={13}/> E-mail</a>
        <a class="call" href="tel:{phoneDigits(activeLead.phone)}"><Phone size={12}/> Ligar</a>
      </div>
      <div class="crm-kv" style="margin-top:16px;padding-top:14px;border-top:1px solid var(--line)">
        <div><div class="k">Valor total / mês</div><div class="v" style="font-weight:600">{fmtBRL(leadValue(activeLead))}</div></div>
        <div><div class="k">Responsável</div><div class="v">{activeLead.responsible}</div></div>
        <div><div class="k">Origem</div><div class="v">{activeLead.source}</div></div>
      </div>
      <div class="crm-kv" style="margin-top:12px">
        <div><div class="k">E-mail</div><div class="v mono" style="font-size:12px">{activeLead.email}</div></div>
        <div><div class="k">Telefone</div><div class="v mono" style="font-size:12px">{activeLead.phone}</div></div>
      </div>
      <div style="margin-top:14px">
        <div style="font-family:var(--font-mono);font-size:9.5px;letter-spacing:0.08em;text-transform:uppercase;color:var(--text-faint);margin-bottom:7px">Mover estágio</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          {#each columns as c}
            <button onclick={() => { moveLead(activeLead!.id, c.id); }}
              class="crm-prodchip"
              style={c.id === activeLead.stage ? `background:${c.color}22;border-color:${c.color};color:${c.color};padding:5px 10px` : 'padding:5px 10px'}>
              <span class="swatch" style="background:{c.color}"></span>{c.title}
            </button>
          {/each}
        </div>
      </div>
    </div>
    <div class="admin-drawer-body">
      <!-- Pedidos -->
      <div>
        <div class="crm-section-h"><h4>Pedidos recebidos</h4><span class="pill">{activeLead.requests.length}</span></div>
        <div style="display:flex;flex-direction:column;gap:8px">
          {#each activeLead.requests as r}
            {@const p = PRODUCT_BY_ID[r.product]}
            <div class="crm-deal">
              <div class="dh">
                {#if p}<span class="crm-prodtag" style="background:{p.color}22;color:{p.color}"><span class="d" style="background:{p.color}"></span>{p.name}</span>{/if}
                <span class="dmeta">{r.plan}</span>
                <span class="pval">{fmtBRL(r.value)}</span>
              </div>
              <div class="dmsg">{r.message}</div>
              <div class="dmeta">recebido em {r.date} · status: {r.status}</div>
            </div>
          {/each}
        </div>
      </div>
      <!-- Interactions -->
      <div>
        <div class="crm-section-h"><h4>Histórico de interações</h4><span class="pill">{activeLead.interactions.length}</span></div>
        {#if activeLead.interactions.length === 0}
          <div style="padding:18px;border:1px dashed var(--line);border-radius:10px;color:var(--text-muted);font-size:12.5px;text-align:center">Nenhuma interação registrada ainda.</div>
        {:else}
          <div class="timeline">
            {#each activeLead.interactions as it}
              <div class="timeline-item {it.kind}">
                <div class="pip">
                  {#if it.kind === 'call'}<Headphones size={11}/>{:else if it.kind === 'email'}<Mail size={11}/>{:else}<Bot size={11}/>{/if}
                </div>
                <div>
                  <div class="meta">{it.t} · {it.kind}</div>
                  <div class="body"><span class="actor">{it.who}</span> · {it.body}</div>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
    <div class="admin-drawer-foot">
      <div style="display:flex;gap:4px;margin-bottom:8px">
        {#each [{ id:'note', label:'Nota', ico:'bot' },{ id:'call', label:'Ligação', ico:'headset' },{ id:'email', label:'E-mail', ico:'mail' }] as t}
          <button type="button" onclick={() => interactionKind = t.id as 'note'|'call'|'email'} class="filter-chip {interactionKind === t.id ? 'on' : ''}">
            {#if t.ico === 'bot'}<Bot size={10}/>{:else if t.ico === 'headset'}<Headphones size={10}/>{:else}<Mail size={10}/>{/if} {t.label}
          </button>
        {/each}
      </div>
      <div style="display:flex;gap:8px;align-items:stretch">
        <textarea bind:value={interactionBody}
          placeholder={interactionKind === 'note' ? 'Anotação interna…' : interactionKind === 'call' ? 'Resumo da ligação, próximos passos…' : 'Conteúdo enviado…'}
          style="flex:1;resize:none;height:60px;border:1px solid var(--line);border-radius:8px;padding:8px 12px;font-family:inherit;font-size:13px;color:var(--text);background:var(--bg);outline:none"
          onkeydown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) addInteraction(); }}></textarea>
        <button class="btn sm" style="align-self:flex-end" onclick={addInteraction}>Registrar <ArrowRight size={12}/></button>
      </div>
    </div>
  </aside>
{/if}

<!-- ── Column Editor Modal ── -->
{#if editingCols}
  <div class="admin-overlay" role="presentation" onclick={() => editingCols = false}>
    <div class="admin-modal wide" role="dialog" aria-modal="true" aria-label="Editar colunas do pipeline" onclick={(e) => e.stopPropagation()}>
      <div class="admin-modal-head">
        <h3>Editar colunas do pipeline</h3>
        <span class="crumbs">/ crm / colunas</span>
        <button class="x" onclick={() => editingCols = false}><X size={13}/></button>
      </div>
      <div class="admin-modal-body">
        {#if colsError}
          <div class="crm-err-banner">{colsError}</div>
        {/if}
        <div class="crm-coleditor">
          {#each editCols as c (c.id)}
            <div class="crm-colrow {colDragId === c.id ? 'dragging' : ''} {colDropTarget?.id === c.id ? (colDropTarget.after ? 'drop-after' : 'drop-before') : ''}"
              ondragover={(e) => { if (colDragId && colDragId !== c.id) { e.preventDefault(); const r = e.currentTarget.getBoundingClientRect(); colDropTarget = { id: c.id, after: e.clientY > r.top + r.height / 2 }; } }}
              ondrop={(e) => { e.preventDefault(); editorDrop(c.id); }}>
              <div class="r1">
                <span class="handle" draggable="true"
                  ondragstart={() => colDragId = c.id}
                  ondragend={() => { colDragId = null; colDropTarget = null; }}
                  title="arraste">
                  <MoreVertical size={13}/><MoreVertical size={13} style="margin-left:-9px"/>
                </span>
                <input class="cname" bind:value={c.title}/>
                <div class="crm-swatches">
                  {#each COL_COLORS as col}
                    <button type="button" class="crm-swatch {c.color === col ? 'on' : ''}" style="background:{col}" onclick={() => editorUpd(c.id, { color: col })}></button>
                  {/each}
                </div>
                <button class="del" onclick={() => editorDel(c.id)} title="Excluir coluna" disabled={editCols.length <= 1 || c.is_default}><X size={14}/></button>
              </div>
              <div class="crit">
                <div class="f">
                  <label>Filtro de entrada</label>
                  <textarea bind:value={c.entry_hint} placeholder="Quando um lead entra nesta coluna?"></textarea>
                </div>
                <div class="f">
                  <label>Filtro de saída</label>
                  <textarea bind:value={c.exit_hint} placeholder="Quando um lead sai desta coluna?"></textarea>
                </div>
              </div>
            </div>
          {/each}
          <button class="crm-addcard" style="padding:12px" onclick={editorAdd}>+ adicionar coluna</button>
        </div>
      </div>
      <div class="admin-modal-foot">
        <span class="mono" style="font-size:10.5px;color:var(--text-faint);letter-spacing:0.06em;text-transform:uppercase;margin-right:auto">arraste pelo ⠿ para reordenar</span>
        <button class="btn ghost sm" onclick={() => editingCols = false} disabled={colSaving}>Cancelar</button>
        <button class="btn sm" onclick={saveColumns} disabled={colSaving}>
          {#if colSaving}Salvando…{:else}Salvar pipeline <Check size={12}/>{/if}
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- ── New Lead Modal ── -->
{#if addingLead}
  <div class="admin-overlay" role="presentation" onclick={() => addingLead = null}>
    <div class="admin-modal wide" role="dialog" aria-modal="true" aria-label="Cadastrar novo lead" onclick={(e) => e.stopPropagation()}>
      <div class="admin-modal-head">
        <h3>Cadastrar novo lead</h3>
        <span class="crumbs">/ crm / novo</span>
        <button class="x" onclick={() => addingLead = null}><X size={13}/></button>
      </div>
      <div class="admin-modal-body">
        <div class="fld-group">
          <div class="fld-row">
            <div class="fld"><label>Empresa</label><input bind:value={newLead.company} placeholder="ex. Folha Sistemas" autofocus/></div>
            <div class="fld"><label>Contato</label><input bind:value={newLead.name} placeholder="ex. Leandro Prado"/></div>
          </div>
          <div class="fld-row">
            <div class="fld"><label>Cargo</label><input bind:value={newLead.role} placeholder="ex. CTO"/></div>
            <div class="fld"><label>Origem</label>
              <select bind:value={newLead.source}>
                {#each ['Cadastro manual','Formulário público','Indicação','Evento','Outbound'] as s}<option>{s}</option>{/each}
              </select>
            </div>
          </div>
          <div class="fld-row">
            <div class="fld"><label>E-mail</label><input type="email" bind:value={newLead.email} placeholder="contato@empresa.com"/></div>
            <div class="fld"><label>Telefone (com DDD)</label><input bind:value={newLead.phone} placeholder="+55 11 90000-0000"/></div>
          </div>
          <div style="height:1px;background:var(--line);margin:4px 0"></div>
          <div class="fld-row">
            <div class="fld"><label>Produto de interesse</label>
              <select bind:value={newLead.product}>{#each PRODUCTS as p}<option value={p.id}>{p.name}</option>{/each}</select>
            </div>
            <div class="fld"><label>Valor estimado / mês (R$)</label><input bind:value={newLead.value} placeholder="24000"/></div>
          </div>
          <div class="fld-row">
            <div class="fld"><label>Plano</label>
              <select bind:value={newLead.plan}>{#each ['Starter · mensal','Pro · mensal','Enterprise · mensal','Enterprise · anual','A definir'] as p}<option>{p}</option>{/each}</select>
            </div>
            <div class="fld"><label>Responsável</label>
              <select bind:value={newLead.responsible}>{#each RESPONSIBLES as r}<option>{r}</option>{/each}</select>
            </div>
          </div>
          <div class="fld-row">
            <div class="fld"><label>Estágio inicial</label>
              <select bind:value={newLead.stage}>{#each columns as c}<option value={c.id}>{c.title}</option>{/each}</select>
            </div>
            <div class="fld"></div>
          </div>
          <div class="fld"><label>Mensagem / primeiro pedido</label>
            <textarea bind:value={newLead.message} placeholder="O que o lead solicitou? Pontos importantes da primeira conversa…"></textarea>
          </div>
          <div style="display:flex;gap:10px;align-items:center;padding:12px;background:var(--accent-soft);border-radius:10px;border:1px solid var(--accent-line);font-size:12px;color:var(--text-muted)">
            <GitMerge size={13} style="color:var(--purple);flex-shrink:0"/>
            Se já existir um lead com a mesma empresa, novos pedidos podem ser unificados no mesmo card pelo botão de mesclar.
          </div>
        </div>
      </div>
      <div class="admin-modal-foot">
        <button class="btn ghost sm" onclick={() => addingLead = null}>Cancelar</button>
        <button class="btn sm" onclick={doAddLead}>Adicionar ao pipeline <ArrowRight size={12}/></button>
      </div>
    </div>
  </div>
{/if}

<style>
  /* ── Layout ── */
  .crm-root {
    position: absolute; inset: 0;
    display: flex; flex-direction: column;
    background: var(--bg); color: var(--text); overflow: hidden;
  }
  .crm-head {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 20px; border-bottom: 1px solid var(--line);
    background: var(--bg-elev); flex-shrink: 0; flex-wrap: wrap;
  }
  .crm-brand { display: flex; align-items: center; gap: 9px; font-weight: 600; font-size: 14.5px; letter-spacing: -0.01em; }
  .crm-crumb { font-family: var(--font-mono); font-size: 11px; color: var(--text-faint); letter-spacing: 0.04em; }
  .crm-seg { display: inline-flex; background: var(--bg-soft); border: 1px solid var(--line); border-radius: 9px; padding: 3px; gap: 2px; }
  .crm-seg button {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 5px 12px; border: 0; border-radius: 6px;
    background: transparent; color: var(--text-muted); font-family: inherit; font-size: 12.5px; font-weight: 500; cursor: pointer;
    transition: background 0.12s, color 0.12s;
  }
  .crm-seg button.on { background: var(--bg-elev); color: var(--text); box-shadow: var(--shadow-1); }

  /* ── Filter bar ── */
  .crm-bar {
    display: flex; align-items: center; gap: 9px; flex-wrap: wrap;
    padding: 10px 20px; border-bottom: 1px solid var(--line);
    background: var(--bg); flex-shrink: 0;
  }
  .crm-bar .label-mono { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-faint); margin-right: 2px; }
  .crm-bar .vline { width: 1px; height: 22px; background: var(--line); }
  .crm-prodchip {
    display: inline-flex; align-items: center; gap: 7px; padding: 5px 10px; border-radius: 100px;
    border: 1px solid var(--line); background: var(--bg-elev); color: var(--text-muted);
    font-family: inherit; font-size: 12px; font-weight: 500; cursor: pointer;
    transition: border-color 0.12s, color 0.12s, background 0.12s;
  }
  .crm-prodchip:hover { color: var(--text); border-color: var(--line-strong); }
  .crm-prodchip .swatch { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
  .crm-prodchip .ct { font-family: var(--font-mono); font-size: 10px; opacity: 0.7; }
  .crm-select {
    background: var(--bg-elev); border: 1px solid var(--line); border-radius: 8px;
    padding: 6px 10px; font-family: inherit; font-size: 12.5px; color: var(--text); outline: none; cursor: pointer;
  }
  .crm-search {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--bg-elev); border: 1px solid var(--line); border-radius: 8px; padding: 6px 10px; min-width: 200px; color: var(--text-faint);
  }
  .crm-search input { background: transparent; border: 0; outline: none; font-family: inherit; font-size: 13px; color: var(--text); flex: 1; width: 100%; }

  /* ── Stats ── */
  .crm-stats { display: flex; gap: 20px; padding: 9px 20px; border-bottom: 1px solid var(--line); background: var(--bg-elev); flex-shrink: 0; flex-wrap: wrap; }
  .crm-stats .stat .k { font-family: var(--font-mono); font-size: 9.5px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-faint); }
  .crm-stats .stat .v { font-size: 16px; font-weight: 600; letter-spacing: -0.02em; margin-top: 2px; }
  .crm-stats .stat .v small { font-size: 11px; color: var(--text-muted); font-weight: 500; }

  /* ── Dupe banner ── */
  .crm-dupe-banner {
    display: flex; align-items: center; gap: 12px;
    margin: 10px 20px 0; padding: 10px 13px;
    background: rgba(245,158,11,0.12); border: 1px solid rgba(245,158,11,0.3);
    border-radius: 10px; font-size: 12.5px;
  }
  .crm-dupe-banner .dot { width: 7px; height: 7px; border-radius: 50%; background: #f59e0b; flex-shrink: 0; }
  .crm-dupe-banner button {
    margin-left: auto; background: transparent; border: 1px solid rgba(245,158,11,0.4);
    color: #f59e0b; border-radius: 7px; padding: 4px 10px; font-family: inherit; font-size: 12px; font-weight: 500; cursor: pointer;
  }

  /* ── Body scroll ── */
  .crm-body { flex: 1; overflow: auto; padding: 14px 20px 28px; }

  /* ── Kanban ── */
  .crm-kanban { display: flex; gap: 12px; align-items: flex-start; min-height: 100%; }
  .crm-col {
    flex: 1 1 0; min-width: 240px; background: var(--bg-soft); border-radius: 12px; padding: 10px;
    display: flex; flex-direction: column; gap: 8px;
    border: 1px solid transparent; transition: border-color 0.12s, background 0.12s;
  }
  .crm-col.drop-active { border-color: var(--purple); background: var(--accent-soft); }
  .crm-col-head { display: flex; align-items: center; gap: 8px; padding: 4px 4px 2px; }
  .crm-col-head .dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
  .crm-col-head .title { font-size: 13px; font-weight: 600; letter-spacing: -0.01em; flex: 1; }
  .crm-col-head .ct { font-family: var(--font-mono); font-size: 10px; color: var(--text-faint); background: var(--bg-elev); border: 1px solid var(--line); padding: 1px 6px; border-radius: 100px; }
  .crm-col-head .gear { background: transparent; border: 0; color: var(--text-faint); cursor: pointer; padding: 3px; border-radius: 6px; display: grid; place-items: center; }
  .crm-col-head .gear:hover { color: var(--text); background: var(--bg-elev); }
  .crm-col-total {
    display: flex; align-items: center; justify-content: space-between;
    padding: 5px 7px; margin: 0 1px; border-radius: 7px; background: var(--bg-elev); border: 1px solid var(--line);
    font-family: var(--font-mono); font-size: 10px; color: var(--text-muted);
  }
  .crm-col-total b { color: var(--text); font-weight: 600; }

  /* Lead card */
  .crm-card {
    background: var(--bg-elev); border: 1px solid var(--line); border-radius: 10px;
    padding: 11px; display: flex; flex-direction: column; gap: 8px; cursor: grab;
    transition: transform 0.14s, box-shadow 0.14s, border-color 0.14s;
  }
  .crm-card:hover { transform: translateY(-1px); box-shadow: var(--shadow-2); border-color: var(--line-strong); }
  .crm-card.dragging { opacity: 0.35; cursor: grabbing; }
  .crm-card .top { display: flex; align-items: flex-start; gap: 9px; }
  .crm-avatar { width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0; display: grid; place-items: center; font-family: var(--font-mono); font-size: 10px; font-weight: 600; color: #fff; }
  .crm-card .who { min-width: 0; flex: 1; }
  .crm-card .company { font-size: 13px; font-weight: 600; letter-spacing: -0.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .crm-card .person { font-size: 11px; color: var(--text-muted); margin-top: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .crm-card .agewarn { color: #f59e0b; }
  .crm-prods { display: flex; flex-wrap: wrap; gap: 4px; }
  .crm-prodtag { display: inline-flex; align-items: center; gap: 4px; font-family: var(--font-mono); font-size: 9.5px; padding: 2px 6px; border-radius: 5px; font-weight: 500; }
  .crm-prodtag .d { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
  .crm-card .meta-row { display: flex; align-items: center; justify-content: space-between; padding-top: 8px; border-top: 1px solid var(--line); }
  .crm-pedidos { font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); display: inline-flex; align-items: center; gap: 4px; }
  .crm-pedidos .badge { background: var(--accent-soft); color: var(--purple); border: 1px solid var(--accent-line); border-radius: 100px; padding: 1px 6px; font-weight: 600; }
  .crm-card .val { font-family: var(--font-mono); font-size: 11.5px; font-weight: 600; }
  .crm-card .respo { font-family: var(--font-mono); font-size: 10px; color: var(--text-faint); }
  .crm-actions { display: flex; align-items: center; gap: 5px; }
  .crm-iconbtn { width: 26px; height: 26px; border-radius: 7px; display: grid; place-items: center; border: 1px solid var(--line); background: var(--bg); color: var(--text-muted); cursor: pointer; transition: all 0.12s; text-decoration: none; }
  .crm-iconbtn:hover { color: var(--text); border-color: var(--line-strong); transform: translateY(-1px); }
  .crm-iconbtn.wa:hover { background: #25D366; border-color: #25D366; color: #fff; }
  .crm-iconbtn.mail:hover { background: var(--purple); border-color: var(--purple); color: #fff; }
  .crm-addcard { background: transparent; border: 1px dashed var(--line-strong); border-radius: 9px; color: var(--text-faint); padding: 8px; font-family: inherit; font-size: 12px; cursor: pointer; transition: color 0.12s, border-color 0.12s; }
  .crm-addcard:hover { color: var(--text); border-color: var(--purple); }
  .crm-addcol { flex: 0 0 56px; align-self: stretch; min-height: 100px; background: transparent; border: 1px dashed var(--line-strong); border-radius: 12px; color: var(--text-faint); cursor: pointer; display: grid; place-items: center; font-family: var(--font-mono); font-size: 11px; writing-mode: vertical-rl; letter-spacing: 0.1em; transition: color 0.12s, border-color 0.12s; }
  .crm-addcol:hover { color: var(--text); border-color: var(--purple); }

  /* ── Table ── */
  .crm-table-wrap { border: 1px solid var(--line); border-radius: 12px; overflow: hidden; background: var(--bg-elev); }
  .crm-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .crm-table th { text-align: left; font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-faint); font-weight: 500; padding: 10px 13px; border-bottom: 1px solid var(--line); background: var(--bg-soft); white-space: nowrap; cursor: pointer; user-select: none; }
  .crm-table th.no-sort { cursor: default; }
  .crm-table th .sortcaret { opacity: 0.4; margin-left: 4px; font-size: 9px; }
  .crm-table th.sorted .sortcaret { opacity: 1; color: var(--purple); }
  .crm-table td { padding: 10px 13px; border-bottom: 1px solid var(--line); vertical-align: middle; }
  .crm-table tbody tr { transition: background 0.1s; }
  .crm-table tbody tr.lead-row { cursor: pointer; }
  .crm-table tbody tr.lead-row:hover { background: var(--bg-soft); }
  .crm-table tbody tr:last-child td { border-bottom: 0; }
  .crm-tname { font-weight: 600; letter-spacing: -0.01em; }
  .crm-tsub { font-size: 11.5px; color: var(--text-muted); font-family: var(--font-mono); }
  .crm-tstage { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; }
  .crm-tstage .d { width: 7px; height: 7px; border-radius: 50%; }
  .crm-texpand { background: transparent; border: 0; color: var(--text-faint); cursor: pointer; padding: 2px; display: inline-flex; transition: transform 0.15s; }
  .crm-texpand.open { transform: rotate(90deg); color: var(--text); }
  .crm-subrow td { background: var(--bg); padding: 0; }
  .crm-subrow .inner { padding: 4px 13px 10px 48px; display: flex; flex-direction: column; gap: 6px; }
  .crm-pedido-line { display: grid; grid-template-columns: 90px 1fr 80px 80px; gap: 10px; align-items: center; padding: 7px 10px; background: var(--bg-soft); border: 1px solid var(--line); border-radius: 8px; font-size: 12px; }
  .crm-pedido-line .msg { color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .col-actions { display: flex; gap: 5px; }
  .crm-empty { text-align: center; padding: 50px 20px; color: var(--text-muted); }
  .crm-empty .ico { width: 44px; height: 44px; border-radius: 12px; display: grid; place-items: center; background: var(--bg-soft); border: 1px solid var(--line); margin: 0 auto 12px; color: var(--text-faint); }

  /* ── Drawer ── */
  .crm-drawer { width: 480px; }
  .crm-drawer-actions { display: flex; gap: 7px; margin-top: 14px; }
  .crm-drawer-actions a, .crm-drawer-actions button { flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 8px; border-radius: 9px; font-family: inherit; font-size: 12px; font-weight: 500; cursor: pointer; text-decoration: none; border: 1px solid var(--line); background: var(--bg); color: var(--text); transition: all 0.12s; }
  .crm-drawer-actions a.wa:hover { background: #25D366; border-color: #25D366; color: #fff; }
  .crm-drawer-actions a.mail:hover { background: var(--purple); border-color: var(--purple); color: #fff; }
  .crm-drawer-actions a.call:hover { background: var(--bg-soft); border-color: var(--line-strong); }
  .crm-deal { border: 1px solid var(--line); border-radius: 10px; padding: 11px; background: var(--bg-soft); display: flex; flex-direction: column; gap: 6px; }
  .crm-deal .dh { display: flex; align-items: center; gap: 9px; }
  .crm-deal .dh .pval { margin-left: auto; font-family: var(--font-mono); font-size: 12px; font-weight: 600; }
  .crm-deal .dmeta { font-family: var(--font-mono); font-size: 10.5px; color: var(--text-faint); }
  .crm-deal .dmsg { font-size: 12.5px; color: var(--text-muted); line-height: 1.5; }
  .crm-kv { display: flex; gap: 20px; flex-wrap: wrap; }
  .crm-kv .k { font-family: var(--font-mono); font-size: 9.5px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-faint); }
  .crm-kv .v { font-size: 13px; margin-top: 3px; }
  .crm-section-h { display: flex; align-items: center; gap: 9px; margin-bottom: 10px; }
  .crm-section-h h4 { font-size: 12.5px; font-weight: 600; margin: 0; }
  .crm-section-h .pill { font-family: var(--font-mono); font-size: 9.5px; background: var(--bg-soft); border: 1px solid var(--line); color: var(--text-muted); padding: 1px 7px; border-radius: 100px; }

  /* ── Column editor ── */
  .crm-coleditor { display: flex; flex-direction: column; gap: 10px; }
  .crm-colrow { display: flex; flex-direction: column; gap: 10px; background: var(--bg-soft); border: 1px solid var(--line); border-radius: 10px; padding: 12px; transition: border-color 0.12s, box-shadow 0.12s; }
  .crm-colrow.dragging { opacity: 0.4; }
  .crm-colrow.drop-before { box-shadow: 0 -3px 0 var(--purple); }
  .crm-colrow.drop-after { box-shadow: 0 3px 0 var(--purple); }
  .crm-colrow .r1 { display: flex; align-items: center; gap: 9px; }
  .crm-colrow .handle { color: var(--text-faint); cursor: grab; display: inline-flex; }
  .crm-colrow input.cname { flex: 1; background: var(--bg); border: 1px solid var(--line); border-radius: 7px; padding: 7px 10px; font-family: inherit; font-size: 13px; font-weight: 500; color: var(--text); outline: none; }
  .crm-colrow input.cname:focus { border-color: var(--purple); }
  .crm-colrow .del { background: transparent; border: 0; color: var(--text-faint); cursor: pointer; padding: 5px; border-radius: 6px; }
  .crm-colrow .del:hover:not(:disabled) { color: var(--pink); background: var(--hot-soft, rgba(231,31,132,0.1)); }
  .crm-colrow .del:disabled { opacity: 0.3; cursor: not-allowed; }
  .crm-swatches { display: flex; gap: 5px; }
  .crm-swatch { width: 20px; height: 20px; border-radius: 5px; border: 2px solid transparent; cursor: pointer; padding: 0; }
  .crm-swatch.on { border-color: var(--text); box-shadow: 0 0 0 2px var(--bg-soft); }
  .crm-colrow .crit { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .crm-colrow .crit .f { display: flex; flex-direction: column; gap: 4px; }
  .crm-colrow .crit label { font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-faint); }
  .crm-colrow .crit textarea { background: var(--bg); border: 1px solid var(--line); border-radius: 7px; padding: 6px 9px; font-family: inherit; font-size: 12px; color: var(--text); outline: none; resize: none; min-height: 44px; line-height: 1.4; }
  .crm-colrow .crit textarea:focus { border-color: var(--purple); }

  /* ── Error banner ── */
  .crm-err-banner { background: rgba(231,31,132,0.1); border: 1px solid rgba(231,31,132,0.3); border-radius: 9px; padding: 10px 14px; font-size: 12.5px; color: var(--text); margin-bottom: 12px; }

  /* ── Timeline ── */
  .timeline { display: flex; flex-direction: column; gap: 10px; }
  .timeline-item { display: flex; gap: 10px; }
  .timeline-item .pip { width: 24px; height: 24px; border-radius: 7px; background: var(--bg-soft); border: 1px solid var(--line); display: grid; place-items: center; flex-shrink: 0; color: var(--text-faint); margin-top: 2px; }
  .timeline-item .meta { font-family: var(--font-mono); font-size: 10px; color: var(--text-faint); }
  .timeline-item .body { font-size: 12.5px; color: var(--text-muted); margin-top: 3px; line-height: 1.5; }
  .timeline-item .actor { font-weight: 600; color: var(--text); }

  /* ── Form fields ── */
  .fld-group { display: flex; flex-direction: column; gap: 12px; }
  .fld-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .fld { display: flex; flex-direction: column; gap: 5px; }
  .fld label { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-faint); }
  .fld input, .fld select { background: var(--bg-soft); border: 1px solid var(--line); border-radius: 8px; padding: 8px 11px; font-family: inherit; font-size: 13px; color: var(--text); outline: none; }
  .fld input:focus, .fld select:focus { border-color: var(--purple); }
  .fld textarea { background: var(--bg-soft); border: 1px solid var(--line); border-radius: 8px; padding: 8px 11px; font-family: inherit; font-size: 13px; color: var(--text); outline: none; resize: none; min-height: 72px; line-height: 1.5; }
  .fld textarea:focus { border-color: var(--purple); }

  /* ── filter-chip (interaction type toggle) ── */
  .filter-chip { display: inline-flex; align-items: center; gap: 5px; padding: 5px 10px; border-radius: 100px; border: 1px solid var(--line); background: transparent; color: var(--text-muted); font-family: inherit; font-size: 12px; cursor: pointer; transition: all 0.12s; }
  .filter-chip.on { background: var(--bg-elev); color: var(--text); border-color: var(--line-strong); }

  /* ── Responsive ── */
  @media (max-width: 760px) {
    .crm-stats { display: none; }
    .crm-kanban { flex-direction: column; }
    .crm-col { width: 100%; min-width: unset; }
    .fld-row { grid-template-columns: 1fr; }
    .crm-colrow .crit { grid-template-columns: 1fr; }
    .crm-drawer { width: 100%; }
    .crm-head { gap: 8px; }
  }
</style>
