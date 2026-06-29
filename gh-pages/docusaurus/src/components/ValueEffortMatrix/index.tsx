import React, {type ReactNode} from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

/* Matriz Valor (VB) × Esforço (ES) das Features — Recharts.
   Posições reais a partir dos VB/ES calculados no Miro.
   Modelo de QUADRANTES (não de reta de IP): o plano é dividido em 4
   quadrantes por duas linhas de corte (VB_SPLIT e ES_SPLIT). O Quadrante I
   (alto valor + baixo esforço) é o único pintado em verde e contém
   exatamente as features do MVP. */

type F = {id: string; vb: number; es: number; mvp: boolean; nota?: string};

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

// domínio dos eixos
const X_MIN = 5;
const X_MAX = 32;
const Y_MIN = 15;
const Y_MAX = 55;

// linhas de corte dos quadrantes — calibradas para separar exatamente as
// features com IP ≥ 1,5 (MVP) das demais, incluindo F08 (IP 1,31, fora do
// MVP mas mantida na IT2 por dependência com F07).
const VB_SPLIT = 29; // acima = "alto valor"
const ES_SPLIT = 23; // abaixo = "baixo esforço"

function Chart(): ReactNode {
  const R = require('recharts');
  const {ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ReferenceLine, Customized, LabelList, ResponsiveContainer} = R;

  const mvp = DATA.filter((d) => d.mvp);
  const fora = DATA.filter((d) => !d.mvp);

  // Pinta apenas o Quadrante I (alto valor + baixo esforço) em verde.
  const QuadrantI = (props: any) => {
    const xMap = props.xAxisMap && (Object.values(props.xAxisMap)[0] as any);
    const yMap = props.yAxisMap && (Object.values(props.yAxisMap)[0] as any);
    if (!xMap?.scale || !yMap?.scale) return null;
    const xs = xMap.scale;
    const ys = yMap.scale;
    const x0 = xs(X_MIN);
    const x1 = xs(ES_SPLIT);
    const y0 = ys(VB_SPLIT);
    const y1 = ys(Y_MAX);
    return <rect x={x0} y={y1} width={x1 - x0} height={y0 - y1} fill="#66df7a" fillOpacity={0.18} stroke="none" />;
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
      const d = payload[0].payload as F;
      return (
        <div style={{background: 'var(--crianex-surface)', border: '1px solid var(--crianex-border)', borderRadius: 8, padding: '6px 10px', fontSize: 12, maxWidth: 240}}>
          <strong>{d.id}</strong> · VB {d.vb} · ES {d.es} · IP {(d.vb / d.es).toFixed(2)}
          {d.nota && <div style={{marginTop: 4, color: 'var(--ifm-color-emphasis-700)'}}>{d.nota}</div>}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={460}>
      <ScatterChart margin={{top: 24, right: 28, bottom: 36, left: 8}}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--crianex-border)" />
        {/* região do MVP = Quadrante I (alto valor / baixo esforço) */}
        <Customized component={QuadrantI} />
        <XAxis type="number" dataKey="es" name="Esforço" domain={[X_MIN, X_MAX]} tick={{fontSize: 11}} label={{value: 'Esforço (ES) →', position: 'bottom', offset: 14, fontSize: 12}} />
        <YAxis type="number" dataKey="vb" name="Valor" domain={[Y_MIN, Y_MAX]} tick={{fontSize: 11}} label={{value: 'Valor de Negócio (VB) →', angle: -90, position: 'insideLeft', fontSize: 12}} />
        {/* linhas de corte dos quadrantes */}
        <ReferenceLine x={ES_SPLIT} stroke="var(--crianex-border)" strokeDasharray="4 4" />
        <ReferenceLine y={VB_SPLIT} stroke="var(--crianex-border)" strokeDasharray="4 4" />
        <ReferenceLine
          x={ES_SPLIT}
          stroke="transparent"
          label={{value: 'Quadrante I — MVP', position: 'insideTopLeft', fill: '#1f8a3b', fontSize: 11, fontWeight: 700}}
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
