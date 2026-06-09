-- Remove produtos de demonstração e insere os produtos reais da Crianex
-- Fonte: https://crianex.com/pt-BR

DELETE FROM public.products;

INSERT INTO public.products
  (name_pt, name_en, slug, tagline_pt, tagline_en, description_pt, description_en,
   category_pt, category_en, product_url, published, display_order)
VALUES
  (
    'Avali', 'Avali', 'avali',
    'Correção Automatizada de Provas',
    'Automated Test Correction',
    'Plataforma full-stack para correção automatizada de provas com detecção OMR via OpenCV, extração com IA e processamento em tempo real via WebSocket. Multi-tenant, com app desktop de digitalização e relatórios instantâneos.',
    'Full-stack platform for automated test correction with OMR detection via OpenCV, AI-powered extraction and real-time WebSocket processing. Multi-tenant, with a desktop scanning app and instant reports.',
    'Visão Computacional', 'Computer Vision',
    'https://avali.crianex.com',
    true, 1
  ),
  (
    'Pontua', 'Pontua', 'pontua',
    'Plataforma de Avaliação PBL',
    'PBL Assessment Platform',
    'Plataforma web para avaliações em programas de Aprendizagem Baseada em Problemas. Critérios configuráveis, avaliação por pares e por instrutores, templates reutilizáveis, controle de acesso por função, exportação CSV e suporte a múltiplas instituições.',
    'Web platform for assessments in Problem-Based Learning programs. Configurable criteria, peer and instructor assessments, reusable templates, role-based access control, CSV export and multi-institution support.',
    'Educação', 'Education',
    'https://pontua.crianex.com',
    true, 2
  ),
  (
    'Notifly', 'Notifly', 'notifly',
    'Notificações como Serviço',
    'Notifications as a Service',
    'Plataforma universal de notificações push para empresas sem apps nativos. API REST simples, app mobile multiplataforma em Flutter, gerenciamento de canais e tópicos, notificações ricas com deep links, analytics em tempo real e billing por uso via Stripe.',
    'Universal push notification platform for companies without native apps. Simple REST API, cross-platform Flutter mobile app, channel and topic management, rich notifications with deep links, real-time analytics and usage-based Stripe billing.',
    'Comunicação', 'Communication',
    'https://notifly.crianex.com',
    true, 3
  );
