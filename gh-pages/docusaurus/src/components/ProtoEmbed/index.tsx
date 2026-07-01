import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

interface Props {
  path: string;
  height?: number;
  label?: string;
}

export default function ProtoEmbed({ path, height = 580, label = 'Abrir em tela cheia' }: Props) {
  const url = useBaseUrl(path);
  return (
    <div style={{ margin: '1rem 0' }}>
      <p style={{ marginBottom: '0.5rem' }}>
        <a href={url} target="_blank" rel="noopener noreferrer">
          🔗 {label}
        </a>
      </p>
      <iframe
        src={url}
        style={{
          width: '100%',
          height: `${height}px`,
          border: '1px solid var(--crianex-border)',
          borderRadius: '8px',
          display: 'block',
        }}
        allowFullScreen
        title={label}
      />
    </div>
  );
}
