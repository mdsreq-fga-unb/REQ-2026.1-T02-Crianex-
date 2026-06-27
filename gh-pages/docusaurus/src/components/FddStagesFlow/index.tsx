import React, {type ReactNode} from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

/* Fluxo das 5 etapas do FDD (substitui o Mermaid de §4.2).
   Etapas 1–3 = únicas (azul) · Etapas 4–5 = iterativas (verde, com loop). */

const NODES = [
  {id: 'e1', label: 'Etapa 1\nDevelop an Overall Model', phase: 'unico'},
  {id: 'e2', label: 'Etapa 2\nBuild a Feature List', phase: 'unico'},
  {id: 'e3', label: 'Etapa 3\nPlan by Feature', phase: 'unico'},
  {id: 'e4', label: 'Etapa 4\nDesign by Feature', phase: 'iter'},
  {id: 'e5', label: 'Etapa 5\nBuild by Feature', phase: 'iter'},
];

const STYLE: Record<string, {bg: string; border: string; color: string}> = {
  unico: {bg: '#dbeafe', border: '#1565c0', color: '#0d3b66'},
  iter: {bg: '#dcfce7', border: '#2e7d32', color: '#14432f'},
};

function Inner(): ReactNode {
  const {ReactFlow, Background, Controls, MarkerType} = require('@xyflow/react');
  require('@xyflow/react/dist/style.css');

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

  const edge = (id: string, source: string, target: string, label?: string, loop = false) => ({
    id, source, target, label,
    type: 'smoothstep',
    sourceHandle: loop ? 'right' : undefined,
    targetHandle: loop ? 'right' : undefined,
    animated: loop,
    style: {stroke: loop ? '#2e7d32' : '#94a3b8', strokeWidth: 1.6},
    labelStyle: {fontSize: 10, fontWeight: 600, fill: 'var(--ifm-color-emphasis-800)'},
    labelBgStyle: {fill: 'var(--crianex-surface)'},
    markerEnd: {type: MarkerType.ArrowClosed, color: loop ? '#2e7d32' : '#94a3b8'},
  });

  const edges = [
    edge('e1-e2', 'e1', 'e2'),
    edge('e2-e3', 'e2', 'e3'),
    edge('e3-e4', 'e3', 'e4', 'fundação → iteração'),
    edge('e4-e5', 'e4', 'e5'),
    edge('e5-e4', 'e5', 'e4', 'próxima iteração', true),
  ];

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      fitView
      fitViewOptions={{padding: 0.2}}
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
    <div className="crianex-stepflow" style={{height: 520, maxWidth: 720, margin: '1.5rem auto'}}>
      <BrowserOnly fallback={<div style={{padding: '2rem', textAlign: 'center'}}>Carregando diagrama…</div>}>
        {() => <Inner />}
      </BrowserOnly>
    </div>
  );
}
