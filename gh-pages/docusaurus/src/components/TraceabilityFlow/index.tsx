import React, {type ReactNode, useCallback} from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {useBaseUrlUtils} from '@docusaurus/useBaseUrl';

/* ----------------------------------------------------------------
   Matriz de rastreabilidade interativa (React Flow)
   OE → CP → Feature → RF  +  seção independente de RNFs.
   Clique:
     OE/CP   → /visao/solucao
     Feature → página dedicada da feature (IT1) ou tabela de req.
     RF/RNF  → página dedicada da feature com a aba correta
   ---------------------------------------------------------------- */

interface FeatureDef {id: string; label: string; rfs: string[]}
interface CPDef {id: string; label: string; features: FeatureDef[]}
interface OEDef {id: string; label: string; color: string; cpColor: string; border: string; cps: CPDef[]}
interface RnfDef {id: string; label: string; href: string}

const f = (id: string, label: string, rfs: string[]): FeatureDef => ({id, label, rfs});

/* Features com página dedicada (IT1) e o path da página */
const IT1_FEATURE_PATHS: Record<string, string> = {
  F09: '/iteracoes/iteracao-1/features/f09',
  F10: '/iteracoes/iteracao-1/features/f10',
  F11: '/iteracoes/iteracao-1/features/f11',
  F12: '/iteracoes/iteracao-1/features/f12',
  F13: '/iteracoes/iteracao-1/features/f13',
  F14: '/iteracoes/iteracao-1/features/f14',
  F15: '/iteracoes/iteracao-1/features/f15',
  F16: '/iteracoes/iteracao-1/features/f16',
  F17: '/iteracoes/iteracao-1/features/f17',
  F18: '/iteracoes/iteracao-1/features/f18',
};

/* RFs da IT1 → feature pai (para redirecionar para a página correta) */
const RF_TO_FEATURE: Record<string, string> = {
  RF08: 'F09', RF09: 'F09',
  RF10: 'F10', RF48: 'F10',
  RF11: 'F11', RF12: 'F11', RF13: 'F11', RF14: 'F11',
  RF21: 'F12', RF22: 'F12', RF23: 'F12', RF24: 'F12',
  RF25: 'F13', RF26: 'F13',
  RF27: 'F14', RF49: 'F14',
  RF50: 'F15', RF51: 'F15',
  RF28: 'F16', RF29: 'F16', RF30: 'F16', RF31: 'F16',
  RF32: 'F17', RF33: 'F17',
  RF34: 'F18', RF52: 'F18',
};

function featureHref(featId: string): string {
  return IT1_FEATURE_PATHS[featId] ?? `/backlog/requisitos#${featId.toLowerCase()}`;
}

function rfHref(rfId: string): string {
  const feat = RF_TO_FEATURE[rfId];
  if (feat && IT1_FEATURE_PATHS[feat]) {
    return `${IT1_FEATURE_PATHS[feat]}?tab=${rfId.toLowerCase()}`;
  }
  return '/backlog/requisitos';
}

