<script lang="ts">
  import { onMount } from 'svelte';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';

  const MIN_LENGTH = 8;
  const MAX_LENGTH = 72;

  let checkingLink = $state(true);
  let validLink = $state(false);
  let password = $state('');
  let confirmPassword = $state('');
  let saving = $state(false);
  let done = $state(false);
  let errorMessage = $state('');

  function replaceLocation(path: string): void {
    window.location.replace(path);
  }

  onMount(async () => {
    const { supabase } = await import('$lib/api/supabase');
    if (!supabase) {
      errorMessage = 'Serviço de autenticação não disponível.';
      checkingLink = false;
      return;
    }

    try {
      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get('code');

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) throw error;
      }

      // Fluxo implícito (#access_token=...&type=recovery) é detectado
      // automaticamente pelo client (detectSessionInUrl), então basta
      // conferir se já existe sessão após o processamento da URL.
      const { data } = await supabase.auth.getSession();
      validLink = Boolean(data.session);

      if (!validLink) {
        errorMessage = 'Link de redefinição inválido ou expirado. Solicite um novo link.';
      }
    } catch {
      errorMessage = 'Link de redefinição inválido ou expirado. Solicite um novo link.';
    } finally {
      checkingLink = false;
    }
  });

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    errorMessage = '';

    if (password.length < MIN_LENGTH) {
      errorMessage = `A senha precisa ter pelo menos ${MIN_LENGTH} caracteres.`;
      return;
    }
    if (password !== confirmPassword) {
      errorMessage = 'As senhas não coincidem.';
      return;
    }

    saving = true;
    try {
      const { supabase } = await import('$lib/api/supabase');
      if (!supabase) {
        errorMessage = 'Serviço de autenticação não disponível.';
        return;
      }

      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        errorMessage =
          'Não foi possível atualizar a senha. Solicite um novo link e tente novamente.';
        return;
      }

      done = true;

      try {
        await supabase.auth.signOut({ scope: 'local' });
      } catch {
        // best-effort: limpa sessão local antes do redirect
      }

      setTimeout(() => replaceLocation('/admin/login'), 2200);
    } catch {
      errorMessage = 'Não foi possível conectar ao serviço de autenticação agora.';
    } finally {
      saving = false;
    }
  }
</script>

<svelte:head>
  <title>Redefinir senha - Crianex Admin</title>
</svelte:head>

<div class="admin-root recover-root">
  <main class="recover-card">
    <span class="tag">Área restrita</span>
    <h1>Definir nova senha.</h1>

    {#if checkingLink}
      <p>Validando link de redefinição…</p>
    {:else if done}
      <p class="success-message" role="status">
        Senha atualizada com sucesso! Redirecionando para o login…
      </p>
    {:else if !validLink}
      <p class="error-message" role="alert">{errorMessage}</p>
      <a class="back-link" href="/admin/login/esqueci-senha">Solicitar novo link</a>
    {:else}
      <p>Escolha uma nova senha para acessar o painel.</p>

      <form class="form-fields" onsubmit={handleSubmit}>
        <div class="field">
          <Label for="new-password">Nova senha</Label>
          <Input
            class="login-input"
            id="new-password"
            type="password"
            placeholder="••••••••"
            autocomplete="new-password"
            bind:value={password}
            disabled={saving}
            minlength={MIN_LENGTH}
            maxlength={MAX_LENGTH}
            required
          />
        </div>

        <div class="field">
          <Label for="confirm-password">Confirmar nova senha</Label>
          <Input
            class="login-input"
            id="confirm-password"
            type="password"
            placeholder="••••••••"
            autocomplete="new-password"
            bind:value={confirmPassword}
            disabled={saving}
            minlength={MIN_LENGTH}
            maxlength={MAX_LENGTH}
            required
          />
        </div>

        <Button class="submit-button" type="submit" disabled={saving}>
          {saving ? 'Salvando…' : 'Salvar nova senha'}
        </Button>

        {#if errorMessage}
          <p class="error-message" role="alert">{errorMessage}</p>
        {/if}
      </form>
    {/if}
  </main>
</div>

<style>
  :global(html, body) {
    margin: 0;
    padding: 0;
    height: 100%;
  }

  .admin-root {
    font-family: 'Space Grotesk', system-ui, sans-serif;
  }

  .recover-root {
    display: grid;
    place-items: center;
    min-height: 100dvh;
    padding: 24px;
    box-sizing: border-box;
    background:
      radial-gradient(circle at 50% 0%, rgba(127, 63, 229, 0.28), transparent 50%),
      radial-gradient(circle at 100% 100%, rgba(231, 31, 132, 0.2), transparent 45%), #060606;
    color: #fcfcfc;
  }

  .recover-card {
    width: min(100%, 420px);
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

  .success-message {
    color: rgba(252, 252, 252, 0.85);
  }

  .form-fields {
    display: grid;
    gap: 16px;
    margin-top: 6px;
  }

  .field {
    display: grid;
    gap: 8px;
  }

  :global(.field label) {
    font-family: 'Space Mono', monospace;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(252, 252, 252, 0.62);
    font-size: 10px;
    font-weight: 700;
  }

  :global(.login-input) {
    width: 100%;
    box-sizing: border-box;
    height: 44px;
    border-radius: 8px;
    border-color: rgba(252, 252, 252, 0.62) !important;
    background: transparent !important;
    color: rgba(252, 252, 252, 0.62);
    font-size: 14px;
    padding-left: 16px;
    outline: none;
    caret-color: #fcfcfc;
    -webkit-text-fill-color: rgba(252, 252, 252, 0.62);
  }

  :global(.login-input:focus),
  :global(.login-input:focus-visible) {
    border-color: #7f3fe5 !important;
    box-shadow: 0 0 0 4px rgba(127, 63, 229, 0.18);
  }

  :global(.submit-button) {
    width: 100%;
    min-height: 48px;
    border-radius: 999px;
    border: none !important;
    background: #ffffff !important;
    color: #101010 !important;
    font-weight: 600;
    font-size: 14px;
    transition:
      background-color 0.2s ease,
      color 0.2s ease;
  }

  :global(button.submit-button:hover) {
    background: #7f3fe5 !important;
    color: #ffffff !important;
  }

  .error-message {
    color: #e71f84;
    font-size: 13px;
    font-weight: 700;
    line-height: 1.45;
  }

  .back-link {
    justify-self: start;
    color: #7f3fe5;
    font-size: 12px;
    font-weight: 700;
    text-decoration: none;
  }
</style>
