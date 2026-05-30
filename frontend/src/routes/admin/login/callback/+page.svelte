<script lang="ts">
  import { onMount } from 'svelte';
  import { ApiError } from '$lib/api/backend';
  import { syncAdminSession } from '$lib/api/admin-session';

  let statusMessage = $state('Processando autenticação com Google...');

  function replaceLocation(path: string): void {
    window.location.replace(path);
  }

  onMount(async () => {
    const searchParams = new URLSearchParams(window.location.search);
    const oauthError = searchParams.get('error') || searchParams.get('error_description');

    if (oauthError) {
      replaceLocation(
        `/admin/login?error=${encodeURIComponent('Autenticação com Google cancelada ou falhou.')}`
      );
      return;
    }

    const { supabase } = await import('$lib/api/supabase');

    try {
      const code = searchParams.get('code');

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          throw error;
        }
      }

      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        throw new Error('Sessão não encontrada após o callback do Google.');
      }

      statusMessage = 'Validando permissões...';
      await syncAdminSession(data.session);
      statusMessage = 'Redirecionando...';

      try {
        await supabase.auth.signOut();
      } catch {
        // best-effort: limpa sessão local antes do redirect
      }

      replaceLocation('/admin');
    } catch (error) {
      try {
        await supabase.auth.signOut();
      } catch {
        // Ignora falhas ao limpar a sessão local; o próximo redirect já cairá no login.
      }

      const unauthorized = error instanceof ApiError && error.status === 403;
      replaceLocation(
        `/admin/login?error=${encodeURIComponent(
          unauthorized
            ? 'Conta não autorizada. Solicite acesso ao administrador.'
            : 'Autenticação com Google cancelada ou falhou.'
        )}`
      );
    }
  });
</script>

<svelte:head>
  <title>Autenticando - Crianex Admin</title>
</svelte:head>

<div class="admin-root callback-root" aria-live="polite">
  <main class="callback-card">
    <span class="tag">Google OAuth</span>
    <h1>Validando sua sessão.</h1>
    <p>{statusMessage}</p>
  </main>
</div>

<style>
  :global(html, body) {
    margin: 0;
    padding: 0;
    height: 100%;
  }

  .callback-root {
    display: grid;
    place-items: center;
    height: 100dvh;
    padding: 24px;
    box-sizing: border-box;
    background:
      radial-gradient(circle at 50% 0%, rgba(127, 63, 229, 0.28), transparent 50%),
      radial-gradient(circle at 100% 100%, rgba(231, 31, 132, 0.2), transparent 45%), #060606;
    font-family: 'Space Grotesk', system-ui, sans-serif;
    color: #fcfcfc;
  }

  .callback-card {
    width: min(100%, 440px);
    display: grid;
    gap: 14px;
    padding: 32px;
    border: 1px solid rgba(252, 252, 252, 0.1);
    border-radius: 20px;
    background: rgba(10, 10, 12, 0.82);
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.5);
  }

  .tag {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(252, 252, 252, 0.48);
  }

  h1 {
    margin: 0;
    font-size: clamp(26px, 4vw, 34px);
    line-height: 1.05;
    font-weight: 700;
  }

  p {
    margin: 0;
    font-size: 14px;
    color: rgba(252, 252, 252, 0.65);
    line-height: 1.6;
  }
</style>
