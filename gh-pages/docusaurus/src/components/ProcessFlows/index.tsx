import React, {type ReactNode, useState} from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

/* Fluxos do processo FDD + Kanban com navbar interna.
   Loop edges usam custom edge type para renderizar seta retangular visível. */

type NodeDef = {id: string; label: string; phase?: string};
type EdgeDef = [string, string, string?, 'loop'?];

const PHASE: Record<string, {bg: string; border: string; color: string}> = {
  plan:  {bg: '#dbeafe', border: '#1d4ed8', color: '#1e3a5f'},
  build: {bg: '#fce7f3', border: '#be185d', color: '#831843'},
  close: {bg: '#ede9fe', border: '#7c3aed', color: '#3b0764'},
  start: {bg: '#e3f2fd', border: '#1565c0', color: '#0d3b66'},
  valid: {bg: '#fff8e1', border: '#f57f17', color: '#6b4e00'},
  done:  {bg: '#e8f5e9', border: '#2e7d32', color: '#1b4332'},
};

const GRAPHS: Record<string, {nodes: NodeDef[]; edges: EdgeDef[]}> = {
  lifecycle: {
    nodes: [
      {id: 'a',  label: 'Feature Discovery Session',                         phase: 'start'},
      {id: 'b',  label: 'Iteration Replenishment\nIP = VB / PT',             phase: 'plan'},
      {id: 'c',  label: 'Iteration Commitment\nIteration Goal',              phase: 'plan'},
      {id: 'd',  label: 'Feature Slicing\nfatias verticais · INVEST',        phase: 'build'},
      {id: 'e',  label: 'Acceptance Criteria\nDado / Quando / Então',        phase: 'build'},
      {id: 'f',  label: 'Technical Design Review\nFDD etapa 4',              phase: 'build'},
      {id: 'g',  label: 'Kanban Pull Execution\nFDD etapa 5 · WIP ≤ 2',     phase: 'build'},
      {id: 'h',  label: 'Code & Design Review\nPR + CI verde',               phase: 'build'},
      {id: 'i',  label: 'Partial Client Validation',                          phase: 'valid'},
      {id: 'j',  label: 'Formal Client Validation',                           phase: 'done'},
    ],
    edges: [
      ['a', 'b'], ['b', 'c'], ['c', 'd'], ['d', 'e'], ['e', 'f'],
      ['f', 'g'], ['g', 'h'], ['h', 'i'], ['i', 'j'],
      ['j', 'b', 'nova iteração ↺', 'loop'],
    ],
  },
  sequence: {
    nodes: [
      {id: 'r',   label: '① Iteration Replenishment\nIP = VB / PT',         phase: 'plan'},
      {id: 'cm',  label: '① Iteration Commitment\nIteration Goal',          phase: 'plan'},
      {id: 'ac',  label: '② Acceptance Criteria\nDado / Quando / Então',    phase: 'build'},
      {id: 'tdr', label: '② Technical Design Review',                        phase: 'build'},
      {id: 'kb',  label: '② Kanban Pull · WIP ≤ 2',                         phase: 'build'},
      {id: 'cr',  label: '② Code & Design Review',                           phase: 'build'},
      {id: 'pv',  label: '② Partial Client Validation',                      phase: 'valid'},
      {id: 'fv',  label: '③ Formal Client Validation',                       phase: 'close'},
      {id: 'au',  label: '③ Auditoria de Rastreabilidade',                   phase: 'close'},
      {id: 'ar',  label: '③ Geração de Artefatos',                           phase: 'close'},
      {id: 'rb',  label: '③ Reorganizar Backlog',                            phase: 'close'},
    ],
    edges: [
      ['r', 'cm'], ['cm', 'ac'], ['ac', 'tdr'], ['tdr', 'kb'], ['kb', 'cr'],
      ['cr', 'pv'], ['pv', 'ac', 'repete por issue'], ['pv', 'fv', 'todas concluídas'],
      ['fv', 'au'], ['au', 'ar'], ['ar', 'rb'],
      ['rb', 'r', 'nova iteração ↺', 'loop'],
    ],
  },
};

const TABS = [
  {key: 'lifecycle', label: 'Ciclo de Vida de uma Feature', desc: 'Do primeiro insight à entrega validada. Após a Formal Client Validation, o ciclo reinicia no Iteration Replenishment para a próxima iteração (seta verde à direita).'},
  {key: 'sequence',  label: 'Sequência de Execução na Iteração', desc: 'Ordem obrigatória por fase (① Planejamento · ② Design & Build · ③ Encerramento). O ciclo de produção repete por issue até todas concluírem, então reinicia no Replenishment (seta verde à direita).'},
];

