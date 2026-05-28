<svelte:head>
  <title>Painel Administrativo - Crianex</title>
</svelte:head>

<div class="admin-root admin-home">
  <main class="admin-home-card" aria-labelledby="admin-home-title">
    <span class="tag">Crianex Admin</span>
    <h1 id="admin-home-title">Painel administrativo.</h1>
    <p>
      Você já pode continuar o fluxo do painel. As próximas telas de gestão vão aparecer aqui.
    </p>
  </main>
</div>

<style>
  .admin-home {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 24px;
    background:
      radial-gradient(circle at top, rgba(127, 63, 229, 0.18), transparent 32%),
      radial-gradient(circle at bottom right, rgba(231, 31, 132, 0.14), transparent 30%),
      #060606;
  }

  .admin-home-card {
    width: min(100%, 640px);
    display: grid;
    gap: 12px;
    padding: 32px;
    border: 1px solid rgba(252, 252, 252, 0.1);
    border-radius: 24px;
    background: rgba(10, 10, 12, 0.9);
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.44);
    color: #fcfcfc;
  }

  .tag {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(252, 252, 252, 0.52);
  }

  h1 {
    margin: 0;
    font-size: clamp(32px, 4vw, 44px);
    line-height: 1;
  }

  p {
    margin: 0;
    color: rgba(252, 252, 252, 0.72);
    line-height: 1.6;
  }
</style>
