import React, {type ReactNode, useState} from 'react';
import {useBaseUrlUtils} from '@docusaurus/useBaseUrl';

type Ev = {t: string; href?: string};
type Cell = {n: number; type: string; ev?: Ev[]};
type Month = {name: string; cells: Cell[]; legend: string[]};

const I1A = 'iteracoes/iteracao-1/atas/';
const I2A = 'iteracoes/iteracao-2/atas/';

const MONTHS: Month[] = [
  {
    name: 'Abril',
    legend: ['facultativo', 'it1', 'entrega', 'apresentacao', 'gravacao', 'feriado', 'outro'],
    cells: [
      {n: 30, type: 'outro'}, {n: 31, type: 'outro'},
      {n: 1, type: 'facultativo'}, {n: 2, type: 'facultativo'},
      {n: 3, type: 'facultativo', ev: [{t: 'Primeiro contato com o cliente'}]},
      {n: 4, type: 'facultativo'}, {n: 5, type: 'facultativo'},
      {n: 6, type: 'facultativo'}, {n: 7, type: 'facultativo'}, {n: 8, type: 'facultativo'},
      {n: 9, type: 'facultativo', ev: [{t: 'Documentação para a U1'}]},
      {n: 10, type: 'facultativo'},
      {n: 11, type: 'gravacao', ev: [{t: 'Gravação Vídeo U1', href: 'entregas/unidade-1'}]},
      {n: 12, type: 'gravacao', ev: [{t: 'Gravação Vídeo U1', href: 'entregas/unidade-1'}]},
      {n: 13, type: 'entrega', ev: [{t: 'Entrega Unidade 1'}]},
      {n: 14, type: 'apresentacao', ev: [{t: 'Apresentações U1'}]},
      {n: 15, type: 'apresentacao', ev: [{t: 'Apresentações U1'}]},
      {n: 16, type: 'apresentacao', ev: [{t: 'Apresentações U1'}]},
      {n: 17, type: 'facultativo', ev: [{t: 'Correções U1', href: I1A + 'ata_compromisso_correcoes'}]},
      {n: 18, type: 'facultativo'}, {n: 19, type: 'facultativo'},
      {n: 20, type: 'facultativo'},
      {n: 21, type: 'feriado', ev: [{t: 'Tiradentes'}]},
      {n: 22, type: 'facultativo', ev: [{t: 'Domain Modeling Workshop'}, {t: 'Iteration Replenishment Macro'}, {t: 'Commitment'}]},
      {n: 23, type: 'facultativo'}, {n: 24, type: 'facultativo'},
      {n: 25, type: 'facultativo', ev: [{t: 'Feature Discovery Session', href: I1A + 'ata_feature_discovery_session'}]},
      {n: 26, type: 'facultativo'},
      {n: 27, type: 'facultativo', ev: [{t: 'Prep IT1'}]},
      {n: 28, type: 'it1', ev: [{t: 'IT1 Início', href: 'iteracoes/iteracao-1'}]},
      {n: 29, type: 'it1', ev: [{t: 'Replenishment Micro', href: I1A + 'ata_replenishment_micro_commitment'}, {t: 'Commitment', href: I1A + 'ata_replenishment_micro_commitment'}]},
      {n: 30, type: 'it1'},
      {n: 1, type: 'outro'}, {n: 2, type: 'outro'}, {n: 3, type: 'outro'},
    ],
  },
  {
    name: 'Maio',
    legend: ['it1', 'entrega', 'apresentacao', 'gravacao', 'feriado', 'outro'],
    cells: [
      {n: 27, type: 'outro'}, {n: 28, type: 'outro'}, {n: 29, type: 'outro'}, {n: 30, type: 'outro'},
      {n: 1, type: 'feriado', ev: [{t: 'Dia do Trabalho'}]},
      {n: 2, type: 'it1'}, {n: 3, type: 'it1'},
      {n: 4, type: 'it1'},
      {n: 5, type: 'it1', ev: [{t: 'Midweek Sync'}]},
      {n: 6, type: 'it1'}, {n: 7, type: 'it1'}, {n: 8, type: 'it1'},
      {n: 9, type: 'it1', ev: [{t: 'Technical Design Review', href: I1A + 'ata_technical_design_review'}]},
      {n: 10, type: 'it1'},
      {n: 11, type: 'it1', ev: [{t: 'Kanban Build (dependências)'}]},
      {n: 12, type: 'it1', ev: [{t: 'Kanban Build (arquitetura)'}]},
      {n: 13, type: 'it1', ev: [{t: 'Kanban Build (Issues GitHub)'}]},
      {n: 14, type: 'it1', ev: [{t: 'Midweek Sync'}]},
      {n: 15, type: 'entrega', ev: [{t: 'Documentação de evidências U2'}]},
      {n: 16, type: 'entrega', ev: [{t: 'Documentação de evidências U2'}]},
      {n: 17, type: 'gravacao', ev: [{t: 'Reajustes finais no Pages'}]},
      {n: 18, type: 'gravacao', ev: [{t: 'Gravação Vídeo U2', href: 'entregas/unidade-2'}]},
      {n: 19, type: 'apresentacao', ev: [{t: 'Apresentações U2'}]},
      {n: 20, type: 'apresentacao', ev: [{t: 'Apresentações U2'}]},
      {n: 21, type: 'apresentacao', ev: [{t: 'Apresentações U2'}]},
      {n: 22, type: 'it1', ev: [{t: 'Kanban Build'}]},
      {n: 23, type: 'it1', ev: [{t: 'Kanban Build'}, {t: 'Partial Client Validation', href: 'iteracoes/iteracao-1/validacao/partial'}]},
      {n: 24, type: 'it1'},
      {n: 25, type: 'it1', ev: [{t: 'Feature Build Consolidation'}, {t: 'Kanban Build'}]},
      {n: 26, type: 'it1', ev: [{t: 'Kanban Build'}, {t: 'Midweek Sync'}, {t: 'Partial Client Validation', href: 'iteracoes/iteracao-1/validacao/partial'}]},
      {n: 27, type: 'it1', ev: [{t: 'Kanban Build'}]},
      {n: 28, type: 'it1', ev: [{t: 'Kanban Build'}, {t: 'Partial Client Validation', href: 'iteracoes/iteracao-1/validacao/partial'}]},
      {n: 29, type: 'it1', ev: [{t: 'Kanban Build'}]},
      {n: 30, type: 'it1', ev: [{t: 'Kanban Build'}, {t: 'Partial Client Validation', href: 'iteracoes/iteracao-1/validacao/partial'}]},
      {n: 31, type: 'it1'},
    ],
  },
  {
    name: 'Junho',
    legend: ['it1', 'it2', 'apresentacao', 'gravacao', 'feriado', 'facultativo', 'outro'],
    cells: [
      {n: 1, type: 'it1', ev: [{t: 'Partial Client Validation', href: 'iteracoes/iteracao-1/validacao/partial'}]},
      {n: 2, type: 'it1'},
      {n: 3, type: 'it1', ev: [{t: 'Formal Client Validation', href: 'iteracoes/iteracao-1/validacao/formal'}]},
      {n: 4, type: 'feriado', ev: [{t: 'Corpus Christi'}]},
      {n: 5, type: 'facultativo', ev: [{t: 'Ponto Facultativo'}]},
      {n: 6, type: 'it1', ev: [{t: 'Iteration Artifact Closure', href: I1A + 'ata_artifact_closure'}]},
      {n: 7, type: 'it1', ev: [{t: 'Fim IT1'}]},
      {n: 8, type: 'it2', ev: [{t: 'IT2 Início', href: 'iteracoes/iteracao-2'}]},
      {n: 9, type: 'it2', ev: [{t: 'Replenishment Micro', href: I2A + 'reuniao_commitment'}, {t: 'Commitment', href: I2A + 'reuniao_commitment'}]},
      {n: 10, type: 'it2'},
      {n: 11, type: 'it2', ev: [{t: 'Technical Design Review', href: I2A + 'reuniao_TDR2'}]},
      {n: 12, type: 'it2'},
      {n: 13, type: 'it2', ev: [{t: 'Documentações para a U3'}]},
      {n: 14, type: 'it2', ev: [{t: 'Documentação para a U3'}]},
      {n: 15, type: 'gravacao', ev: [{t: 'Gravação Vídeo U3', href: 'entregas/unidade-3'}]},
      {n: 16, type: 'apresentacao', ev: [{t: 'Apresentações U3'}]},
      {n: 17, type: 'apresentacao', ev: [{t: 'Apresentações U3'}]},
      {n: 18, type: 'apresentacao', ev: [{t: 'Apresentações U3'}]},
      {n: 19, type: 'it2', ev: [{t: 'Início do Desenvolvimento'}, {t: 'Kanban Build'}]},
      {n: 20, type: 'it2', ev: [{t: 'Kanban Build'}]},
      {n: 21, type: 'it2'},
      {n: 22, type: 'it2', ev: [{t: 'Kanban Build'}]},
      {n: 23, type: 'it2', ev: [{t: 'Kanban Build'}]},
      {n: 24, type: 'it2', ev: [{t: 'Kanban Build'}, {t: 'Midweek Sync'}]},
      {n: 25, type: 'it2', ev: [{t: 'Kanban Build'}]},
      {n: 26, type: 'it2', ev: [{t: 'Feature Build Consolidation'}]},
      {n: 27, type: 'it2', ev: [{t: 'Partial Client Validation'}]},
      {n: 28, type: 'it2', ev: [{t: 'Kanban Build (ajustes finais)'}]},
      {n: 29, type: 'it2', ev: [{t: 'Formal Client Validation', href: 'iteracoes/iteracao-2/validacao/formal'}]},
      {n: 30, type: 'it2', ev: [{t: 'Iteration Artifact Closure', href: 'iteracoes/iteracao-2'}, {t: 'Fim IT2'}]},
      {n: 1, type: 'outro'}, {n: 2, type: 'outro'}, {n: 3, type: 'outro'}, {n: 4, type: 'outro'}, {n: 5, type: 'outro'},
    ],
  },
  {
    name: 'Julho',
    legend: ['entrega', 'apresentacao', 'gravacao', 'semestre', 'outro'],
    cells: [
      {n: 29, type: 'outro'}, {n: 30, type: 'outro'},
      {n: 1, type: 'gravacao', ev: [{t: 'Gravação Vídeo U4', href: 'entregas/unidade-4'}, {t: 'Preparação de Slides'}]},
      {n: 2, type: 'apresentacao', ev: [{t: 'Apresentações U4'}]},
      {n: 3, type: 'apresentacao', ev: [{t: 'Apresentações U4'}]},
      {n: 4, type: 'apresentacao', ev: [{t: 'Apresentações U4'}]},
      {n: 5, type: 'apresentacao', ev: [{t: 'Apresentações U4'}]},
      {n: 6, type: 'apresentacao', ev: [{t: 'Apresentações U4'}]},
      {n: 7, type: 'apresentacao', ev: [{t: 'Apresentações U4'}]},
      {n: 8, type: 'apresentacao', ev: [{t: 'Apresentações U4'}]},
      {n: 9, type: 'apresentacao', ev: [{t: 'Apresentações U4'}, {t: 'Fim Unidade 4'}]},
      {n: 10, type: 'vazio'}, {n: 11, type: 'vazio'}, {n: 12, type: 'vazio'},
      {n: 13, type: 'vazio'},
      {n: 14, type: 'entrega', ev: [{t: 'Prova Final da Disciplina'}]},
      {n: 15, type: 'vazio'}, {n: 16, type: 'vazio'}, {n: 17, type: 'vazio'},
      {n: 18, type: 'semestre', ev: [{t: 'Fim de Semestre'}]},
      {n: 19, type: 'vazio'},
      {n: 20, type: 'vazio'}, {n: 21, type: 'vazio'}, {n: 22, type: 'vazio'},
      {n: 23, type: 'vazio'}, {n: 24, type: 'vazio'}, {n: 25, type: 'vazio'}, {n: 26, type: 'vazio'},
    ],
  },
];