export const TREE: OEDef[] = [
  {
    id: 'OE1', label: 'Gestão operacional', color: '#dbeafe', cpColor: '#e0e7ff', border: '#4338ca',
    cps: [
      {id: 'CP2', label: 'Logs e Monitoramento', features: [
        f('F01', 'Eventos de segurança', ['RF01', 'RF02']),
        f('F02', 'Estado dos componentes', ['RF03', 'RF54']),
      ]},
      {id: 'CP3', label: 'Dashboard Executivo', features: [
        f('F03', 'Indicadores operacionais', ['RF04', 'RF05', 'RF06']),
        f('F04', 'Indicadores financeiros', ['RF07', 'RF55']),
      ]},
      {id: 'CP7', label: 'Faturamento', features: [
        f('F05', 'Registros financeiros', ['RF16', 'RF17', 'RF18']),
        f('F06', 'Relatórios financeiros', ['RF19', 'RF20']),
      ]},
    ],
  },
  {
    id: 'OE2', label: 'Visibilidade B2B', color: '#dcfce7', cpColor: '#d1fae5', border: '#059669',
    cps: [
      {id: 'CP4', label: 'Vitrine Pública', features: [
        f('F12', 'Produtos SaaS', ['RF21', 'RF22', 'RF23', 'RF24']),
        f('F13', 'Publicação de produto', ['RF25', 'RF26']),
        f('F14', 'Canais de contato', ['RF27', 'RF49']),
        f('F15', 'Info institucional', ['RF50', 'RF51']),
      ]},
      {id: 'CP5', label: 'Painel do Admin', features: [
        f('F09', 'Autenticar', ['RF08', 'RF09']),
        f('F10', 'Acessar painel', ['RF10', 'RF48']),
        f('F11', 'Gerenciar usuários', ['RF11', 'RF12', 'RF13', 'RF14']),
      ]},
      {id: 'CP6', label: 'FAQ', features: [
        f('F16', 'Artigos de FAQ', ['RF28', 'RF29', 'RF30', 'RF31']),
        f('F17', 'Publicação de FAQ', ['RF32', 'RF33']),
        f('F18', 'Avaliação de FAQ', ['RF34', 'RF52']),
      ]},
    ],
  },
  {
    id: 'OE3', label: 'Leads e clientes', color: '#fce7f3', cpColor: '#fbcfe8', border: '#db2777',
    cps: [
      {id: 'CP1', label: 'CRM Kanban', features: [
        f('F19', 'Clientes e leads', ['RF35', 'RF36', 'RF37', 'RF41']),
        f('F20', 'Colunas do funil', ['RF38', 'RF39', 'RF40']),
        f('F21', 'Interações comerciais', ['RF42', 'RF53', 'RF59']),
      ]},
      {id: 'CP8', label: 'Tickets de Suporte', features: [
        f('F22', 'Acessar tickets', ['RF43', 'RF58']),
        f('F23', 'Gerenciar tickets', ['RF44', 'RF45']),
      ]},
      {id: 'CP9', label: 'Notificações', features: [
        f('F07', 'Histórico de notif.', ['RF46', 'RF47']),
        f('F08', 'Templates de notif.', ['RF15', 'RF56', 'RF57']),
      ]},
    ],
  },
];

/* ── RNFs — seção independente ─────────────────────────────────── */
/* href = feature page com ?tab=rnfNN quando existe aba dedicada,
   ou /backlog/requisitos#rnfs para RNFs gerais sem página de feature. */
