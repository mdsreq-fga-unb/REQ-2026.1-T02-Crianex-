import React, {type ReactNode} from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

/* Fluxo das 5 etapas do FDD.
   Etapas 1–3 = únicas (azul) · Etapas 4–5 = iterativas (verde, com loop visível). */

const NODES = [
  {id: 'e1', label: 'Etapa 1\nDevelop an Overall Model', phase: 'unico'},
  {id: 'e2', label: 'Etapa 2\nBuild a Feature List', phase: 'unico'},
  {id: 'e3', label: 'Etapa 3\nPlan by Feature', phase: 'unico'},
  {id: 'e4', label: 'Etapa 4\nDesign by Feature', phase: 'iter'},
  {id: 'e5', label: 'Etapa 5\nBuild by Feature', phase: 'iter'},
];

const STYLE: Record<string, {bg: string; border: string; color: string}> = {
  unico: {bg: '#dbeafe', border: '#1565c0', color: '#0d3b66'},
  iter:  {bg: '#dcfce7', border: '#2e7d32', color: '#14432f'},
};

const LOOP_OFFSET = 140; // px à direita para a seta de retorno

function Inner(): ReactNode {
  const {ReactFlow, BaseEdge, EdgeLabelRenderer, Background, Controls, MarkerType} = require('@xyflow/react');
  require('@xyflow/react/dist/style.css');

  // Custom edge que desenha um caminho retangular pelo lado direito do diagrama
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

  const nodes = NODES.map((n, i) => {
    const s = STYLE[n.phase];
    return {
      id: n.id,
      position: {x: 0, y: i * 96},
      sourcePosition: 'bottom',
      targetPosition: 'top',
      data: {label: n.label},
      style: {
        width: 260, padding: '10px 14px', borderRadius: 12,
        background: s.bg, border: `1.6px solid ${s.border}`, color: s.color,
        fontSize: 12.5, fontWeight: 600, whiteSpace: 'pre-line', textAlign: 'center',
      },
    };
  });

  const fwd = (id: string, source: string, target: string, label?: string) => ({
    id, source, target, label, type: 'smoothstep',
    style: {stroke: '#94a3b8', strokeWidth: 1.6},
    labelStyle: {fontSize: 10, fontWeight: 600, fill: 'var(--ifm-color-emphasis-800)'},
    labelBgStyle: {fill: 'var(--crianex-surface)'},
    markerEnd: {type: MarkerType.ArrowClosed, color: '#94a3b8'},
  });

  const loop = (id: string, source: string, target: string, label: string) => ({
    id, source, target, label, type: 'loop',
    markerEnd: {type: MarkerType.ArrowClosed, color: '#2e7d32'},
  });

  const edges = [
    fwd('e1-e2', 'e1', 'e2'),
    fwd('e2-e3', 'e2', 'e3'),
    fwd('e3-e4', 'e3', 'e4', 'fundação → iteração'),
    fwd('e4-e5', 'e4', 'e5'),
    loop('e5-e4', 'e5', 'e4', 'próxima iteração ↺'),
  ];

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      edgeTypes={edgeTypes}
      fitView
      fitViewOptions={{padding: 0.35}}
      minZoom={0.2}
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

export default function FddStagesFlow(): ReactNode {
  return (
    <div className="crianex-stepflow" style={{height: 580, maxWidth: 760, margin: '1.5rem auto'}}>
      <BrowserOnly fallback={<div style={{padding: '2rem', textAlign: 'center'}}>Carregando diagrama…</div>}>
        {() => <Inner />}
      </BrowserOnly>
    </div>
  );
}
