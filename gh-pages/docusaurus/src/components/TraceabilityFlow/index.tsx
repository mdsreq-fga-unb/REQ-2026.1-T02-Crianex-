import React, {type ReactNode, useCallback, useState} from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {useBaseUrlUtils} from '@docusaurus/useBaseUrl';

/* ----------------------------------------------------------------
   Matriz de rastreabilidade interativa (React Flow) — layout VERTICAL
   Problema Central → OE → CP → Feature → RF  (topo → baixo)
   Seção independente de RNFs abaixo da árvore principal.
   Clique:
     Problema/OE/CP → páginas de visão/solução
     Feature         → página dedicada da feature (IT1) ou tabela
     RF/RNF          → página da feature com aba do requisito aberta
   ---------------------------------------------------------------- */

interface FeatureDef {id: string; label: string; rfs: string[]}
interface CPDef     {id: string; label: string; features: FeatureDef[]}
interface OEDef     {id: string; label: string; color: string; cpColor: string; border: string; cps: CPDef[]}
interface RnfDef    {id: string; label: string; href: string}

const f = (id: string, label: string, rfs: string[]): FeatureDef => ({id, label, rfs});

/* ── Rotas das features com página dedicada (IT1 + IT2 concluídas) ──── */
const FEATURE_PATHS: Record<string, string> = {
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
  F19: '/iteracoes/iteracao-2/features/f19',
  F20: '/iteracoes/iteracao-2/features/f20',
  F21: '/iteracoes/iteracao-2/features/f21',
  F07: '/iteracoes/iteracao-2/features/f07',
  F08: '/iteracoes/iteracao-2/features/f08',
};

/* RF → feature pai (para abrir a aba correta via ?tab=) */
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
  RF35: 'F19', RF36: 'F19', RF37: 'F19', RF41: 'F19', RF60: 'F19', RF61: 'F19', RF62: 'F19',
  RF38: 'F20', RF39: 'F20', RF40: 'F20',
  RF42: 'F21', RF53: 'F21', RF59: 'F21',
  RF46: 'F07', RF47: 'F07',
  RF15: 'F08', RF56: 'F08', RF57: 'F08', RF63: 'F08',
};

function featureHref(featId: string): string {
  return FEATURE_PATHS[featId] ?? `/backlog/requisitos#${featId.toLowerCase()}`;
}

function rfHref(rfId: string): string {
  const feat = RF_TO_FEATURE[rfId];
  if (feat && FEATURE_PATHS[feat]) {
    return `${FEATURE_PATHS[feat]}?tab=${rfId.toLowerCase()}`;
  }
  return '/backlog/requisitos';
}

