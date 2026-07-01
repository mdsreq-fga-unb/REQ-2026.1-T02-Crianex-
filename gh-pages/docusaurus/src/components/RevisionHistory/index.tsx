import React, {type ReactNode} from 'react';

type Row = (string | ReactNode)[];

interface Props {
  headers: string[];
  rows: Row[];
  title?: string;
}

/**
 * Histórico de revisão recolhível — começa minimizado, expande ao clicar.
 * Renderizado ao final de toda página que possui histórico.
 */
export default function RevisionHistory({headers, rows, title = 'Histórico de Revisão'}: Props): ReactNode {
  return (
    <details className="crianex-revisions">
      <summary>
        {title} <span style={{opacity: 0.6, fontWeight: 400}}>· {rows.length} versões</span>
      </summary>
      <div className="crianex-revisions__body">
        <table>
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