const RNFS: RnfDef[] = [
  {id: 'RNF01', label: 'RNF01 · Isolamento admin',    href: '/iteracoes/iteracao-1/features/f09?tab=rnf01'},
  {id: 'RNF02', label: 'RNF02 · Tempo vitrine',       href: '/iteracoes/iteracao-1/features/f14?tab=rnf02'},
  {id: 'RNF03', label: 'RNF03 · Tempo adm.',          href: '/iteracoes/iteracao-1/features/f09?tab=rnf03'},
  {id: 'RNF04', label: 'RNF04 · SSR vitrine',         href: '/iteracoes/iteracao-1/features/f12?tab=rnf04'},
  {id: 'RNF05', label: 'RNF05 · SEO',                 href: '/iteracoes/iteracao-1/features/f12?tab=rnf05'},
  {id: 'RNF07', label: 'RNF07 · OWASP Top 10',        href: '/backlog/requisitos#rnfs'},
  {id: 'RNF08', label: 'RNF08 · Criptografia',        href: '/iteracoes/iteracao-1/features/f09?tab=rnf08'},
  {id: 'RNF09', label: 'RNF09 · RLS por linha',       href: '/iteracoes/iteracao-1/features/f10?tab=rnf09'},
  {id: 'RNF10', label: 'RNF10 · Rate limit form.',    href: '/iteracoes/iteracao-1/features/f14?tab=rnf10'},
  {id: 'RNF11', label: 'RNF11 · Conformidade LGPD',   href: '/iteracoes/iteracao-1/features/f14?tab=rnf11'},
  {id: 'RNF12', label: 'RNF12 · Responsividade',      href: '/backlog/requisitos#rnfs'},
  {id: 'RNF13', label: 'RNF13 · Bilinguismo',         href: '/iteracoes/iteracao-1/features/f12?tab=rnf13'},
  {id: 'RNF14', label: 'RNF14 · Escalabilidade',      href: '/backlog/requisitos#rnfs'},
  {id: 'RNF15', label: 'RNF15 · Carga concorrente',   href: '/backlog/requisitos#rnfs'},
  {id: 'RNF16', label: 'RNF16 · Stack obrigatório',   href: '/backlog/requisitos#rnfs'},
  {id: 'RNF17', label: 'RNF17 · Cobertura testes',    href: '/backlog/requisitos#rnfs'},
  {id: 'RNF18', label: 'RNF18 · Portabilidade',       href: '/backlog/requisitos#rnfs'},
  {id: 'RNF19', label: 'RNF19 · Navegação intuitiva', href: '/iteracoes/iteracao-1/features/f12?tab=rnf19'},
  {id: 'RNF20', label: 'RNF20 · Disponibilidade',     href: '/iteracoes/iteracao-1/features/f15?tab=rnf20'},
  {id: 'RNF21', label: 'RNF21 · Drag-drop cards',     href: '/backlog/requisitos#rnfs'},
  {id: 'RNF22', label: 'RNF22 · Drag-drop colunas',   href: '/backlog/requisitos#rnfs'},
  {id: 'RNF23', label: 'RNF23 · Resumo tickets',      href: '/backlog/requisitos#rnfs'},
  {id: 'RNF24', label: 'RNF24 · Cards CRM',           href: '/backlog/requisitos#rnfs'},
  {id: 'RNF25', label: 'RNF25 · Drag-drop CRM',       href: '/backlog/requisitos#rnfs'},
];

const X_PROB = -320;
const X_OE = 0;
const X_CP = 230;
const X_F = 470;
const X_RF = 760;
const ROW_H = 44;

/* RNF grid settings */
const RNF_COLS = 5;
const RNF_NODE_W = 130;
const RNF_COL_GAP = 20;
const RNF_ROW_H = 52;
/* x start — center the grid roughly on the main tree */
const RNF_X_START = (X_PROB + X_RF + 64) / 2 - ((RNF_COLS * (RNF_NODE_W + RNF_COL_GAP)) / 2);
const RNF_SECTION_LABEL_H = 36;

// RFs concluídos (entregues na IT1)
const RF_DONE = new Set([
  'rf08', 'rf09', 'rf10', 'rf11', 'rf12', 'rf13', 'rf14', 'rf21', 'rf22', 'rf23',
  'rf24', 'rf25', 'rf26', 'rf27', 'rf28', 'rf29', 'rf30', 'rf31', 'rf32', 'rf33',
  'rf34', 'rf48', 'rf49', 'rf50', 'rf51', 'rf52',
]);

function compColor(done: number, total: number) {
  if (total > 0 && done === total) return {bg: '#dcfce7', border: '#16a34a', text: '#14532d'};
  if (done === 0) return {bg: '#fee2e2', border: '#dc2626', text: '#7f1d1d'};
  return {bg: '#fef9c3', border: '#ca8a04', text: '#713f12'};
}

