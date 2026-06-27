import React, {type ReactNode} from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

/* Matriz Valor (VB) × Esforço (ES) das Features — Recharts.
   Posições reais a partir dos VB/ES calculados no Miro.
   MVP = alto valor / baixo esforço (quadrante superior-esquerdo). */

type F = {id: string; vb: number; es: number; mvp: boolean};

const DATA: F[] = [
  {id: 'F09', vb: 50, es: 21, mvp: true},
  {id: 'F10', vb: 50, es: 21, mvp: true},
  {id: 'F11', vb: 39, es: 18, mvp: true},
  {id: 'F12', vb: 50, es: 10, mvp: true},
  {id: 'F13', vb: 47, es: 14, mvp: true},
  {id: 'F14', vb: 50, es: 20, mvp: true},
  {id: 'F15', vb: 50, es: 15, mvp: true},
  {id: 'F16', vb: 32, es: 8, mvp: true},
  {id: 'F17', vb: 30, es: 10, mvp: true},
  {id: 'F18', vb: 30, es: 10, mvp: true},
  {id: 'F19', vb: 50, es: 20, mvp: true},
  {id: 'F20', vb: 36, es: 17, mvp: true},
  {id: 'F21', vb: 50, es: 16, mvp: true},
  {id: 'F07', vb: 39, es: 22, mvp: true},
  {id: 'F08', vb: 21, es: 16, mvp: true},
  {id: 'F22', vb: 25, es: 19, mvp: false},
  {id: 'F23', vb: 20, es: 18, mvp: false},
  {id: 'F01', vb: 18, es: 19, mvp: false},
  {id: 'F02', vb: 27, es: 25, mvp: false},
  {id: 'F03', vb: 27, es: 26, mvp: false},
  {id: 'F04', vb: 26, es: 30, mvp: false},
  {id: 'F05', vb: 33, es: 29, mvp: false},
  {id: 'F06', vb: 22, es: 22, mvp: false},
];

// domínio dos eixos
const X_MIN = 5;
const X_MAX = 32;
const Y_MIN = 15;
const Y_MAX = 55;
const IP_MVP = 1.5; // limiar do MVP (Q1): VB / ES ≥ 1,5

function Chart(): ReactNode {
  const R = require('recharts');
  const {ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ReferenceLine, Customized, LabelList, ResponsiveContainer} = R;

  const mvp = DATA.filter((d) => d.mvp);
  const fora = DATA.filter((d) => !d.mvp);

  // Região do MVP = acima da reta VB = IP_MVP · ES (Q1). Polígono exato dentro do box.
  const MvpRegion = (props: any) => {
    const xMap = props.xAxisMap && Object.values(props.xAxisMap)[0] as any;
    const yMap = props.yAxisMap && Object.values(props.yAxisMap)[0] as any;
    if (!xMap?.scale || !yMap?.scale) return null;
    const xs = xMap.scale;
    const ys = yMap.scale;
    const esBottom = Y_MIN / IP_MVP; // ES onde a reta cruza VB = Y_MIN
    const vbRight = IP_MVP * X_MAX; // VB da reta em ES = X_MAX
    const verts: [number, number][] = [
      [X_MIN, Y_MIN],
      [esBottom, Y_MIN],
      [X_MAX, vbRight],
      [X_MAX, Y_MAX],
      [X_MIN, Y_MAX],
    ];
    const pts = verts.map(([es, vb]) => `${xs(es)},${ys(vb)}`).join(' ');
    return <polygon points={pts} fill="#66df7a" fillOpacity={0.16} stroke="none" />;
  };

  const renderLabel = (props: any) => {
    const {x, y, value} = props;
    return (
      <text x={x} y={y - 9} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--ifm-color-emphasis-800)">
        {value}
      </text>
    );
  };

  const tip = ({active, payload}: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div style={{background: 'var(--crianex-surface)', border: '1px solid var(--crianex-border)', borderRadius: 8, padding: '6px 10px', fontSize: 12}}>
          <strong>{d.id}</strong> · VB {d.vb} · ES {d.es} · IP {(d.vb / d.es).toFixed(2)}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={460}>
      <ScatterChart margin={{top: 24, right: 28, bottom: 36, left: 8}}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--crianex-border)" />
        {/* região do MVP = Q1 (acima da reta IP = 1,5) */}
        <Customized component={MvpRegion} />
        <XAxis type="number" dataKey="es" name="Esforço" domain={[X_MIN, X_MAX]} tick={{fontSize: 11}} label={{value: 'Esforço (ES) →', position: 'bottom', offset: 14, fontSize: 12}} />
        <YAxis type="number" dataKey="vb" name="Valor" domain={[Y_MIN, Y_MAX]} tick={{fontSize: 11}} label={{value: 'Valor de Negócio (VB) →', angle: -90, position: 'insideLeft', fontSize: 12}} />
        <ReferenceLine
          segment={[{x: Y_MIN / IP_MVP, y: Y_MIN}, {x: X_MAX, y: IP_MVP * X_MAX}]}
          stroke="#16a34a" strokeWidth={1.5} strokeDasharray="5 4" ifOverflow="hidden"
          label={{value: 'MVP · IP ≥ 1,5', position: 'insideTopLeft', fill: '#1f8a3b', fontSize: 11, fontWeight: 700}}
        />
        <ZAxis range={[90, 90]} />
        <Tooltip content={tip} cursor={{strokeDasharray: '3 3'}} />
        <Scatter name="MVP" data={mvp} fill="#7f3fe5">
          <LabelList dataKey="id" content={renderLabel} />
        </Scatter>
        <Scatter name="Fora do MVP" data={fora} fill="#9ca3af">
          <LabelList dataKey="id" content={renderLabel} />
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
}

export default function ValueEffortMatrix(): ReactNode {
  return (
    <div className="crianex-flow" style={{height: 500, padding: '0.5rem'}}>
      <BrowserOnly fallback={<div style={{padding: '2rem', textAlign: 'center'}}>Carregando matriz…</div>}>
        {() => <Chart />}
      </BrowserOnly>
    </div>
  );
}
