// Crianex CRM — data model + helpers
// A LEAD = a person/company in the pipeline at one stage.
// Their multiple form submissions are "pedidos" (requests) line-items underneath,
// so the same person never appears as separate cards.

const CRM_PRODUCTS = [
  { id: "avali",   name: "Avali",   color: "#7f3fe5" },
  { id: "pontua",  name: "Pontua",  color: "#e71f84" },
  { id: "notifly", name: "Notifly", color: "#66df7a" },
  { id: "trilho",  name: "Trilho",  color: "#3b82f6" },
  { id: "atende",  name: "Atende",  color: "#f59e0b" },
  { id: "ledger",  name: "Ledger",  color: "#06b6d4" }
];
const PRODUCT_BY_ID = Object.fromEntries(CRM_PRODUCTS.map(p => [p.id, p]));

const RESPONSIBLES = ["Joana V.", "Ricardo L.", "Marina P.", "Tiago A."];

// Default pipeline columns — fully user-editable (color, name, order, entry/exit criteria)
const DEFAULT_COLUMNS = [
  { id: "novo",  title: "Novo lead",      color: "#7f3fe5",
    entry: "Lead entra pelo formulário público ou cadastro manual.",
    exit:  "Sai quando o primeiro contato é realizado e há fit inicial." },
  { id: "qual",  title: "Qualificado",    color: "#3b82f6",
    entry: "Contato feito, perfil e orçamento confirmados.",
    exit:  "Sai ao enviar proposta comercial formal." },
  { id: "neg",   title: "Em negociação",  color: "#f59e0b",
    entry: "Proposta enviada, em discussão de escopo e preço.",
    exit:  "Sai com a decisão do cliente (ganho ou perdido)." },
  { id: "fech",  title: "Fechado",        color: "#66df7a",
    entry: "Contrato assinado e provisionamento iniciado.",
    exit:  "—" },
  { id: "perd",  title: "Perdido",        color: "#9a968e",
    entry: "Cliente declinou ou ficou sem resposta por 30+ dias.",
    exit:  "Pode ser reaberto em uma nova oportunidade." }
];