const LOOP_OFFSET = 160;

function Canvas({variant}: {variant: string}): ReactNode {
  const {ReactFlow, BaseEdge, EdgeLabelRenderer, Background, Controls, MarkerType} = require('@xyflow/react');
  require('@xyflow/react/dist/style.css');
  const def = GRAPHS[variant];

  // Custom edge: caminho retangular pelo lado direito, sempre visível
  const LoopEdge = ({sourceX, sourceY, targetX, targetY, markerEnd, label}: any) => {
    const pad = 22;
    const rx  = sourceX + LOOP_OFFSET;
    const d   = [
      `M ${sourceX} ${sourceY}`,
      `L ${sourceX} ${sourceY + pad}`,
      `L ${rx} ${sourceY + pad}`,
      `L ${rx} ${targetY - pad}`,
      `L ${targetX} ${targetY - pad}`,
      `L ${targetX} ${targetY}`,
    ].join(' ');
    const midY = (sourceY + targetY) / 2;
    return (
      <>
        <BaseEdge
          path={d}
          markerEnd={markerEnd}
          style={{stroke: '#2e7d32', strokeWidth: 2, strokeDasharray: '6 3', fill: 'none'}}
        />
        {label && (
          <EdgeLabelRenderer>
            <div style={{
              position: 'absolute',
              transform: `translate(8px, -50%) translate(${rx}px, ${midY}px)`,
              fontSize: 10, fontWeight: 700, color: '#2e7d32',
              background: 'var(--crianex-surface)',
              border: '1px solid #2e7d32',
              padding: '1px 5px', borderRadius: 4,
              pointerEvents: 'none',
            }}>
              {label}
            </div>
          </EdgeLabelRenderer>
        )}
      </>
    );
  };

  const edgeTypes = {loop: LoopEdge};

  const nodes = def.nodes.map((n, idx) => {
    const s = PHASE[n.phase ?? 'plan'];
    return {
      id: n.id,
      position: {x: 0, y: idx * 86},
      sourcePosition: 'bottom',
      targetPosition: 'top',
      data: {label: n.label},
      style: {
        width: 260, padding: '8px 12px', borderRadius: 10,
        background: s.bg, border: `1.5px solid ${s.border}`, color: s.color,
        fontSize: 11.5, fontWeight: 600, whiteSpace: 'pre-line', textAlign: 'center',
      },
    };
  });

  const edges = def.edges.map(([source, target, label, kind], i) => {
    const isLoop   = kind === 'loop';
    const isRepeat = label === 'repete por issue';
    if (isLoop) {
      return {
        id: `e${i}`, source, target, label, type: 'loop',
        markerEnd: {type: MarkerType.ArrowClosed, color: '#2e7d32'},
      };
    }
    return {
      id: `e${i}`, source, target, label,
      type: 'smoothstep',
      animated: isRepeat,
      style: {
        stroke: isRepeat ? '#f57f17' : '#94a3b8',
        strokeWidth: 1.5,
      },
      labelStyle: {fontSize: 10, fill: 'var(--ifm-color-emphasis-700)'},
      labelBgStyle: {fill: 'var(--crianex-surface)'},
      markerEnd: {type: MarkerType.ArrowClosed, color: isRepeat ? '#f57f17' : '#94a3b8'},
    };
  });

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      edgeTypes={edgeTypes}
      fitView
      fitViewOptions={{padding: 0.35}}
      minZoom={0.1}
      nodesDraggable={false}
      nodesConnectable={false}
      proOptions={{hideAttribution: true}}
      preventScrolling={false}
    >
      <Background gap={18} color="var(--crianex-border)" />
      <Controls showInteractive={false} />
    </ReactFlow>
  );
}

function Inner(): ReactNode {
  const [variant, setVariant] = useState('lifecycle');
  const active = TABS.find((t) => t.key === variant)!;
  return (
    <div>
      <div className="crianex-cal-months">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`crianex-cal-month-btn${t.key === variant ? ' is-active' : ''}`}
            onClick={() => setVariant(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <p style={{fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-700)', marginBottom: '0.6rem'}}>{active.desc}</p>
      <div className="crianex-stepflow">
        <Canvas variant={variant} />
      </div>
    </div>
  );
}

export default function ProcessFlows(): ReactNode {
  return (
    <BrowserOnly fallback={<div className="crianex-stepflow" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Carregando diagramas…</div>}>
      {() => <Inner />}
    </BrowserOnly>
  );
}
