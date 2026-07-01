import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Crianex Hub',
  tagline: 'Plataforma de Gestão e Portfólio de Projetos SaaS',
  favicon: 'img/logo.png',

  url: 'https://mdsreq-fga-unb.github.io',
  baseUrl: '/REQ-2026.1-T02-Crianex-/',

  organizationName: 'mdsreq-fga-unb',
  projectName: 'REQ-2026.1-T02-Crianex-',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  // Âncoras inline (<a id="cp1"/>, #f09 …) funcionam em runtime mas não são
  // indexadas pelo checker estático do Docusaurus — evita falsos-positivos.
  onBrokenAnchors: 'ignore',

  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR'],
  },

  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

  clientModules: [require.resolve('./src/clientModules/mermaidLightbox.js')],

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: undefined,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/logo.png',
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    docs: {
      sidebar: {
        // Permite minimizar/retrair a sidebar (botão na base). Começa sempre aberta.
        hideable: true,
        autoCollapseCategories: false,
      },
    },
    navbar: {
      title: 'Crianex Hub',
      logo: {
        alt: 'Crianex',
        src: 'img/logo.png',
      },
      items: [
        {type: 'doc', docId: 'index', label: 'Home', position: 'left'},
        {
          type: 'dropdown',
          label: 'Visão de Produto',
          position: 'left',
          items: [
            {type: 'doc', docId: 'visao/cenario', label: 'Cenário'},
            {type: 'doc', docId: 'visao/solucao', label: 'Solução'},
            {type: 'doc', docId: 'visao/estrategias', label: 'Estratégias'},
            {type: 'doc', docId: 'visao/er', label: 'Eng. de Requisitos'},
            {type: 'doc', docId: 'visao/equipe', label: 'Equipe'},
            {type: 'doc', docId: 'visao/cadencia', label: 'Cadência de Cerimônias'},
            {type: 'doc', docId: 'visao/dor-dod', label: 'DoR e DoD'},
          ],
        },
        {type: 'doc', docId: 'visao/cronograma', label: 'Cronograma', position: 'left'},
        {
          type: 'dropdown',
          label: 'Funcionalidades',
          position: 'left',
          items: [
            {type: 'doc', docId: 'backlog/rastreabilidade', label: 'Rastreabilidade'},
            {type: 'doc', docId: 'backlog/requisitos', label: 'Tabela de Requisitos'},
            {type: 'doc', docId: 'backlog/priorizacao', label: 'Priorização'},
            {type: 'doc', docId: 'backlog/dependencias', label: 'Dependências'},
            {type: 'doc', docId: 'arquitetura/index', label: 'Arquitetura'},
          ],
        },
        {type: 'doc', docId: 'iteracoes/index', label: 'Evidências', position: 'left'},
        {type: 'doc', docId: 'entregas/index', label: 'Entregas', position: 'left'},
        {
          href: 'https://github.com/mdsreq-fga-unb/REQ-2026.1-T02-Crianex-',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentação',
          items: [
            {label: 'Cenário', to: '/visao/cenario'},
            {label: 'Solução', to: '/visao/solucao'},
            {label: 'Cronograma', to: '/visao/cronograma'},
          ],
        },
        {
          title: 'Requisitos',
          items: [
            {label: 'Rastreabilidade', to: '/backlog/rastreabilidade'},
            {label: 'Tabela de Requisitos', to: '/backlog/requisitos'},
            {label: 'Priorização', to: '/backlog/priorizacao'},
          ],
        },
        {
          title: 'Mais',
          items: [
            {label: 'Evidências', to: '/iteracoes/'},
            {label: 'Entregas', to: '/entregas/'},
            {label: 'GitHub', href: 'https://github.com/mdsreq-fga-unb/REQ-2026.1-T02-Crianex-'},
          ],
        },
      ],
      copyright: `Crianex Hub · Equipe Crianex · REQ-2026.1-T02 · UnB`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    mermaid: {
      theme: {light: 'neutral', dark: 'dark'},
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
