import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  main: [
    'index',
    {
      type: 'category',
      label: 'Visão de Produto',
      collapsed: false,
      items: [
        'visao/cenario',
        'visao/solucao',
        'visao/estrategias',
        'visao/er',
        'visao/equipe',
        'visao/cadencia',
        'visao/dor-dod',
        {
          type: 'category',
          label: 'Lições Aprendidas',
          items: [
            'visao/licoes/unidade-1',
            'visao/licoes/unidade-2',
            'visao/licoes/unidade-3',
          ],
        },
      ],
    },
    'visao/cronograma',
    {
      type: 'category',
      label: 'Funcionalidades',
      collapsed: false,
      items: [
        'backlog/rastreabilidade',
        'backlog/requisitos',
        'backlog/priorizacao',
        'backlog/priorizacao-tabela',
        'backlog/dependencias',
        'arquitetura/index',
      ],
    },
    {
      type: 'category',
      label: 'Evidências',
      items: [
        'iteracoes/index',
        {
          type: 'category',
          label: 'Unidade 1',
          items: [
            'iteracoes/unidade-1/index',
            'iteracoes/unidade-1/atas/2026-04-09',
            'iteracoes/unidade-1/atas/2026-04-22',
          ],
        },
        {
          type: 'category',
          label: 'IT1 — Vitrine Pública',
          items: [
            'iteracoes/iteracao-1/index',
            {
              type: 'category',
              label: 'Features (Evidências)',
              items: [
                'iteracoes/iteracao-1/features/f09',
                'iteracoes/iteracao-1/features/f10',
                'iteracoes/iteracao-1/features/f11',
                'iteracoes/iteracao-1/features/f12',
                'iteracoes/iteracao-1/features/f13',
                'iteracoes/iteracao-1/features/f14',
                'iteracoes/iteracao-1/features/f15',
                'iteracoes/iteracao-1/features/f16',
                'iteracoes/iteracao-1/features/f17',
                'iteracoes/iteracao-1/features/f18',
              ],
            },
            'iteracoes/iteracao-1/evidencias/design-tecnico',
            'iteracoes/iteracao-1/evidencias/diagrama-formal',
            'iteracoes/iteracao-1/evidencias/prototipo',
            'iteracoes/iteracao-1/validacao/partial',
            'iteracoes/iteracao-1/validacao/formal',
            'iteracoes/iteracao-1/vv',
            {
              type: 'category',
              label: 'Atas de Reunião',
              items: [
                'iteracoes/iteracao-1/atas/ata_compromisso_correcoes',
                'iteracoes/iteracao-1/atas/ata_replenishment_micro_commitment',
                'iteracoes/iteracao-1/atas/ata_feature_discovery_session',
                'iteracoes/iteracao-1/atas/ata_refinamento_requisitos',
                'iteracoes/iteracao-1/atas/ata_technical_design_review',
                'iteracoes/iteracao-1/atas/ata_artifact_closure',
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'IT2 — Lead Capture',
          items: [
            'iteracoes/iteracao-2/index',
            {
              type: 'category',
              label: 'Features (Evidências)',
              items: [
                'iteracoes/iteracao-2/features/f19',
                'iteracoes/iteracao-2/features/f20',
                'iteracoes/iteracao-2/features/f21',
                'iteracoes/iteracao-2/features/f07',
                'iteracoes/iteracao-2/features/f08',
                'iteracoes/iteracao-2/features/f22',
                'iteracoes/iteracao-2/features/f23',
              ],
            },
            'iteracoes/iteracao-2/evidencias/design-tecnico',
            'iteracoes/iteracao-2/evidencias/diagrama-formal',
            'iteracoes/iteracao-2/evidencias/prototipo',
            'iteracoes/iteracao-2/validacao/partial',
            'iteracoes/iteracao-2/validacao/formal',
            'iteracoes/iteracao-2/vv',
            {
              type: 'category',
              label: 'Atas de Reunião',
              items: [
                'iteracoes/iteracao-2/atas/reuniao_commitment',
                'iteracoes/iteracao-2/atas/reuniao_TDR2',
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'IT3 — Núcleo Operacional',
          items: ['iteracoes/iteracao-3/index'],
        },
      ],
    },
    {
      type: 'category',
      label: 'Entregas',
      items: [
        'entregas/index',
        'entregas/unidade-1',
        'entregas/unidade-2',
        'entregas/unidade-3',
        'entregas/unidade-4',
      ],
    },
    'referencias',
  ],
};

export default sidebars;
