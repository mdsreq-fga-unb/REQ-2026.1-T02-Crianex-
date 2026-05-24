// Crianex Hub — Data: products, FAQ, copy in PT/EN

const CrxData = {
  products: [
    {
      id: 'avali',
      name: 'Avali',
      cat: { pt: 'Gestão Educacional', en: 'Education Management' },
      color: '#7f3fe5',
      iconText: 'AV',
      tagline: {
        pt: 'Plataforma de avaliações escolares com IA assistida para correção automática.',
        en: 'School assessment platform with AI-assisted automatic grading.',
      },
      lede: {
        pt: 'Crie, aplique e corrija avaliações em escala. O Avali combina banco de questões inteligente, correção automática por IA e analytics longitudinais por turma e por aluno.',
        en: 'Create, deliver and grade assessments at scale. Avali combines a smart question bank, AI grading and longitudinal analytics by class and student.',
      },
      audience: {
        pt: 'Redes de ensino, colégios particulares, sistemas estaduais.',
        en: 'School networks, private K-12 institutions, state systems.',
      },
      stats: [
        { k: { pt: 'Alunos ativos', en: 'Active students' }, v: '42.1K' },
        { k: { pt: 'Avaliações/mês', en: 'Tests / month' }, v: '9.8K' },
        { k: { pt: 'Tempo médio de correção', en: 'Avg. grading time' }, v: '1.2s' },
      ],
      features: [
        {
          title: { pt: 'Banco de questões', en: 'Question bank' },
          desc: {
            pt: 'Mais de 12 mil itens classificados por BNCC, dificuldade e habilidade.',
            en: 'Over 12k items classified by curriculum, difficulty and skill.',
          },
        },
        {
          title: { pt: 'Correção por IA', en: 'AI grading' },
          desc: {
            pt: 'Discursivas avaliadas com modelo fine-tuned e revisão humana opcional.',
            en: 'Essay questions graded by a fine-tuned model with optional human review.',
          },
        },
        {
          title: { pt: 'Analytics longitudinal', en: 'Longitudinal analytics' },
          desc: {
            pt: 'Acompanhe evolução por habilidade, turma e cohort ao longo do ano.',
            en: 'Track growth by skill, class and cohort across the academic year.',
          },
        },
        {
          title: { pt: 'Aplicação multi-canal', en: 'Multi-channel delivery' },
          desc: {
            pt: 'Provas online com lockdown, impressas com leitor óptico, híbridas.',
            en: 'Online (lockdown), printed with OMR readers, or hybrid delivery.',
          },
        },
      ],
    },
    {
      id: 'pontua',
      name: 'Pontua',
      cat: { pt: 'Engajamento & Recompensas', en: 'Engagement & Rewards' },
      color: '#e71f84',
      iconText: 'PN',
      tagline: {
        pt: 'Sistema de gamificação e programas de fidelidade para times comerciais B2B.',
        en: 'Gamification and loyalty programs for B2B sales teams.',
      },
      lede: {
        pt: 'Desenhe missões, metas e leaderboards que conectam comportamento desejado a recompensas reais. Multi-tenant nativo, integra com qualquer CRM via webhook.',
        en: 'Design missions, quotas and leaderboards that tie desired behavior to real rewards. Multi-tenant native, integrates with any CRM via webhook.',
      },
      audience: {
        pt: 'Operações comerciais B2B, distribuidoras, redes de franquia.',
        en: 'B2B sales ops, distributors, franchise networks.',
      },
      stats: [
        { k: { pt: 'Tenants', en: 'Tenants' }, v: '184' },
        { k: { pt: 'Pontos emitidos', en: 'Points issued' }, v: '12.4M' },
        { k: { pt: 'Resgates/mês', en: 'Redemptions / mo' }, v: '3.1K' },
      ],
      features: [
        {
          title: { pt: 'Motor de regras', en: 'Rules engine' },
          desc: {
            pt: 'Construa regras complexas via UI sem código — combinações, multiplicadores, janelas.',
            en: 'Build complex rules visually — combos, multipliers, time windows.',
          },
        },
        {
          title: { pt: 'Catálogo de prêmios', en: 'Reward catalog' },
          desc: {
            pt: 'Vouchers, cashback, gift cards e produtos físicos via parceiros.',
            en: 'Vouchers, cashback, gift cards and physical goods via partners.',
          },
        },
        {
          title: { pt: 'Leaderboards ao vivo', en: 'Live leaderboards' },
          desc: {
            pt: 'Rankings atualizados via WebSocket — sem reload, sem polling.',
            en: 'Rankings updated via WebSocket — no reload, no polling.',
          },
        },
        {
          title: { pt: 'Anti-fraude', en: 'Anti-fraud' },
          desc: {
            pt: 'Detecção de padrões suspeitos com sinalização automática para auditoria.',
            en: 'Suspicious-pattern detection with automatic audit flagging.',
          },
        },
      ],
    },
    {
      id: 'notifly',
      name: 'Notifly',
      cat: { pt: 'Notificações & Mensageria', en: 'Notifications & Messaging' },
      color: '#66df7a',
      iconText: 'NF',
      tagline: {
        pt: 'Orquestrador omnichannel de notificações — push, email, WhatsApp, SMS, in-app.',
        en: 'Omnichannel notification orchestrator — push, email, WhatsApp, SMS, in-app.',
      },
      lede: {
        pt: 'Um único endpoint para enviar mensagens por qualquer canal, com fallback automático, templates internacionalizados, segmentação e analytics de entregabilidade.',
        en: 'A single endpoint to send across any channel, with automatic fallback, i18n templates, segmentation and deliverability analytics.',
      },
      audience: {
        pt: 'Produtos SaaS, fintechs, e-commerce em escala.',
        en: 'SaaS products, fintechs, e-commerce at scale.',
      },
      stats: [
        { k: { pt: 'Mensagens/dia', en: 'Messages / day' }, v: '8.4M' },
        { k: { pt: 'Canais suportados', en: 'Channels' }, v: '11' },
        { k: { pt: 'Taxa de entrega', en: 'Delivery rate' }, v: '99.4%' },
      ],
      features: [
        {
          title: { pt: 'Fallback inteligente', en: 'Smart fallback' },
          desc: {
            pt: 'Se WhatsApp falhar, tenta SMS, depois e-mail — você define a cascata.',
            en: 'If WhatsApp fails, try SMS, then email — you define the cascade.',
          },
        },
        {
          title: { pt: 'Templates i18n', en: 'i18n templates' },
          desc: {
            pt: 'Variáveis, condicionais e versões por idioma em um único template.',
            en: 'Variables, conditionals and per-locale versions in one template.',
          },
        },
        {
          title: { pt: 'Segmentação dinâmica', en: 'Dynamic segments' },
          desc: {
            pt: 'Audiências calculadas em tempo real a partir do seu warehouse.',
            en: 'Audiences computed in real time against your warehouse.',
          },
        },
        {
          title: { pt: 'Webhooks de evento', en: 'Event webhooks' },
          desc: {
            pt: 'Receba sent, delivered, opened, clicked, bounced em tempo real.',
            en: 'Receive sent / delivered / opened / clicked / bounced live.',
          },
        },
      ],
    },
    {
      id: 'trilho',
      name: 'Trilho',
      cat: { pt: 'Onboarding & Treinamento', en: 'Onboarding & Training' },
      color: '#7f3fe5',
      iconText: 'TR',
      tagline: {
        pt: 'Trilhas de aprendizagem corporativa com micro-conteúdo e checkpoints.',
        en: 'Corporate learning paths with micro-content and checkpoints.',
      },
      audience: { pt: 'RH e L&D corporativos.', en: 'Corporate HR & L&D.' },
    },
    {
      id: 'atende',
      name: 'Atende',
      cat: { pt: 'Suporte ao Cliente', en: 'Customer Support' },
      color: '#e71f84',
      iconText: 'AT',
      tagline: {
        pt: 'Help-desk multicanal com IA assistente que sugere respostas baseadas no histórico.',
        en: 'Multichannel help-desk with AI assistant suggesting replies from history.',
      },
      audience: { pt: 'Operações de suporte B2C e B2B.', en: 'B2C and B2B support operations.' },
    },
    {
      id: 'ledger',
      name: 'Ledger',
      cat: { pt: 'Faturamento Recorrente', en: 'Recurring Billing' },
      color: '#66df7a',
      iconText: 'LG',
      tagline: {
        pt: 'Cobrança recorrente para SaaS multi-moeda com dunning, dunning e dunning.',
        en: 'Recurring billing for multi-currency SaaS with dunning.',
      },
      audience: { pt: 'Times de RevOps em SaaS.', en: 'SaaS RevOps teams.' },
    },
  ],

  differentiators: [
    {
      tick: '01',
      title: { pt: 'Kubernetes nativo', en: 'Kubernetes native' },
      desc: {
        pt: 'Toda plataforma roda em clusters K8s próprios com auto-scaling horizontal e isolamento por tenant.',
        en: 'Every platform runs on our own K8s clusters with horizontal auto-scaling and per-tenant isolation.',
      },
      icon: 'k8s',
    },
    {
      tick: '02',
      title: { pt: 'Multi-tenant por design', en: 'Multi-tenant by design' },
      desc: {
        pt: 'Isolamento de dados, configuração e billing por tenant — sem retrabalho a cada novo cliente.',
        en: 'Data, config and billing isolation per tenant — no rework on each new customer.',
      },
      icon: 'tenant',
    },
    {
      tick: '03',
      title: { pt: 'IA aplicada', en: 'Applied AI' },
      desc: {
        pt: 'Modelos próprios fine-tuned para correção, classificação e copilots embarcados no produto.',
        en: 'Fine-tuned in-house models for grading, classification and embedded copilots.',
      },
      icon: 'ai',
    },
    {
      tick: '04',
      title: { pt: 'Tempo real via WebSocket', en: 'Real-time over WebSocket' },
      desc: {
        pt: 'Sincronização cliente-servidor sub-segundo. Sem polling, sem reload, sem stale UI.',
        en: 'Sub-second client-server sync. No polling, no reload, no stale UI.',
      },
      icon: 'ws',
    },
  ],

  values: [
    {
      n: '01',
      title: { pt: 'Engenharia primeiro', en: 'Engineering first' },
      body: {
        pt: 'Investimos em fundação técnica antes de feature. Stack escolhida para durar uma década, não um trimestre.',
        en: 'We invest in foundation before features. A stack chosen to last a decade, not a quarter.',
      },
    },
    {
      n: '02',
      title: { pt: 'Produto, não projeto', en: 'Product, not project' },
      body: {
        pt: 'Construímos plataformas reutilizáveis. Cada cliente herda o aprendizado de todos os anteriores.',
        en: "We build reusable platforms. Every customer inherits every prior customer's learnings.",
      },
    },
    {
      n: '03',
      title: { pt: 'Decisão com dado', en: 'Decisions with data' },
      body: {
        pt: 'Instrumentação desde o dia zero. Cada release tem hipótese mensurável e cutoff de rollback.',
        en: 'Instrumentation from day zero. Every release has a measurable hypothesis and a rollback cutoff.',
      },
    },
  ],

  faqCats: [
    { id: 'geral', label: { pt: 'Geral', en: 'General' }, count: 6 },
    { id: 'avali', label: { pt: 'Avali', en: 'Avali' }, count: 8 },
    { id: 'pontua', label: { pt: 'Pontua', en: 'Pontua' }, count: 5 },
    { id: 'notifly', label: { pt: 'Notifly', en: 'Notifly' }, count: 7 },
    { id: 'billing', label: { pt: 'Faturamento', en: 'Billing' }, count: 4 },
    { id: 'security', label: { pt: 'Segurança', en: 'Security' }, count: 6 },
  ],

  faqs: [
    {
      cat: 'geral',
      q: {
        pt: 'Como funciona a contratação dos produtos Crianex?',
        en: 'How do I subscribe to a Crianex product?',
      },
      a: {
        pt: 'Toda contratação começa por uma conversa de descoberta. Após entender o caso de uso, enviamos uma proposta com escopo, plano de implantação e SLA. O contrato é assinado digitalmente e a provisão do tenant leva 2 a 4 dias úteis.',
        en: 'Every engagement starts with a discovery call. After understanding the use case we send a proposal with scope, rollout plan and SLA. Contracts are signed digitally and tenant provisioning takes 2–4 business days.',
      },
    },
    {
      cat: 'geral',
      q: {
        pt: 'Os produtos podem ser usados em conjunto?',
        en: 'Can multiple products be used together?',
      },
      a: {
        pt: 'Sim. A Crianex usa um único sistema de identidade e billing entre todos os produtos. Eventos de um produto podem disparar fluxos em outro via webhooks internos.',
        en: 'Yes. Crianex shares a single identity and billing system across products. Events in one product can trigger flows in another via internal webhooks.',
      },
    },
    {
      cat: 'avali',
      q: {
        pt: 'A correção por IA substitui o professor?',
        en: 'Does AI grading replace teachers?',
      },
      a: {
        pt: 'Não. O modelo é treinado para gerar uma primeira nota com justificativa por critério, sempre revisável por um humano. Em produção, 78% dos casos são confirmados sem alteração.',
        en: 'No. The model produces an initial score with rationale per rubric, always reviewable by a human. In production, 78% of cases are confirmed unchanged.',
      },
    },
    {
      cat: 'avali',
      q: { pt: 'Vocês cobrem questões discursivas?', en: 'Do you support essay questions?' },
      a: {
        pt: 'Sim, incluindo redações longas com rubrica customizável por instituição. O modelo gera nota e feedback estruturado por competência.',
        en: 'Yes, including long essays with rubrics customizable per institution. The model returns a score plus structured feedback per competency.',
      },
    },
    {
      cat: 'pontua',
      q: { pt: 'Como criar uma regra de pontuação?', en: 'How do I create a scoring rule?' },
      a: {
        pt: 'No painel, vá em Regras → Nova regra. Defina o gatilho (evento de webhook ou ação manual), as condições (campos do payload, janelas de tempo) e o efeito (pontos, multiplicador, badge).',
        en: 'In the dashboard, go to Rules → New rule. Define the trigger (webhook event or manual action), the conditions (payload fields, time windows) and the effect (points, multiplier, badge).',
      },
    },
    {
      cat: 'notifly',
      q: { pt: 'Quais canais o Notifly suporta?', en: 'Which channels does Notifly support?' },
      a: {
        pt: 'Email (SES, SendGrid, Mailgun), SMS (Twilio, Zenvia), WhatsApp (Cloud API), Push (FCM, APNs), Webhook genérico, In-app via WebSocket, Telegram e Slack.',
        en: 'Email (SES, SendGrid, Mailgun), SMS (Twilio, Zenvia), WhatsApp (Cloud API), Push (FCM, APNs), generic webhook, in-app via WebSocket, Telegram and Slack.',
      },
    },
    {
      cat: 'billing',
      q: { pt: 'Qual a forma de cobrança?', en: 'How is billing done?' },
      a: {
        pt: 'Assinatura mensal ou anual por tenant, com pricing escalonado por consumo (alunos ativos, mensagens enviadas, pontos emitidos). Pagamentos via boleto, PIX ou cartão corporativo.',
        en: 'Monthly or annual subscription per tenant, tiered by usage (active students, messages sent, points issued). Payment via bank slip, PIX or corporate card.',
      },
    },
    {
      cat: 'security',
      q: { pt: 'Vocês são compatíveis com LGPD?', en: 'Are you LGPD compliant?' },
      a: {
        pt: 'Sim. Mantemos DPO designado, RIPD por produto, processos de resposta a titulares e contratos de operador padronizados. Dados ficam em data-centers no Brasil quando exigido.',
        en: 'Yes. We have a designated DPO, DPIAs per product, data-subject request processes and standardized processor agreements. Data stays in Brazilian data-centers when required.',
      },
    },
    {
      cat: 'security',
      q: { pt: 'Como funciona o controle de acesso?', en: 'How is access control handled?' },
      a: {
        pt: 'RBAC granular por produto e por tenant, SSO via SAML/OIDC para clientes enterprise, audit log completo e 2FA obrigatório para perfis administrativos.',
        en: 'Granular RBAC per product and tenant, SAML/OIDC SSO for enterprise, full audit log and mandatory 2FA for admin roles.',
      },
    },
  ],

  // Top-level UI strings
  t: {
    nav: {
      products: { pt: 'Produtos', en: 'Products' },
      about: { pt: 'Sobre', en: 'About' },
      faq: { pt: 'FAQ', en: 'FAQ' },
      contact: { pt: 'Contato', en: 'Contact' },
    },
    cta: {
      seeProducts: { pt: 'Ver produtos', en: 'See products' },
      talk: { pt: 'Fale conosco', en: 'Get in touch' },
      learnMore: { pt: 'Saiba mais', en: 'Learn more' },
      back: { pt: 'Voltar', en: 'Back' },
    },
    eyebrow: {
      pt: 'Crianex Hub · Software house B2B',
      en: 'Crianex Hub · B2B software house',
    },
    heroH: {
      pt: ['Plataformas SaaS para times', 'que pensam em', 'década, não em sprint.'],
      en: ['SaaS platforms for teams', 'thinking in', 'decades, not sprints.'],
    },
    heroLede: {
      pt: 'Construímos produtos próprios sobre uma plataforma multi-tenant em Kubernetes — com IA aplicada e tempo real via WebSocket. Cada cliente herda anos de engenharia compartilhada.',
      en: 'We build our own products on a multi-tenant Kubernetes platform — with applied AI and real-time WebSocket. Every customer inherits years of shared engineering.',
    },
    products: {
      eyebrow: { pt: 'Portfólio de produtos', en: 'Product portfolio' },
      title: {
        pt: 'Seis produtos. Uma plataforma. Um time.',
        en: 'Six products. One platform. One team.',
      },
      desc: {
        pt: 'Cada produto resolve um problema vertical, mas todos compartilham identidade, billing, observabilidade e o mesmo cluster K8s. Adicionar o segundo produto é trivial.',
        en: 'Each product solves a vertical problem, but all share identity, billing, observability and the same K8s cluster. Adding the second product is trivial.',
      },
    },
    diff: {
      eyebrow: { pt: 'Stack & diferenciais', en: 'Stack & advantages' },
      title: { pt: 'Onde investimos a engenharia.', en: 'Where engineering is invested.' },
      desc: {
        pt: 'Quatro pilares técnicos compartilhados por todos os produtos — escolhidos para escalar, isolar e durar.',
        en: 'Four shared engineering pillars across products — chosen to scale, isolate and endure.',
      },
    },
    cta2: {
      title: {
        pt: 'Vamos conversar sobre o seu caso de uso.',
        en: "Let's talk about your use case.",
      },
      desc: {
        pt: 'Resposta em até 24h em dias úteis.',
        en: 'Reply within 24h on business days.',
      },
    },
    about: {
      eyebrow: { pt: 'Sobre a Crianex', en: 'About Crianex' },
      h1: {
        pt: 'Software house B2B baseada em São Paulo desde 2019.',
        en: 'A B2B software house based in São Paulo since 2019.',
      },
      lede: {
        pt: 'Começamos como consultoria. Em 2021 paramos de vender hora-homem e passamos a vender produto. Hoje operamos seis SaaS verticais sobre uma plataforma comum em Kubernetes.',
        en: 'We started as a consultancy. In 2021 we stopped selling hours and started selling product. We now run six vertical SaaS on a shared Kubernetes platform.',
      },
      missionEyebrow: { pt: 'Missão, visão, valores', en: 'Mission, vision, values' },
      missionTitle: { pt: 'O que mantém o time alinhado.', en: 'What keeps the team aligned.' },
      stats: [
        { n: '6', l: { pt: 'produtos SaaS em produção', en: 'SaaS products in production' } },
        { n: '184', l: { pt: 'clientes B2B ativos', en: 'active B2B customers' } },
        { n: '28', l: { pt: 'engenheiros & designers', en: 'engineers & designers' } },
        { n: '2019', l: { pt: 'fundada em São Paulo', en: 'founded in São Paulo' } },
      ],
    },
    contact: {
      h1: { pt: 'Vamos conversar.', en: "Let's talk." },
      lede: {
        pt: 'Conte um pouco sobre o seu caso de uso e o produto que te interessa. Respondemos em até 24h úteis.',
        en: 'Tell us a bit about your use case and which product interests you. We reply within 24 business hours.',
      },
      fields: {
        name: { pt: 'Nome completo', en: 'Full name' },
        email: { pt: 'E-mail corporativo', en: 'Work email' },
        company: { pt: 'Empresa', en: 'Company' },
        product: { pt: 'Produto de interesse', en: 'Product of interest' },
        message: { pt: 'Mensagem', en: 'Message' },
      },
      placeholder: {
        name: { pt: 'ex. Marina Pereira', en: 'e.g. Marina Pereira' },
        email: { pt: 'voce@empresa.com', en: 'you@company.com' },
        company: { pt: 'Nome da empresa', en: 'Company name' },
        message: { pt: 'Como podemos ajudar?', en: 'How can we help?' },
      },
      submit: { pt: 'Enviar mensagem', en: 'Send message' },
      hint: { pt: 'Resposta em até 24h úteis', en: 'Reply within 24h biz.' },
      successTitle: { pt: 'Mensagem enviada', en: 'Message sent' },
      successBody: {
        pt: 'Recebemos sua mensagem. Um especialista de produto retorna em até um dia útil.',
        en: 'We got your message. A product specialist will reply within one business day.',
      },
      channels: [
        { k: 'email', v: 'comercial@crianex.com.br' },
        { k: 'linkedin', v: 'linkedin.com/company/crianex' },
        {
          k: 'address',
          v: { pt: 'Av. Paulista, 1842 · São Paulo', en: 'Av. Paulista, 1842 · São Paulo' },
        },
      ],
    },
    faq: {
      h1: { pt: 'Central de ajuda.', en: 'Help center.' },
      lede: {
        pt: 'Encontre respostas por produto ou pesquise direto.',
        en: 'Find answers per product or search directly.',
      },
      search: { pt: 'Buscar artigos…', en: 'Search articles…' },
      helpful: { pt: 'Foi útil?', en: 'Helpful?' },
      yes: { pt: 'Sim', en: 'Yes' },
      no: { pt: 'Não', en: 'No' },
    },
    footer: {
      tag: {
        pt: 'Software house B2B · São Paulo',
        en: 'B2B software house · São Paulo',
      },
      cols: {
        products: { pt: 'Produtos', en: 'Products' },
        company: { pt: 'Empresa', en: 'Company' },
        resources: { pt: 'Recursos', en: 'Resources' },
      },
      links: {
        company: [
          { pt: 'Sobre', en: 'About' },
          { pt: 'Casos', en: 'Case studies' },
          { pt: 'Contato', en: 'Contact' },
          { pt: 'Carreiras', en: 'Careers' },
        ],
        resources: [
          { pt: 'FAQ', en: 'FAQ' },
          { pt: 'Status', en: 'Status' },
          { pt: 'Changelog', en: 'Changelog' },
          { pt: 'LGPD', en: 'Privacy' },
        ],
      },
      copyright: { pt: '© 2026 Crianex Tecnologia Ltda.', en: '© 2026 Crianex Tecnologia Ltda.' },
    },
  },
};

window.CrxData = CrxData;