/* ── Árvore de dados ───────────────────────────────────────────── */
export const TREE: OEDef[] = [
  {
    id: 'OE1', label: 'OE1 · Gestão operacional', color: '#dbeafe', cpColor: '#e0e7ff', border: '#4338ca',
    cps: [
      {id: 'CP2', label: 'CP2 · Logs e Monitoramento', features: [
        f('F01', 'F01 · Eventos de seg.', ['RF01', 'RF02']),
        f('F02', 'F02 · Estado dos comp.', ['RF03', 'RF54']),
      ]},
      {id: 'CP3', label: 'CP3 · Dashboard Executivo', features: [
        f('F03', 'F03 · Indicadores oper.', ['RF04', 'RF05', 'RF06']),
        f('F04', 'F04 · Indicadores fin.', ['RF07', 'RF55']),
      ]},
      {id: 'CP7', label: 'CP7 · Faturamento', features: [
        f('F05', 'F05 · Reg. financeiros', ['RF16', 'RF17', 'RF18']),
        f('F06', 'F06 · Rel. financeiros', ['RF19', 'RF20']),
      ]},
    ],
  },
  {
    id: 'OE2', label: 'OE2 · Visibilidade B2B', color: '#dcfce7', cpColor: '#d1fae5', border: '#059669',
    cps: [
      {id: 'CP4', label: 'CP4 · Vitrine Pública', features: [
        f('F12', 'F12 · Produtos SaaS', ['RF21', 'RF22', 'RF23', 'RF24']),
        f('F13', 'F13 · Pub. produto', ['RF25', 'RF26']),
        f('F14', 'F14 · Canais contato', ['RF27', 'RF49']),
        f('F15', 'F15 · Info institucional', ['RF50', 'RF51']),
      ]},
      {id: 'CP5', label: 'CP5 · Painel do Admin', features: [
        f('F09', 'F09 · Autenticar', ['RF08', 'RF09']),
        f('F10', 'F10 · Acessar painel', ['RF10', 'RF48']),
        f('F11', 'F11 · Gerenciar usuários', ['RF11', 'RF12', 'RF13', 'RF14']),
      ]},
      {id: 'CP6', label: 'CP6 · FAQ', features: [
        f('F16', 'F16 · Artigos de FAQ', ['RF28', 'RF29', 'RF30', 'RF31']),
        f('F17', 'F17 · Pub. de FAQ', ['RF32', 'RF33']),
        f('F18', 'F18 · Avaliação FAQ', ['RF34', 'RF52']),
      ]},
    ],
  },
  {
    id: 'OE3', label: 'OE3 · Leads e clientes', color: '#fce7f3', cpColor: '#fbcfe8', border: '#db2777',
    cps: [
      {id: 'CP1', label: 'CP1 · CRM Kanban', features: [
        f('F19', 'F19 · Clientes/leads', ['RF35', 'RF36', 'RF37', 'RF41', 'RF60', 'RF61', 'RF62']),
        f('F20', 'F20 · Colunas funil', ['RF38', 'RF39', 'RF40']),
        f('F21', 'F21 · Interações com.', ['RF42', 'RF53', 'RF59']),
      ]},
      {id: 'CP8', label: 'CP8 · Tickets Suporte', features: [
        f('F22', 'F22 · Acessar tickets', ['RF43', 'RF58']),
        f('F23', 'F23 · Gerenciar tickets', ['RF44', 'RF45']),
      ]},
      {id: 'CP9', label: 'CP9 · Notificações', features: [
        f('F07', 'F07 · Histórico notif.', ['RF46', 'RF47']),
        f('F08', 'F08 · Templates notif.', ['RF15', 'RF56', 'RF57', 'RF63']),
      ]},
    ],
  },
];

/* ── RNFs — seção independente abaixo da árvore ─────────────────── */
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
  {id: 'RNF11', label: 'RNF11 · LGPD',                href: '/iteracoes/iteracao-1/features/f14?tab=rnf11'},
  {id: 'RNF12', label: 'RNF12 · Responsividade',      href: '/backlog/requisitos#rnfs'},
  {id: 'RNF13', label: 'RNF13 · Bilinguismo',         href: '/iteracoes/iteracao-1/features/f12?tab=rnf13'},
  {id: 'RNF14', label: 'RNF14 · Escalabilidade',      href: '/backlog/requisitos#rnfs'},
  {id: 'RNF15', label: 'RNF15 · Carga concorrente',   href: '/backlog/requisitos#rnfs'},
  {id: 'RNF16', label: 'RNF16 · Stack obrigatório',   href: '/backlog/requisitos#rnfs'},
  {id: 'RNF17', label: 'RNF17 · Cob. testes',         href: '/backlog/requisitos#rnfs'},
  {id: 'RNF18', label: 'RNF18 · Portabilidade',       href: '/backlog/requisitos#rnfs'},
  {id: 'RNF19', label: 'RNF19 · Navegação intuitiva', href: '/iteracoes/iteracao-1/features/f12?tab=rnf19'},
  {id: 'RNF20', label: 'RNF20 · Disponibilidade',     href: '/iteracoes/iteracao-1/features/f15?tab=rnf20'},
  {id: 'RNF21', label: 'RNF21 · Drag-drop cards',     href: '/backlog/requisitos#rnfs'},
  {id: 'RNF22', label: 'RNF22 · Drag-drop colunas',   href: '/backlog/requisitos#rnfs'},
  {id: 'RNF23', label: 'RNF23 · Resumo tickets',      href: '/backlog/requisitos#rnfs'},
  {id: 'RNF24', label: 'RNF24 · Cards CRM',           href: '/backlog/requisitos#rnfs'},
  {id: 'RNF25', label: 'RNF25 · Drag-drop CRM',       href: '/backlog/requisitos#rnfs'},
];

