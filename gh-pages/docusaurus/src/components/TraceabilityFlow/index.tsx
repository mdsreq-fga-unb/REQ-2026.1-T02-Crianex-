import React, {type ReactNode, useCallback} from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {useBaseUrlUtils} from '@docusaurus/useBaseUrl';

/* ----------------------------------------------------------------
   Matriz de rastreabilidade interativa (React Flow)
   OE → CP → Feature → RF. Cada nó redireciona:
     OE/CP   → /visao/solucao (tabelas de OEs e CPs)
     Feature → /backlog/requisitos#fNN
     RF      → /backlog/requisitos
   ---------------------------------------------------------------- */

interface FeatureDef {id: string; label: string; rfs: string[]}
interface CPDef {id: string; label: string; features: FeatureDef[]}
interface OEDef {id: string; label: string; color: string; cpColor: string; border: string; cps: CPDef[]}

const f = (id: string, label: string, rfs: string[]): FeatureDef => ({id, label, rfs});

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

const X_PROB = -320;
const X_OE = 0;
const X_CP = 230;
const X_F = 470;
const X_RF = 760;
const ROW_H = 44;

// RFs concluídos (entregues na IT1) — base para o status de conclusão
const RF_DONE = new Set([
  'rf08', 'rf09', 'rf10', 'rf11', 'rf12', 'rf13', 'rf14', 'rf21', 'rf22', 'rf23',
  'rf24', 'rf25', 'rf26', 'rf27', 'rf28', 'rf29', 'rf30', 'rf31', 'rf32', 'rf33',
  'rf34', 'rf48', 'rf49', 'rf50', 'rf51', 'rf52',
]);

function compColor(done: number, total: number) {
  if (total > 0 && done === total) return {bg: '#dcfce7', border: '#16a34a', text: '#14532d'}; // verde
  if (done === 0) return {bg: '#fee2e2', border: '#dc2626', text: '#7f1d1d'}; // vermelho
  return {bg: '#fef9c3', border: '#ca8a04', text: '#713f12'}; // amarelo (parcial)
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
            data: {label: rf, href: '/backlog/requisitos'},
            style: {
              width: 64, fontSize: 9.5, padding: '3px 4px', textAlign: 'center',
              background: c.bg, border: `1px solid ${c.border}`, borderRadius: 6, color: c.text,
            },
          });
          edges.push({id: `e-${feat.id}-${rf}`, source: feat.id, target: `${feat.id}-${rf}`, style: {stroke: oe.border, strokeWidth: 0.8, opacity: 0.5}});
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
          data: {label: `${feat.id} · ${feat.label}`, href: `/backlog/requisitos#${feat.id.toLowerCase()}`},
          style: {
            width: 180, fontSize: 11, padding: '6px 8px', textAlign: 'left',
            background: fc.bg, border: `1.4px solid ${fc.border}`, borderRadius: 8, color: fc.text,
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
      },
    });
    oeYs.push(oy);
  }

  // Problema central → ligado às 3 OEs (status agregado de todo o projeto)
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
      borderRadius: 14, color: pc.text,
    },
  });
  for (const oe of TREE) {
    edges.push({id: `e-PROB-${oe.id}`, source: 'PROBLEMA', target: oe.id, style: {stroke: '#9ca3af', strokeWidth: 1.8}});
  }

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
      minZoom={0.1}
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
        <span><i className="crianex-flow__dot" style={{background: '#16a34a'}} /> Concluído (todos os filhos)</span>
        <span><i className="crianex-flow__dot" style={{background: '#ca8a04'}} /> Parcial (alguns filhos)</span>
        <span><i className="crianex-flow__dot" style={{background: '#dc2626'}} /> Não iniciado (nenhum filho)</span>
      </div>
      <div className="crianex-flow" style={{height: 720}}>
        <BrowserOnly fallback={<div style={{padding: '2rem', textAlign: 'center'}}>Carregando matriz…</div>}>
          {() => <FlowInner />}
        </BrowserOnly>
      </div>
      <div className="crianex-flow__legend">
        <span style={{opacity: 0.75}}>Problema → OEs → CPs → Features → RFs · clique: OE/CP → Solução, Feature/RF → Tabela de Requisitos</span>
      </div>
    </>
  );
}
