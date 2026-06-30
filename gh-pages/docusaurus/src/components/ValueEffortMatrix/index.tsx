import React, {type ReactNode} from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

/* Matriz Valor (VB) × Esforço (ES) das Features — Recharts.
   - Domínio calibrado para quadrantes proporcionais: splits em x=23 e y=29,
     que são exatamente os pontos médios dos eixos X:[5,41] e Y:[3,55].
   - Bolinhas com jitter para features sobrepostas.
   - Dots clicáveis via SVG <a> para as features com página própria. */

type F = {
  id: string; vb: number; es: number; mvp: boolean; nota?: string;
  displayVb?: number; displayEs?: number;
};

const BASE = '/REQ-2026.1-T02-Crianex-';
const URLS: Record<string, string> = {
  F07: `${BASE}/iteracoes/iteracao-2/features/f07`,
  F08: `${BASE}/iteracoes/iteracao-2/features/f08`,
  F09: `${BASE}/iteracoes/iteracao-1/features/f09`,
  F10: `${BASE}/iteracoes/iteracao-1/features/f10`,
  F11: `${BASE}/iteracoes/iteracao-1/features/f11`,
  F12: `${BASE}/iteracoes/iteracao-1/features/f12`,
  F13: `${BASE}/iteracoes/iteracao-1/features/f13`,
  F14: `${BASE}/iteracoes/iteracao-1/features/f14`,
  F15: `${BASE}/iteracoes/iteracao-1/features/f15`,
  F16: `${BASE}/iteracoes/iteracao-1/features/f16`,
  F17: `${BASE}/iteracoes/iteracao-1/features/f17`,
  F18: `${BASE}/iteracoes/iteracao-1/features/f18`,
  F19: `${BASE}/iteracoes/iteracao-2/features/f19`,
  F20: `${BASE}/iteracoes/iteracao-2/features/f20`,
  F21: `${BASE}/iteracoes/iteracao-2/features/f21`,
  F22: `${BASE}/iteracoes/iteracao-2/features/f22`,
  F23: `${BASE}/iteracoes/iteracao-2/features/f23`,
};

// displayVb/displayEs aplicam jitter visual nas features sobrepostas;
// os valores reais (vb/es) permanecem no tooltip.
const DATA: F[] = [
  {id: 'F09', vb: 50, es: 21, mvp: true,  displayEs: 20.5, displayVb: 50.8},
  {id: 'F10', vb: 50, es: 21, mvp: true,  displayEs: 21.8, displayVb: 49.2},
  {id: 'F11', vb: 39, es: 18, mvp: true},
  {id: 'F12', vb: 50, es: 10, mvp: true},
  {id: 'F13', vb: 47, es: 14, mvp: true},
  {id: 'F14', vb: 50, es: 20, mvp: true,  displayEs: 19.2, displayVb: 51.2},
  {id: 'F15', vb: 50, es: 15, mvp: true},
  {id: 'F16', vb: 32, es: 8,  mvp: true},
  {id: 'F17', vb: 30, es: 10, mvp: true,  displayEs: 9.3,  displayVb: 30.8},
  {id: 'F18', vb: 30, es: 10, mvp: true,  displayEs: 10.7, displayVb: 29.2},
  {id: 'F19', vb: 50, es: 20, mvp: true,  displayEs: 20.8, displayVb: 48.8},
  {id: 'F20', vb: 36, es: 17, mvp: true},
  {id: 'F21', vb: 50, es: 16, mvp: true},
  {id: 'F07', vb: 39, es: 22, mvp: true},
  {id: 'F08', vb: 21, es: 16, mvp: false, nota: 'Fora do MVP pela matriz (IP 1,31) — incluída na IT2 por dependência com F07'},
  {id: 'F22', vb: 25, es: 19, mvp: false},
  {id: 'F23', vb: 20, es: 18, mvp: false},
  {id: 'F01', vb: 18, es: 19, mvp: false},
  {id: 'F02', vb: 27, es: 25, mvp: false},
  {id: 'F03', vb: 27, es: 26, mvp: false},
  {id: 'F04', vb: 26, es: 30, mvp: false},
  {id: 'F05', vb: 33, es: 29, mvp: false},
  {id: 'F06', vb: 22, es: 22, mvp: false},
];