/* ── Constantes de layout vertical ────────────────────────────── */
const Y_PROB = 0;
const Y_OE   = 200;
const Y_CP   = 400;
const Y_F    = 600;
const Y_RF   = 800;
const COL_W  = 96;    // largura de cada coluna de RF

const W_PROB = 260;
const W_OE   = 200;
const W_CP   = 200;
const W_F    = 170;
const W_RF   = 58;

/* x (borda esquerda) centrado sobre as colunas [minCol, maxCol] */
function cx(minCol: number, maxCol: number, nodeW: number): number {
  return (minCol + maxCol + 1) / 2 * COL_W - nodeW / 2;
}

/* Seção de RNFs */
const RNF_COLS    = 6;
const RNF_NODE_W  = 155;
const RNF_COL_GAP = 16;
const RNF_ROW_H   = 52;
const RNF_GAP_Y   = 100;

/* RFs concluídos (IT1 completa + IT2: F07/F08/F19/F20/F21) */
const RF_DONE = new Set([
  'rf08','rf09','rf10','rf11','rf12','rf13','rf14',
  'rf21','rf22','rf23','rf24','rf25','rf26','rf27',
  'rf28','rf29','rf30','rf31','rf32','rf33','rf34',
  'rf48','rf49','rf50','rf51','rf52',
  'rf35','rf36','rf37','rf41','rf60','rf61','rf62',
  'rf38','rf39','rf40',
  'rf42','rf53','rf59',
  'rf46','rf47',
  'rf15','rf56','rf57','rf63',
]);

function compColor(done: number, total: number) {
  if (total > 0 && done === total) return {bg: '#dcfce7', border: '#16a34a', text: '#14532d'};
  if (done === 0)                  return {bg: '#fee2e2', border: '#dc2626', text: '#7f1d1d'};
  return                                  {bg: '#fef9c3', border: '#ca8a04', text: '#713f12'};
}