// ── Seed leads. Some people have MULTIPLE pedidos (grouping demo). ──
const SEED_LEADS = [
  {
    id: "l1", name: "Carla Mendes", company: "NIVERA Tech", role: "Head de RH",
    email: "carla@nivera.com", phone: "+55 11 98421-0042",
    responsible: "Joana V.", stage: "novo", source: "Formulário público",
    createdAt: "2026-06-12", lastActivity: "há 2h",
    requests: [
      { id: "r1a", product: "pontua",  value: 18000, plan: "Pro · mensal",   date: "12 jun", message: "Quer rever o programa de incentivos do time comercial.", status: "novo" },
      { id: "r1b", product: "notifly", value: 6000,  plan: "Starter · mensal", date: "13 jun", message: "Também avaliando disparo de notificações para vendedores.", status: "novo" }
    ],
    interactions: [
      { t: "hoje · 09:14", who: "Joana V.", kind: "note", body: "Contato inicial via LinkedIn. RH quer rever programa de incentivos." },
      { t: "ontem · 17:42", who: "Sistema", kind: "email", body: "Lead capturado via formulário público — produto: Pontua." }
    ]
  },
  {
    id: "l2", name: "Leandro Prado", company: "Folha Sistemas", role: "CTO",
    email: "leandro@folha.io", phone: "+55 21 99654-1180",
    responsible: "Ricardo L.", stage: "novo", source: "Indicação",
    createdAt: "2026-06-14", lastActivity: "há 5h",
    requests: [
      { id: "r2a", product: "avali", value: 42000, plan: "Enterprise · mensal", date: "14 jun", message: "POC com 800 alunos antes de assinar.", status: "novo" }
    ],
    interactions: [
      { t: "hoje · 11:30", who: "Ricardo L.", kind: "call", body: "Call com CTO. Eles querem POC com 800 alunos antes de assinar." }
    ]
  },
  {
    id: "l3", name: "Diretoria", company: "Editora Versa", role: "Diretoria",
    email: "diretoria@versa.com.br", phone: "+55 11 3344-1290",
    responsible: "—", stage: "novo", source: "Formulário público",
    createdAt: "2026-06-15", lastActivity: "há 1d",
    requests: [
      { id: "r3a", product: "avali", value: 0, plan: "A definir", date: "15 jun", message: "Pediram material sobre correção por IA.", status: "novo" }
    ],
    interactions: []
  },
  {
    id: "l4", name: "Ana Tavares", company: "Quantum Lab", role: "Product Lead",
    email: "ana@quantum.app", phone: "+55 11 97712-3380",
    responsible: "Joana V.", stage: "qual", source: "Evento",
    createdAt: "2026-06-08", lastActivity: "há 3d",
    requests: [
      { id: "r4a", product: "notifly", value: 9000, plan: "Pro · mensal", date: "08 jun", message: "Aprovado tecnicamente, aguardando aprovação financeira.", status: "qualificado" }
    ],
    interactions: [
      { t: "anteontem · 14:00", who: "Joana V.", kind: "call", body: "Demo de 45min. Aprovaram tecnicamente. Aguardando aprovação financeira interna." }
    ]
  },
  {
    id: "l5", name: "Compras", company: "RedeFort Educação", role: "Setor de Compras",
    email: "compras@redefort.com.br", phone: "+55 31 98220-4471",
    responsible: "Ricardo L.", stage: "qual", source: "Formulário público",
    createdAt: "2026-06-05", lastActivity: "há 3d",
    requests: [
      { id: "r5a", product: "avali",  value: 58000, plan: "Enterprise · mensal", date: "05 jun", message: "Proposta enviada, diretoria revisa quinta.", status: "qualificado" },
      { id: "r5b", product: "trilho", value: 12000, plan: "Pro · mensal",        date: "07 jun", message: "Interesse adicional em trilhas de onboarding de professores.", status: "novo" }
    ],
    interactions: [
      { t: "há 3 dias", who: "Ricardo L.", kind: "note", body: "Proposta enviada. Diretoria revisa na próxima quinta." }
    ]
  },
  {
    id: "l6", name: "Roberto Diniz", company: "Aletheia Group", role: "Diretor de Operações",
    email: "diretor@aletheia.co", phone: "+55 11 96541-8890",
    responsible: "Joana V.", stage: "neg", source: "Indicação",
    createdAt: "2026-05-28", lastActivity: "há 1d",
    requests: [
      { id: "r6a", product: "notifly", value: 24000, plan: "Enterprise · mensal", date: "28 mai", message: "Negociando volume de mensagens e SLA.", status: "negociacao" }
    ],
    interactions: [
      { t: "há 1 dia", who: "Joana V.", kind: "email", body: "Enviada revisão de proposta com desconto por volume anual." }
    ]
  },
  {
    id: "l7", name: "Tiago Rocha", company: "Praxis Soluções", role: "Founder",
    email: "tiago@praxis.tech", phone: "+55 47 99135-2204",
    responsible: "Ricardo L.", stage: "neg", source: "Formulário público",
    createdAt: "2026-06-01", lastActivity: "há 6h",
    requests: [
      { id: "r7a", product: "pontua", value: 16000, plan: "Pro · mensal", date: "01 jun", message: "Quer fechar até o fim do mês.", status: "negociacao" }
    ],
    interactions: []
  },
  {
    id: "l8", name: "RH Corporativo", company: "ICE Educação", role: "RH",
    email: "rh@ice.org.br", phone: "+55 85 98876-0021",
    responsible: "Joana V.", stage: "neg", source: "Formulário público",
    createdAt: "2026-05-20", lastActivity: "há 12d",
    requests: [
      { id: "r8a", product: "avali",  value: 88000, plan: "Enterprise · anual", date: "20 mai", message: "Maior conta do trimestre. Jurídico revisando contrato.", status: "negociacao" },
      { id: "r8b", product: "atende", value: 14000, plan: "Pro · mensal",        date: "22 mai", message: "Quer pacote com help-desk integrado.", status: "qualificado" },
      { id: "r8c", product: "ledger", value: 9000,  plan: "Starter · mensal",    date: "24 mai", message: "Avaliando faturamento recorrente das unidades.", status: "novo" }
    ],
    interactions: [
      { t: "há 12 dias", who: "Joana V.", kind: "note", body: "Jurídico do cliente revisando contrato master. Sem resposta há quase 2 semanas — acompanhar." }
    ]
  },
  {
    id: "l9", name: "TI", company: "Cluster Verde", role: "Infra",
    email: "ti@cluster.com", phone: "+55 11 95523-7788",
    responsible: "Ricardo L.", stage: "fech", source: "Indicação",
    createdAt: "2026-05-02", lastActivity: "há 4d",
    requests: [
      { id: "r9a", product: "notifly", value: 12000, plan: "Pro · mensal", date: "02 mai", message: "Contrato assinado, em onboarding.", status: "fechado" }
    ],
    interactions: [
      { t: "há 4 dias", who: "Sistema", kind: "email", body: "Contrato assinado. Provisionamento de tenant iniciado." }
    ]
  },
  {
    id: "l10", name: "Patrícia Lemos", company: "Bons Negócios SA", role: "CIO",
    email: "cio@bn.com.br", phone: "+55 11 94410-9087",
    responsible: "Joana V.", stage: "fech", source: "Formulário público",
    createdAt: "2026-04-18", lastActivity: "há 1d",
    requests: [
      { id: "r10a", product: "pontua", value: 28000, plan: "Enterprise · mensal", date: "18 abr", message: "Cliente ativo, expandindo para 3 filiais.", status: "fechado" },
      { id: "r10b", product: "atende", value: 11000, plan: "Pro · mensal",         date: "10 mai", message: "Upsell de suporte aprovado.", status: "fechado" }
    ],
    interactions: [
      { t: "há 1 dia", who: "Joana V.", kind: "call", body: "Renovação confirmada + upsell de Atende para o time de suporte." }
    ]
  },
  {
    id: "l11", name: "Marcos Vaz", company: "Lumen Edu", role: "Coordenador",
    email: "marcos@lumenedu.com", phone: "+55 62 99201-3345",
    responsible: "Marina P.", stage: "perd", source: "Formulário público",
    createdAt: "2026-04-30", lastActivity: "há 22d",
    requests: [
      { id: "r11a", product: "avali", value: 22000, plan: "Pro · mensal", date: "30 abr", message: "Optou por concorrente por questão de preço.", status: "perdido" }
    ],
    interactions: [
      { t: "há 22 dias", who: "Marina P.", kind: "note", body: "Perdido para concorrente. Reavaliar em Q4 — orçamento pode mudar." }
    ]
  },
  {
    id: "l12", name: "Juliana Reis", company: "Cortex Saúde", role: "Gerente de Produto",
    email: "juliana@cortexsaude.com", phone: "+55 11 93388-1102",
    responsible: "Tiago A.", stage: "novo", source: "Formulário público",
    createdAt: "2026-06-16", lastActivity: "há 30min",
    requests: [
      { id: "r12a", product: "notifly", value: 15000, plan: "Pro · mensal", date: "16 jun", message: "Disparos transacionais para app de telemedicina.", status: "novo" }
    ],
    interactions: []
  }
];

