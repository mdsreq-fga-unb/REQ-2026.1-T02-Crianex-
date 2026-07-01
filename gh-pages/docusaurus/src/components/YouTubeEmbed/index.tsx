import React from 'react';

interface Props {
  videoId: string;
  title: string;
}

/* Player do YouTube embutido como evidência (ex.: RNF19 — vídeo de navegação em
   3 cliques). Wrapper com padding-top: 56.25% mantém a proporção 16:9 responsiva
   sem depender da largura fixa de um <iframe> comum. */
export default function YouTubeEmbed({videoId, title}: Props): React.ReactElement {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        paddingTop: '56.25%',
        margin: '1rem 0',
        borderRadius: 'var(--crianex-radius)',
        overflow: 'hidden',
        border: '1px solid var(--crianex-border)',
        boxShadow: 'var(--crianex-shadow)',
      }}
    >
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 0,
        }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
