export type AvailableLang = 'pt' | 'en';

export type HomeProduct = {
  slug: string;
  name_pt: string;
  name_en: string | null;
  tagline_pt: string | null;
  tagline_en: string | null;
  category_pt: string | null;
  category_en: string | null;
  image_url: string | null;
  product_url: string | null;
};

export const ACCENT_COLORS = ['#7f3fe5', '#e71f84', '#66df7a'] as const;

export function accentForIndex(i: number): string {
  // módulo garante índice sempre válido; cast necessário pois TS infere undefined em arrays const
  return ACCENT_COLORS[i % ACCENT_COLORS.length] as string;
}

export function resolveField(
  ptVal: string | null,
  enVal: string | null,
  lang: AvailableLang
): string {
  if (lang === 'en') return enVal || ptVal || '';
  return ptVal || enVal || '';
}

export const t = {
  eyebrow: { pt: 'Crianex Hub · Software house B2B', en: 'Crianex Hub · B2B software house' },
  h1Parts: {
    pt: ['Plataformas SaaS para times', 'que pensam em', 'décadas, não em sprints.'],
    en: ['SaaS platforms for teams', 'thinking in', 'decades, not sprints.'],
  },
  lede: {
    pt: 'Construímos produtos próprios sobre uma plataforma multi-tenant em Kubernetes — com IA aplicada e tempo real via WebSocket. Cada cliente herda anos de engenharia compartilhada.',
    en: 'We build our own products on a multi-tenant Kubernetes platform — with applied AI and real-time WebSocket. Every customer inherits years of shared engineering.',
  },
  ctaPrimary: { pt: 'Fale conosco', en: 'Get in touch' },
  ctaSecondary: { pt: 'Ver produtos', en: 'See products' },
  statsProducts: { pt: 'Produtos', en: 'Products' },
  statsClients: { pt: 'Clientes B2B', en: 'B2B clients' },
  statsUptime: { pt: 'Uptime 12 meses', en: '12-mo uptime' },
  productsEyebrow: { pt: 'Portfólio de produtos', en: 'Product portfolio' },
  productsTitle: {
    pt: 'Três produtos. Uma plataforma. Um time.',
    en: 'Three products. One platform. One team.',
  },
  productsDesc: {
    pt: 'Cada produto resolve um problema vertical, mas todos compartilham identidade, billing, observabilidade e o mesmo cluster K8s. Adicionar o segundo produto é trivial.',
    en: 'Each product solves a vertical problem, but all share identity, billing, observability and the same K8s cluster. Adding the second product is trivial.',
  },
  learnMore: { pt: 'Saiba mais', en: 'Learn more' },
  seeAllProducts: { pt: 'Ver todos os produtos', en: 'See all products' },
  diffEyebrow: { pt: 'Stack & diferenciais', en: 'Stack & advantages' },
  diffTitle: { pt: 'Onde investimos a engenharia.', en: 'Where engineering is invested.' },
  diffDesc: {
    pt: 'Quatro pilares técnicos compartilhados por todos os produtos — escolhidos para escalar, isolar e durar.',
    en: 'Four shared engineering pillars across products — chosen to scale, isolate and endure.',
  },
  ctaBannerTitle: {
    pt: 'Vamos conversar sobre o seu caso de uso.',
    en: "Let's talk about your use case.",
  },
  ctaBannerDesc: {
    pt: 'Resposta em até 24h em dias úteis.',
    en: 'Reply within 24h on business days.',
  },
  ctaBannerBtn: { pt: 'Fale conosco', en: 'Get in touch' },
  ctaBannerSecondary: { pt: 'Sobre a Crianex', en: 'About Crianex' },
};

export const differentiators = [
  {
    tick: '01',
    title: { pt: 'Kubernetes nativo', en: 'Kubernetes native' },
    desc: {
      pt: 'Toda plataforma roda em clusters K8s próprios com auto-scaling horizontal e isolamento por tenant.',
      en: 'Every platform runs on our own K8s clusters with horizontal auto-scaling and per-tenant isolation.',
    },
  },
  {
    tick: '02',
    title: { pt: 'Multi-tenant por design', en: 'Multi-tenant by design' },
    desc: {
      pt: 'Isolamento de dados, configuração e billing por tenant — sem retrabalho a cada novo cliente.',
      en: 'Data, config and billing isolation per tenant — no rework on each new customer.',
    },
  },
  {
    tick: '03',
    title: { pt: 'IA aplicada', en: 'Applied AI' },
    desc: {
      pt: 'Modelos próprios fine-tuned para correção, classificação e copilots embarcados no produto.',
      en: 'Fine-tuned in-house models for grading, classification and embedded copilots.',
    },
  },
  {
    tick: '04',
    title: { pt: 'Tempo real via WebSocket', en: 'Real-time over WebSocket' },
    desc: {
      pt: 'Sincronização cliente-servidor sub-segundo. Sem polling, sem reload, sem stale UI.',
      en: 'Sub-second client-server sync. No polling, no reload, no stale UI.',
    },
  },
];