// Domínio: midpoint de X = ES_SPLIT, midpoint de Y = VB_SPLIT → quadrantes proporcionais
const X_MIN = 5;
const X_MAX = 41;   // (5+41)/2 = 23
const Y_MIN = 3;
const Y_MAX = 55;   // (3+55)/2 = 29

const VB_SPLIT = 29;
const ES_SPLIT = 23;

function Chart(): ReactNode {
  const R = require('recharts');
  const {ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ReferenceLine, Customized, ResponsiveContainer} = R;

  // Pinta os 4 quadrantes com cores distintas
  const QuadrantBg = (props: any) => {
    const xMap = props.xAxisMap && (Object.values(props.xAxisMap)[0] as any);
    const yMap = props.yAxisMap && (Object.values(props.yAxisMap)[0] as any);
    if (!xMap?.scale || !yMap?.scale) return null;
    const xs = xMap.scale;
    const ys = yMap.scale;
    const left   = xs(X_MIN);
    const split_x = xs(ES_SPLIT);
    const right  = xs(X_MAX);
    const top    = ys(Y_MAX);
    const split_y = ys(VB_SPLIT);
    const bottom = ys(Y_MIN);
    const wL = split_x - left;
    const wR = right - split_x;
    const hT = split_y - top;
    const hB = bottom - split_y;
    return (
      <g>
        {/* Q1 — MVP: alto valor + baixo esforço */}
        <rect x={left} y={top} width={wL} height={hT} fill="#22c55e" fillOpacity={0.12} />
        <rect x={left} y={top} width={wL} height={hT} fill="none" stroke="#22c55e" strokeWidth={2.5} />
        {/* Q2 — avaliar: alto valor + alto esforço */}
        <rect x={split_x} y={top} width={wR} height={hT} fill="#3b82f6" fillOpacity={0.08} />
        {/* Q3 — quick wins: baixo valor + baixo esforço */}
        <rect x={left} y={split_y} width={wL} height={hB} fill="#f59e0b" fillOpacity={0.08} />
        {/* Q4 — evitar: baixo valor + alto esforço */}
        <rect x={split_x} y={split_y} width={wR} height={hB} fill="#ef4444" fillOpacity={0.07} />
      </g>
    );
  };

  // Labels dos quadrantes posicionados via ReferenceLine label trick
  const QuadrantLabels = (props: any) => {
    const xMap = props.xAxisMap && (Object.values(props.xAxisMap)[0] as any);
    const yMap = props.yAxisMap && (Object.values(props.yAxisMap)[0] as any);
    if (!xMap?.scale || !yMap?.scale) return null;
    const xs = xMap.scale;
    const ys = yMap.scale;
    const left     = xs(X_MIN) + 6;
    const splitX   = xs(ES_SPLIT) + 6;
    const topY     = ys(Y_MAX) + 14;
    const splitY   = ys(VB_SPLIT) + 14;
    const labelStyle: React.CSSProperties = {fontSize: 10, fontWeight: 700, opacity: 0.75};
    return (
      <g>
        {/* Label grande "MVP" centralizado no quadrante I */}
        <text
          x={(left + splitX) / 2} y={(ys(Y_MAX) + ys(VB_SPLIT)) / 2}
          textAnchor="middle" dominantBaseline="middle"
          fontSize={22} fontWeight={800} fill="#22c55e" fillOpacity={0.35}
          style={{pointerEvents: 'none', letterSpacing: 2}}
        >MVP</text>
        <text x={left}   y={topY}   style={labelStyle} fill="#166534">I — MVP</text>
        <text x={splitX} y={topY}   style={labelStyle} fill="#1d4ed8">II — Avaliar</text>
        <text x={left}   y={splitY} style={labelStyle} fill="#92400e">III — Quick Wins</text>
        <text x={splitX} y={splitY} style={labelStyle} fill="#991b1b">IV — Evitar</text>
      </g>
    );
  };

  const tip = ({active, payload}: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload as F;
      return (
        <div style={{background: 'var(--crianex-surface)', border: '1px solid var(--crianex-border)', borderRadius: 8, padding: '6px 10px', fontSize: 12, maxWidth: 260}}>
          <strong>{d.id}</strong> · VB {d.vb} · ES {d.es} · IP {(d.vb / d.es).toFixed(2)}
          <span style={{marginLeft: 6, fontWeight: 700, color: d.mvp ? '#166534' : '#6b7280'}}>{d.mvp ? '● MVP' : '○ fora do MVP'}</span>
          {d.nota && <div style={{marginTop: 4, color: 'var(--ifm-color-emphasis-600)', fontSize: 11}}>{d.nota}</div>}
        </div>
      );
    }
    return null;
  };

  // Custom dot: clicável se tiver URL, com label acima
  const makeDot = (fill: string, labelColor: string) => (props: any) => {
    const {cx, cy, payload} = props as {cx: number; cy: number; payload: F};
    const url = URLS[payload.id];
    const displayEsVal = payload.displayEs ?? payload.es;
    const displayVbVal = payload.displayVb ?? payload.vb;
    // Re-compute pixel position using display values (Recharts já passa cx/cy do display)
    // cx e cy já refletem displayEs/displayVb porque usamos esses como dataKey
    const label = (
      <text x={cx} y={cy - 9} textAnchor="middle" fontSize={10} fontWeight={700} fill={labelColor} style={{pointerEvents: 'none'}}>
        {payload.id}
      </text>
    );
    const dot = <circle cx={cx} cy={cy} r={5.5} fill={fill} fillOpacity={0.9} />;
    if (url) {
      return (
        <g style={{cursor: 'pointer'}} onClick={() => { window.location.href = url; }}>
          <circle cx={cx} cy={cy} r={10} fill={fill} fillOpacity={0.12} />
          {dot}
          {label}
        </g>
      );
    }
    return <g>{dot}{label}</g>;
  };

  // Adiciona displayEs/displayVb como campos de plot (dataKey)
  const mvpData = DATA.filter((d) => d.mvp).map((d) => ({
    ...d, plotEs: d.displayEs ?? d.es, plotVb: d.displayVb ?? d.vb,
  }));
  const foraData = DATA.filter((d) => !d.mvp).map((d) => ({
    ...d, plotEs: d.displayEs ?? d.es, plotVb: d.displayVb ?? d.vb,
  }));

  return (
    <ResponsiveContainer width="100%" height={480}>
      <ScatterChart margin={{top: 24, right: 36, bottom: 40, left: 12}}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--crianex-border)" />
        <Customized component={QuadrantBg} />
        <Customized component={QuadrantLabels} />
        <XAxis
          type="number" dataKey="plotEs" name="Esforço" domain={[X_MIN, X_MAX]}
          tick={{fontSize: 11}}
          label={{value: 'Esforço (ES) →', position: 'bottom', offset: 18, fontSize: 12}}
        />
        <YAxis
          type="number" dataKey="plotVb" name="Valor" domain={[Y_MIN, Y_MAX]}
          tick={{fontSize: 11}}
          label={{value: 'Valor de Negócio (VB) →', angle: -90, position: 'insideLeft', fontSize: 12}}
        />
        <ReferenceLine x={ES_SPLIT} stroke="var(--crianex-border)" strokeWidth={1.5} />
        <ReferenceLine y={VB_SPLIT} stroke="var(--crianex-border)" strokeWidth={1.5} />
        <ZAxis range={[60, 60]} />
        <Tooltip content={tip} cursor={{strokeDasharray: '3 3'}} />
        <Scatter
          name="MVP" data={mvpData} fill="#7f3fe5"
          shape={makeDot('#7f3fe5', 'var(--ifm-color-emphasis-800)')}
        />
        <Scatter
          name="Fora do MVP" data={foraData} fill="#9ca3af"
          shape={makeDot('#9ca3af', 'var(--ifm-color-emphasis-600)')}
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
}

export default function ValueEffortMatrix(): ReactNode {
  return (
    <div className="crianex-flow" style={{height: 520, padding: '0.5rem'}}>
      <BrowserOnly fallback={<div style={{padding: '2rem', textAlign: 'center'}}>Carregando matriz…</div>}>
        {() => <Chart />}
      </BrowserOnly>
    </div>
  );
}