const LEGEND_LABEL: Record<string, string> = {
  pre: 'Pré-IT1 (setup)',
  it1: 'IT1 — Vitrine Pública',
  it2: 'IT2 — Lead Capture',
  it3: 'IT3 — Núcleo Operacional',
  entrega: 'Entrega (disciplina)',
  apresentacao: 'Apresentações',
  gravacao: 'Gravação de Vídeo',
  feriado: 'Feriado',
  facultativo: 'Ponto Facultativo',
  semestre: 'Fim de Semestre',
  outro: 'Fora do mês',
};

const WEEKDAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

export default function ProjectCalendar(): ReactNode {
  const [active, setActive] = useState(2); // Junho (mês corrente do projeto)
  const {withBaseUrl} = useBaseUrlUtils();
  const month = MONTHS[active];

  return (
    <div>
      <div className="crianex-cal-months">
        {MONTHS.map((m, i) => (
          <button
            key={m.name}
            className={`crianex-cal-month-btn${i === active ? ' is-active' : ''}`}
            onClick={() => setActive(i)}
          >
            {m.name}
          </button>
        ))}
      </div>

      <div className="calendar-legend">
        {month.legend.map((l) => (
          <div className="legend-item" key={l}>
            <span className={`legend-color lc-${l}`} /> {LEGEND_LABEL[l]}
          </div>
        ))}
      </div>

      <div className="crianex-cal-scroll">
        <div className="crianex-calendar">
          {WEEKDAYS.map((d) => (
            <div className="cc-cell cc-header" key={d}>{d}</div>
          ))}
          {month.cells.map((c, idx) => (
            <div className={`cc-cell cc-${c.type}`} key={idx}>
              <span className="cc-num">{c.n}</span>
              {c.ev?.map((e, j) => (
                <span className="cc-event" key={j}>
                  {e.href ? <a href={withBaseUrl(e.href)}>{e.t}</a> : e.t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