// ── helpers ──
const CRM = {
  PRODUCTS: CRM_PRODUCTS,
  PRODUCT_BY_ID,
  RESPONSIBLES,
  DEFAULT_COLUMNS,
  SEED_LEADS,

  fmtBRL(n) {
    if (!n) return "—";
    if (n >= 1000) return "R$ " + (n / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 }) + "k";
    return "R$ " + n.toLocaleString("pt-BR");
  },
  fmtBRLfull(n) {
    return "R$ " + (n || 0).toLocaleString("pt-BR");
  },
  // numeric monthly total of a lead's requests (optionally for one product)
  leadValue(lead, productId) {
    return lead.requests
      .filter(r => !productId || r.product === productId)
      .reduce((s, r) => s + (r.value || 0), 0);
  },
  // distinct products a lead has requested
  leadProducts(lead) {
    return [...new Set(lead.requests.map(r => r.product))];
  },
  initials(name) {
    return name.split(" ").filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase();
  },
  phoneDigits(phone) {
    return (phone || "").replace(/\D/g, "");
  },
  waLink(lead, msg) {
    const d = CRM.phoneDigits(lead.phone);
    const text = encodeURIComponent(msg || `Olá ${lead.name}, aqui é da Crianex. Tudo bem?`);
    return `https://wa.me/${d}?text=${text}`;
  },
  mailLink(lead, subject, body) {
    const s = encodeURIComponent(subject || `Crianex — sobre sua solicitação`);
    const b = encodeURIComponent(body || `Olá ${lead.name},\n\n`);
    return `mailto:${lead.email}?subject=${s}&body=${b}`;
  },
  // CSV export of a flat list of leads (one row per pedido)
  toCSV(leads) {
    const head = ["Empresa", "Contato", "Cargo", "Email", "Telefone", "Estágio", "Responsável", "Origem", "Produto", "Plano", "Valor/mês (R$)", "Status do pedido", "Data", "Criado em"];
    const rows = [head];
    leads.forEach(lead => {
      (lead.requests.length ? lead.requests : [{}]).forEach(r => {
        rows.push([
          lead.company, lead.name, lead.role || "", lead.email, lead.phone,
          lead._colTitle || lead.stage, lead.responsible, lead.source,
          r.product ? CRM.PRODUCT_BY_ID[r.product]?.name : "", r.plan || "",
          r.value || 0, r.status || "", r.date || "", lead.createdAt || ""
        ]);
      });
    });
    return rows.map(r => r.map(c => {
      const s = String(c ?? "");
      return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    }).join(";")).join("\n");
  },
  download(filename, text) {
    const blob = new Blob(["\uFEFF" + text], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  },
  // detect likely duplicates by normalized company name across the lead list
  findDuplicates(leads) {
    const byCompany = {};
    leads.forEach(l => {
      const k = l.company.trim().toLowerCase();
      (byCompany[k] = byCompany[k] || []).push(l);
    });
    return Object.values(byCompany).filter(g => g.length > 1);
  }
};

window.CRM = CRM;
