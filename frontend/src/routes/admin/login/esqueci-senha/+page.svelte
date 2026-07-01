<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';

  let email = $state('');
  let loading = $state(false);
  let sent = $state(false);
  let errorMessage = $state('');

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    errorMessage = '';
    loading = true;

    try {
      const { supabase } = await import('$lib/api/supabase');
      if (!supabase) {
        errorMessage = 'Serviço de autenticação não disponível.';
        return;
      }

      const redirectTo = window.location.origin + '/admin/login/redefinir-senha';

      // O Supabase sempre retorna sucesso aqui, exista ou não o e-mail
      // cadastrado, evitando enumeração de contas (OWASP A07).
      await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), { redirectTo });

      sent = true;
    } catch {
      errorMessage = 'Não foi possível conectar ao serviço de autenticação agora. Tente novamente.';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Recuperar senha - Crianex Admin</title>
</svelte:head>

<div class="admin-root recover-root">
  <main class="recover-card">
    <span class="tag">Área restrita</span>
    <h1>Recuperar acesso.</h1>

    {#if sent}
      <p class="success-message" role="status">
        Se o e-mail informado estiver cadastrado, você receberá um link de redefinição de senha em
        instantes. Confira também a caixa de spam.
      </p>
      <a class="back-link" href="/admin/login">Voltar para o login</a>
    {:else}
      <p>Informe o e-mail corporativo cadastrado para receber um link de redefinição de senha.</p>

      <form class="form-fields" onsubmit={handleSubmit}>
        <div class="field">
          <Label for="recover-email">E-mail corporativo</Label>
          <Input
            class="login-input"
            id="recover-email"
            type="email"
            placeholder="voce@gmail.com.br"
            autocomplete="email"
            bind:value={email}
            disabled={loading}
            required
          />
        </div>

        <Button class="submit-button" type="submit" disabled={loading}>
          {loading ? 'Enviando…' : 'Enviar link de recuperação'}
        </Button>

        {#if errorMessage}
          <p class="error-message" role="alert">{errorMessage}</p>
        {/if}

        <a class="back-link" href="/admin/login">Voltar para o login</a>
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