function buildGraph() {
  const nodes: any[] = [];
  const edges: any[] = [];
  const oeYs: number[] = [];
  let rfRow = 0;
  let gDone = 0;
  let gTotal = 0;

  for (const oe of TREE) {
    const oeRows: number[] = [];
    let oeDone = 0;
    let oeTotal = 0;

    for (const cp of oe.cps) {
      const cpRows: number[] = [];
      let cpDone = 0;
      let cpTotal = 0;

      for (const feat of cp.features) {
        const featRfRows: number[] = [];
        let featDone = 0;

        for (const rf of feat.rfs) {
          const done = RF_DONE.has(rf.toLowerCase());
          if (done) featDone++;
          const y = rfRow * ROW_H;
          featRfRows.push(rfRow);
          cpRows.push(rfRow);
          oeRows.push(rfRow);
          const c = compColor(done ? 1 : 0, 1);
          nodes.push({
            id: `${feat.id}-${rf}`,
            position: {x: X_RF, y},
            sourcePosition: 'right', targetPosition: 'left',
            data: {label: rf, href: rfHref(rf)},
            style: {
              width: 64, fontSize: 9.5, padding: '3px 4px', textAlign: 'center',
              background: c.bg, border: `1px solid ${c.border}`, borderRadius: 6, color: c.text,
              cursor: 'pointer',
            },
          });
          edges.push({
            id: `e-${feat.id}-${rf}`, source: feat.id, target: `${feat.id}-${rf}`,
            style: {stroke: oe.border, strokeWidth: 0.8, opacity: 0.5},
          });
          rfRow++;
        }

        const featTotal = feat.rfs.length;
        cpDone += featDone;
        cpTotal += featTotal;
        const fc = compColor(featDone, featTotal);
        const fy = (Math.min(...featRfRows) + Math.max(...featRfRows)) / 2 * ROW_H;
        nodes.push({
          id: feat.id,
          position: {x: X_F, y: fy},
          sourcePosition: 'right', targetPosition: 'left',
          data: {label: `${feat.id} · ${feat.label}`, href: featureHref(feat.id)},
          style: {
            width: 180, fontSize: 11, padding: '6px 8px', textAlign: 'left',
            background: fc.bg, border: `1.4px solid ${fc.border}`, borderRadius: 8, color: fc.text,
            cursor: 'pointer',
          },
        });
        edges.push({id: `e-${cp.id}-${feat.id}`, source: cp.id, target: feat.id, style: {stroke: oe.border, strokeWidth: 1.2}});
      }

      oeDone += cpDone;
      oeTotal += cpTotal;
      const cc = compColor(cpDone, cpTotal);
      const cy = (Math.min(...cpRows) + Math.max(...cpRows)) / 2 * ROW_H;
      nodes.push({
        id: cp.id,
        position: {x: X_CP, y: cy},
        sourcePosition: 'right', targetPosition: 'left',
        data: {label: `${cp.id} · ${cp.label}`, href: `/visao/solucao#${cp.id.toLowerCase()}`},
        style: {
          width: 185, fontSize: 12, fontWeight: 600, padding: '8px 10px',
          background: cc.bg, border: `1.5px solid ${cc.border}`, borderRadius: 10, color: cc.text,
          cursor: 'pointer',
        },
      });
      edges.push({id: `e-${oe.id}-${cp.id}`, source: oe.id, target: cp.id, style: {stroke: oe.border, strokeWidth: 1.6}});
    }

    gDone += oeDone;
    gTotal += oeTotal;
    const oc = compColor(oeDone, oeTotal);
    const oy = (Math.min(...oeRows) + Math.max(...oeRows)) / 2 * ROW_H;
    nodes.push({
      id: oe.id,
      position: {x: X_OE, y: oy},
      sourcePosition: 'right', targetPosition: 'left',
      data: {label: `${oe.id} · ${oe.label}`, href: `/visao/solucao#${oe.id.toLowerCase()}`},
      style: {
        width: 165, fontSize: 13, fontWeight: 700, padding: '10px 12px',
        background: oc.bg, border: `2px solid ${oc.border}`, borderRadius: 12, color: oc.text,
        cursor: 'pointer',
      },
    });
    oeYs.push(oy);
  }

  // Problema central
  const pc = compColor(gDone, gTotal);
  const probY = (Math.min(...oeYs) + Math.max(...oeYs)) / 2;
  nodes.push({
    id: 'PROBLEMA',
    position: {x: X_PROB, y: probY},
    sourcePosition: 'right', targetPosition: 'left',
    data: {label: 'PROBLEMA CENTRAL\nBaixo impacto competitivo no mercado SaaS', href: '/visao/cenario'},
    style: {
      width: 200, fontSize: 12.5, fontWeight: 700, padding: '12px 14px', textAlign: 'center',
      whiteSpace: 'pre-line', background: pc.bg, border: `2px solid ${pc.border}`,
      borderRadius: 14, color: pc.text, cursor: 'pointer',
    },
  });
  for (const oe of TREE) {
    edges.push({id: `e-PROB-${oe.id}`, source: 'PROBLEMA', target: oe.id, style: {stroke: '#9ca3af', strokeWidth: 1.8}});
  }

  /* ── RNF section — below main tree ─────────────────────────── */
  const mainTreeBottom = rfRow * ROW_H;
  const rnfYOffset = mainTreeBottom + 80;

  // Section label node
  nodes.push({
    id: 'RNF_LABEL',
    position: {x: RNF_X_START, y: rnfYOffset},
    data: {label: 'Requisitos Não Funcionais (RNFs) — independentes de OE/CP/Feature', href: '/backlog/requisitos#rnfs'},
    style: {
      width: (RNF_COLS * (RNF_NODE_W + RNF_COL_GAP)) - RNF_COL_GAP,
      fontSize: 11.5, fontWeight: 700, padding: '6px 10px', textAlign: 'center',
      background: '#f3e8ff', border: '1.5px solid #7f3fe5', borderRadius: 10,
      color: '#4c1d95', cursor: 'pointer',
    },
  });

  RNFS.forEach((rnf, idx) => {
    const col = idx % RNF_COLS;
    const row = Math.floor(idx / RNF_COLS);
    const x = RNF_X_START + col * (RNF_NODE_W + RNF_COL_GAP);
    const y = rnfYOffset + RNF_SECTION_LABEL_H + 16 + row * RNF_ROW_H;
    nodes.push({
      id: rnf.id,
      position: {x, y},
      data: {label: rnf.label, href: rnf.href},
      style: {
        width: RNF_NODE_W, fontSize: 9.5, padding: '5px 6px', textAlign: 'center',
        background: '#faf5ff', border: '1px solid #a855f7', borderRadius: 8,
        color: '#4c1d95', cursor: 'pointer',
      },
    });
  });

  return {nodes, edges};
}

