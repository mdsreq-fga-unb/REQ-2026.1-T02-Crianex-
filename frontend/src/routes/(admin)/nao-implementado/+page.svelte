<svelte:head>
  <title>Em Desenvolvimento - Crianex Admin</title>
</svelte:head>

<div class="not-impl-wrap">
  <div class="not-impl-card">
    <span class="tag">Em breve</span>
    <h1>Seção em desenvolvimento.</h1>
    <p>Esta funcionalidade ainda não foi implementada nesta iteração. Consulte o roadmap para saber quando estará disponível.</p>
    <a href="/products" class="btn-back">← Ir para Produtos</a>
  </div>
</div>

<style>
  .not-impl-wrap {
    flex: 1;
    display: grid;
    place-items: center;
    padding: 40px 24px;
  }

  .not-impl-card {
    width: min(100%, 520px);
    display: grid;
    gap: 14px;
    padding: 36px 32px;
    border: 1px solid var(--line);
    border-radius: 16px;
    background: var(--bg-elev);
  }

  .tag {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-faint);
  }

  h1 {
    margin: 0;
    font-size: clamp(22px, 3vw, 30px);
    font-weight: 700;
    line-height: 1.1;
    color: var(--text);
  }

  p {
    margin: 0;
    font-size: 13.5px;
    color: var(--text-muted);
    line-height: 1.65;
  }

  .btn-back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 4px;
    font-size: 13px;
    font-weight: 500;
    color: var(--purple);
    text-decoration: none;
    transition: opacity 0.15s;
  }

  .btn-back:hover {
    opacity: 0.75;
  }
</style>
