<script lang="ts">
  import { onMount } from 'svelte';
  import { ApiError } from '$lib/api/backend';
  import { authorizeAdminSession } from '$lib/api/admin-auth';

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
      await authorizeAdminSession(data.session.access_token);
      statusMessage = 'Redirecionando...';
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
  .callback-root {
    display: grid;
    place-items: center;
    min-height: 100vh;
    padding: 24px;
    background:
      radial-gradient(circle at top, rgba(127, 63, 229, 0.22), transparent 34%),
      radial-gradient(circle at bottom right, rgba(231, 31, 132, 0.16), transparent 32%), #060606;
  }

  .callback-card {
    width: min(100%, 440px);
    display: grid;
    gap: 12px;
    padding: 28px;
    border: 1px solid rgba(252, 252, 252, 0.1);
    border-radius: 20px;
    background: rgba(10, 10, 12, 0.86);
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
    font-size: clamp(28px, 4vw, 36px);
    line-height: 1;
  }

  p {
    margin: 0;
    color: rgba(252, 252, 252, 0.7);
    line-height: 1.6;
  }
</style>