function FlowInner(): ReactNode {
  const {ReactFlow, Background, Controls} = require('@xyflow/react');
  require('@xyflow/react/dist/style.css');
  const {withBaseUrl} = useBaseUrlUtils();
  const {nodes, edges} = buildGraph();

  const onNodeClick = useCallback(
    (_evt: any, node: any) => {
      const href = node?.data?.href;
      if (href) window.location.assign(withBaseUrl(href));
    },
    [withBaseUrl],
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodeClick={onNodeClick}
      fitView
      minZoom={0.05}
      proOptions={{hideAttribution: true}}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable
    >
      <Background gap={20} color="var(--crianex-border)" />
      <Controls showInteractive={false} />
    </ReactFlow>
  );
}

export default function TraceabilityFlow(): ReactNode {
  return (
    <>
      <div className="crianex-flow__legend" style={{marginBottom: '0.5rem'}}>
        <strong style={{fontSize: '0.8rem'}}>Status de conclusão:</strong>
        <span><i className="crianex-flow__dot" style={{background: '#16a34a'}} /> Concluído</span>
        <span><i className="crianex-flow__dot" style={{background: '#ca8a04'}} /> Parcial</span>
        <span><i className="crianex-flow__dot" style={{background: '#dc2626'}} /> Não iniciado</span>
        <span><i className="crianex-flow__dot" style={{background: '#a855f7'}} /> RNF (independente)</span>
      </div>
      <div className="crianex-flow" style={{height: 800}}>
        <BrowserOnly fallback={<div style={{padding: '2rem', textAlign: 'center'}}>Carregando matriz…</div>}>
          {() => <FlowInner />}
        </BrowserOnly>
      </div>
      <div className="crianex-flow__legend">
        <span style={{opacity: 0.75}}>
          Problema → OEs → CPs → Features → RFs · RNFs independentes abaixo ·
          Clique: Feature/RF → página da feature · OE/CP → Solução · RNF → aba do requisito
        </span>
      </div>
    </>
  );
}