function buildGraph() {
  const nodes: any[] = [];
  const edges: any[] = [];

  let rfCol = 0;
  let gDone = 0, gTotal = 0;

  for (const oe of TREE) {
    const oeStart = rfCol;
    let oeDone = 0, oeTotal = 0;

    for (const cp of oe.cps) {
      const cpStart = rfCol;
      let cpDone = 0, cpTotal = 0;

      for (const feat of cp.features) {
        const fStart = rfCol;
        let featDone = 0;

        for (const rf of feat.rfs) {
          const done = RF_DONE.has(rf.toLowerCase());
          if (done) featDone++;
          const c = compColor(done ? 1 : 0, 1);
          nodes.push({
            id: `${feat.id}-${rf}`,
            position: {x: rfCol * COL_W, y: Y_RF},
            sourcePosition: 'bottom', targetPosition: 'top',
            data: {label: rf, href: rfHref(rf)},
            style: {
              width: W_RF, fontSize: 9, padding: '3px 2px', textAlign: 'center',
              background: c.bg, border: `1px solid ${c.border}`, borderRadius: 6,
              color: c.text, cursor: 'pointer',
            },
          });
          edges.push({
            id: `e-${feat.id}-${rf}`,
            source: feat.id, target: `${feat.id}-${rf}`,
            style: {stroke: oe.border, strokeWidth: 0.8, opacity: 0.5},
          });
          rfCol++;
        }

        const fEnd = rfCol - 1;
        const featTotal = feat.rfs.length;
        cpDone += featDone; cpTotal += featTotal;
        const fc = compColor(featDone, featTotal);
        nodes.push({
          id: feat.id,
          position: {x: cx(fStart, fEnd, W_F), y: Y_F},
          sourcePosition: 'bottom', targetPosition: 'top',
          data: {label: feat.label, href: featureHref(feat.id)},
          style: {
            width: W_F, fontSize: 10, padding: '5px 7px', textAlign: 'center',
            background: fc.bg, border: `1.4px solid ${fc.border}`, borderRadius: 8,
            color: fc.text, cursor: 'pointer',
          },
        });
        edges.push({
          id: `e-${cp.id}-${feat.id}`,
          source: cp.id, target: feat.id,
          style: {stroke: oe.border, strokeWidth: 1.2},
        });
      }

      const cpEnd = rfCol - 1;
      oeDone += cpDone; oeTotal += cpTotal;
      const cc = compColor(cpDone, cpTotal);
      nodes.push({
        id: cp.id,
        position: {x: cx(cpStart, cpEnd, W_CP), y: Y_CP},
        sourcePosition: 'bottom', targetPosition: 'top',
        data: {label: cp.label, href: `/visao/solucao#${cp.id.toLowerCase()}`},
        style: {
          width: W_CP, fontSize: 11, fontWeight: 600, padding: '7px 9px', textAlign: 'center',
          background: cc.bg, border: `1.5px solid ${cc.border}`, borderRadius: 10,
          color: cc.text, cursor: 'pointer',
        },
      });
      edges.push({
        id: `e-${oe.id}-${cp.id}`,
        source: oe.id, target: cp.id,
        style: {stroke: oe.border, strokeWidth: 1.6},
      });
    }

    const oeEnd = rfCol - 1;
    gDone += oeDone; gTotal += oeTotal;
    const oc = compColor(oeDone, oeTotal);
    nodes.push({
      id: oe.id,
      position: {x: cx(oeStart, oeEnd, W_OE), y: Y_OE},
      sourcePosition: 'bottom', targetPosition: 'top',
      data: {label: oe.label, href: `/visao/solucao#${oe.id.toLowerCase()}`},
      style: {
        width: W_OE, fontSize: 12, fontWeight: 700, padding: '9px 11px', textAlign: 'center',
        background: oc.bg, border: `2px solid ${oc.border}`, borderRadius: 12,
        color: oc.text, cursor: 'pointer',
      },
    });
    edges.push({
      id: `e-PROB-${oe.id}`,
      source: 'PROBLEMA', target: oe.id,
      style: {stroke: '#9ca3af', strokeWidth: 1.8},
    });
  }

  /* Problema Central — centrado sobre toda a largura */
  const pc = compColor(gDone, gTotal);
  nodes.push({
    id: 'PROBLEMA',
    position: {x: cx(0, rfCol - 1, W_PROB), y: Y_PROB},
    sourcePosition: 'bottom', targetPosition: 'top',
    data: {
      label: 'PROBLEMA CENTRAL\nBaixo impacto competitivo no mercado SaaS',
      href: '/visao/cenario',
    },
    style: {
      width: W_PROB, fontSize: 12, fontWeight: 700, padding: '12px 14px', textAlign: 'center',
      whiteSpace: 'pre-line', background: pc.bg, border: `2px solid ${pc.border}`,
      borderRadius: 14, color: pc.text, cursor: 'pointer',
    },
  });

  /* ── Seção de RNFs abaixo ──────────────────────────────────── */
  const rnfSectionY  = Y_RF + 64 + RNF_GAP_Y;
  const rnfGridW     = RNF_COLS * (RNF_NODE_W + RNF_COL_GAP) - RNF_COL_GAP;
  const treeWidthPx  = rfCol * COL_W;
  const rnfGridX     = treeWidthPx / 2 - rnfGridW / 2;

  nodes.push({
    id: 'RNF_LABEL',
    position: {x: rnfGridX, y: rnfSectionY},
    data: {label: 'Requisitos Não Funcionais — independentes de OE / CP / Feature', href: '/backlog/requisitos#rnfs'},
    style: {
      width: rnfGridW, fontSize: 11.5, fontWeight: 700, padding: '6px 10px', textAlign: 'center',
      background: '#f3e8ff', border: '1.5px solid #7f3fe5', borderRadius: 10,
      color: '#4c1d95', cursor: 'pointer',
    },
  });

  RNFS.forEach((rnf, idx) => {
    const col = idx % RNF_COLS;
    const row = Math.floor(idx / RNF_COLS);
    nodes.push({
      id: rnf.id,
      position: {
        x: rnfGridX + col * (RNF_NODE_W + RNF_COL_GAP),
        y: rnfSectionY + 44 + row * RNF_ROW_H,
      },
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

/* Bounds de foco por OE — derivados da árvore em tempo de módulo */
const OE_FOCUS_BOUNDS = (() => {
  let col = 0;
  return TREE.map(oe => {
    const start = col;
    for (const cp of oe.cps) for (const feat of cp.features) col += feat.rfs.length;
    return {
      id: oe.id,
      color: oe.color,
      border: oe.border,
      x: start * COL_W,
      y: Y_OE - 20,
      width: (col - start) * COL_W,
      height: Y_RF - Y_OE + 80,
    };
  });
})();

function FlowInner({onFullscreen}: {onFullscreen?: () => void}): ReactNode {
  const {ReactFlow, Background, Controls, Panel, useReactFlow} = require('@xyflow/react');
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

  /* Renderizado dentro do contexto ReactFlow para ter acesso a useReactFlow */
  function OEButtons() {
    const {fitBounds} = useReactFlow();
    const btnBase: React.CSSProperties = {
      display: 'block', width: '100%', padding: '5px 10px',
      fontSize: 11, fontWeight: 600, cursor: 'pointer',
      borderRadius: 6, border: '1.5px solid', lineHeight: 1.3, textAlign: 'left',
    };
    return (
      <Panel position="top-left" style={{display: 'flex', flexDirection: 'column', gap: 4, padding: 6}}>
        {OE_FOCUS_BOUNDS.map(oe => (
          <button
            key={oe.id}
            title={`Centralizar na ${oe.id}`}
            onClick={() => fitBounds({x: oe.x, y: oe.y, width: oe.width, height: oe.height}, {padding: 0.1, duration: 500})}
            style={{...btnBase, background: oe.color, borderColor: oe.border, color: '#111'}}
          >
            ⊕ {oe.id}
          </button>
        ))}
        {onFullscreen && (
          <button
            onClick={onFullscreen}
            title="Abrir em tela cheia"
            style={{...btnBase, marginTop: 3, background: '#f3f4f6', borderColor: '#6b7280', color: '#374151'}}
          >
            ⛶ Tela cheia
          </button>
        )}
      </Panel>
    );
  }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodeClick={onNodeClick}
      fitView
      minZoom={0.04}
      proOptions={{hideAttribution: true}}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable
    >
      <Background gap={20} color="var(--crianex-border)" />
      <Controls showInteractive={false} />
      <OEButtons />
    </ReactFlow>
  );
}

export default function TraceabilityFlow(): ReactNode {
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <>
      <div className="crianex-flow__legend" style={{marginBottom: '0.5rem'}}>
        <strong style={{fontSize: '0.8rem'}}>Status de conclusão:</strong>
        <span><i className="crianex-flow__dot" style={{background: '#16a34a'}} /> Concluído</span>
        <span><i className="crianex-flow__dot" style={{background: '#ca8a04'}} /> Parcial</span>
        <span><i className="crianex-flow__dot" style={{background: '#dc2626'}} /> Não iniciado</span>
        <span><i className="crianex-flow__dot" style={{background: '#a855f7'}} /> RNF (independente)</span>
      </div>
      <div className="crianex-flow" style={{height: 860}}>
        <BrowserOnly fallback={<div style={{padding: '2rem', textAlign: 'center'}}>Carregando matriz…</div>}>
          {() => <FlowInner onFullscreen={() => setFullscreen(true)} />}
        </BrowserOnly>
      </div>
      <div className="crianex-flow__legend">
        <span style={{opacity: 0.75}}>
          Problema → OEs → CPs → Features → RFs (topo→baixo) · RNFs independentes abaixo ·
          Clique: Feature/RF → página da feature com aba correta · OE/CP → Solução
        </span>
      </div>
      {fullscreen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'var(--ifm-background-color)',
          display: 'flex', flexDirection: 'column',
        }}>
          <div style={{
            padding: '6px 14px', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', borderBottom: '1px solid var(--crianex-border)',
            background: 'var(--ifm-navbar-background-color)',
          }}>
            <span style={{fontSize: 13, fontWeight: 600}}>Árvore de Rastreabilidade</span>
            <button
              onClick={() => setFullscreen(false)}
              style={{
                padding: '5px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                background: '#fee2e2', border: '1px solid #dc2626', borderRadius: 6, color: '#991b1b',
              }}
            >
              ✕ Fechar
            </button>
          </div>
          <div style={{flex: 1}}>
            <BrowserOnly>
              {() => <FlowInner />}
            </BrowserOnly>
          </div>
        </div>
      )}
    </>
  );
}
