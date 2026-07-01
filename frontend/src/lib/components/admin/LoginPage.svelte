<script lang="ts">
  import { goto } from '$app/navigation';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Eye, EyeOff } from 'lucide-svelte';
  import { ApiError } from '$lib/api/backend';
  import { syncAdminSession } from '$lib/api/admin-session';

  let email = $state('');
  let password = $state('');
  let showPassword = $state(false);
  let loading = $state(false);
  let errorMessage = $state('');
  let submitHovered = $state(false);

  async function handleGoogleSignIn() {
    loading = true;
    errorMessage = '';
    try {
      const { supabase } = await import('$lib/api/supabase');
      if (!supabase) {
        errorMessage = 'Serviço de autenticação não disponível.';
        return;
      }
      const redirectTo = window.location.origin + '/admin/login/callback';
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo },
      });
      if (error) {
        errorMessage = 'Não foi possível iniciar o login com Google.';
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      errorMessage = 'Não foi possível conectar ao serviço de autenticação.';
    } finally {
      loading = false;
    }
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    errorMessage = '';

    const normalizedEmail = email.trim().toLowerCase();

    loading = true;

    try {
      const { supabase } = await import('$lib/api/supabase');
      console.log('[login] tentando signInWithPassword para', normalizedEmail);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) {
        console.error('[login] signInWithPassword error:', error.status, error.message, error);
        if (error.status === 401 || error.status === 400) {
          errorMessage = 'E-mail ou senha inválidos.';
        } else {
          errorMessage = 'Não foi possível entrar no painel agora. Tente novamente.';
        }

        return;
      }

      console.log(
        '[login] sessão obtida, user:',
        data.session?.user?.email,
        'expires_in:',
        data.session?.expires_in
      );

      if (!data.session) {
        errorMessage = 'Sessão não encontrada após o login.';
        return;
      }

      console.log('[login] sincronizando sessão com o servidor...');
      await syncAdminSession(data.session);

      await goto('/admin/painel');
    } catch (err) {
      console.error('[login] catch inesperado:', err);
      if (err instanceof ApiError && err.status === 403) {
        errorMessage = 'Conta não autorizada. Solicite acesso ao administrador.';
      } else {
        errorMessage = 'Não foi possível conectar ao serviço de autenticação agora.';
      }
    } finally {
      loading = false;
    }
  }
</script>

<div class="admin-root">
  <main class="login-page" aria-label="Login administrativo da Crianex">
    <section class="login-side" aria-labelledby="login-title">
      <div class="deco" aria-hidden="true"></div>

      <div class="brand">
        <span class="brand-mark" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </span>
        <span>Crianex Hub</span>
      </div>

      <div class="hero-copy">
        <span class="tag">Área restrita</span>
        <h1 id="login-title">Painel interno de gestão Crianex.</h1>
        <p>
          Plataforma compartilhada por produto, comercial, suporte e engenharia para auditoria de
          toda ação privilegiada.
        </p>
      </div>

      <blockquote>
        "Operação boa é aquela que deixa rastros claros antes de pedir confiança."
      </blockquote>
    </section>

    <section class="login-form-wrap" aria-labelledby="form-title">
      <div class="login-form">
        <div class="login-header">
          <h2 id="form-title">Entrar no painel</h2>
          <p>Entre com as suas credenciais de acesso ao painel administrativo.</p>
        </div>

        <Button
          class="workspace-button"
          variant="outline"
          type="button"
          disabled={loading}
          onclick={handleGoogleSignIn}
          style="background-color: transparent; color: #ffffff; border-color: #ffffff; box-shadow: none;"
        >
          <img class="google-logo" src="/assets/logo-google.png" alt="" aria-hidden="true" />
          Entrar com Google Workspace
        </Button>

        <div class="divider" aria-hidden="true">
          <span></span>
          <p>ou com senha</p>
          <span></span>
        </div>

        <form class="form-fields" onsubmit={handleSubmit}>
          <div class="field">
            <Label for="admin-email">E-mail corporativo</Label>
            <Input
              class="login-input"
              id="admin-email"
              type="email"
              placeholder="voce@gmail.com.br"
              autocomplete="email"
              bind:value={email}
              disabled={loading}
              required
            />
          </div>

          <div class="field">
            <div class="label-row">
              <Label for="admin-password">Senha</Label>
              <a href="/admin/login/esqueci-senha" aria-label="Recuperar senha">Esqueci</a>
            </div>
            <div class="password-wrap">
              <Input
                class="login-input"
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autocomplete="current-password"
                bind:value={password}
                disabled={loading}
                maxlength={72}
                required
              />
              <button
                type="button"
                class="eye-btn"
                onclick={() => (showPassword = !showPassword)}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                tabindex="-1"
              >
                {#if showPassword}
                  <EyeOff size={16} />
                {:else}
                  <Eye size={16} />
                {/if}
              </button>
            </div>
          </div>

          <button
            class="submit-button"
            style={`background-color: ${submitHovered ? '#7f3fe5' : '#ffffff'}; color: ${submitHovered ? '#ffffff' : '#101010'}; border: none;`}
            type="submit"
            disabled={loading}
            onmouseenter={() => (submitHovered = true)}
            onmouseleave={() => (submitHovered = false)}
          >
            {#if loading}
              <span class="spinner" aria-hidden="true"></span>
              Entrando
            {:else}
              Continuar
              <span aria-hidden="true">→</span>
            {/if}
          </button>

          {#if errorMessage}
            <p class="error-message" role="alert">{errorMessage}</p>
          {/if}
        </form>

        <div class="security-note">
          <span aria-hidden="true">▢</span>
          <p>
            Tentativas de acesso são auditadas. IPs fora da faixa corporativa precisam de aprovação
            adicional.
          </p>
        </div>
      </div>
    </section>
  </main>
</div>

<style>
  :global(:root) {
    --accent-soft: rgba(127, 63, 229, 0.18);
    --background: #060606;
    --foreground: #fcfcfc;
    --primary: #fcfcfc;
    --primary-foreground: #060606;
    --secondary: #1a1a1d;
    --secondary-foreground: #fcfcfc;
    --muted: #1a1a1d;
    --muted-foreground: rgba(252, 252, 252, 0.58);
    --border: rgba(252, 252, 252, 0.13);
    --input: rgba(252, 252, 252, 0.13);
    --ring: var(--purple);
    --destructive: var(--pink);
    --radius-md: 0.5rem;
  }

  :global(body) {
    font-family: 'Space Grotesk', system-ui, sans-serif;
    margin: 0;
  }

  .admin-root {
    background: #060606;
    color: #fcfcfc;
    font-family: 'Space Grotesk', system-ui, sans-serif;
  }

  .login-page {
    min-height: 100vh;
    display: grid;
    grid-template-columns: minmax(320px, 1fr) minmax(360px, 0.92fr);
    background: #0b0b0d;
    font-family: 'Space Grotesk', system-ui, sans-serif;
  }

  .login-side {
    position: relative;
    min-height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 56px;
    padding: clamp(28px, 5vw, 56px);
    background: var(--venom);
  }

  .deco {
    position: absolute;
    inset: -18% -12% auto auto;
    width: min(680px, 86vw);
    aspect-ratio: 1;
    background:
      radial-gradient(circle at 30% 25%, rgba(231, 31, 132, 0.44), transparent 28%),
      radial-gradient(circle at 67% 42%, rgba(127, 63, 229, 0.46), transparent 32%),
      radial-gradient(circle at 54% 80%, rgba(102, 223, 122, 0.25), transparent 24%);
    filter: blur(54px);
    opacity: 0.85;
    pointer-events: none;
  }

  .brand,
  .hero-copy,
  blockquote {
    position: relative;
    z-index: 1;
  }

  .brand {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-size: 15px;
    font-weight: 700;
  }

  .brand-mark {
    width: 20px;
    height: 18px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 3px;
    transform: skewX(-10deg);
  }

  .brand-mark span:nth-child(1),
  .brand-mark span:nth-child(4) {
    background: var(--pink);
  }

  .brand-mark span:nth-child(2) {
    background: var(--green);
  }

  .brand-mark span:nth-child(3) {
    background: var(--purple);
  }

  .hero-copy {
    max-width: 440px;
  }

  .tag,
  :global(.field label),
  .divider {
    font-family: var(--font-mono);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .tag {
    display: block;
    margin-bottom: 22px;
    color: rgba(252, 252, 252, 0.48);
    font-size: 11px;
  }

  h1,
  h2,
  p {
    margin: 0;
  }

  h1 {
    max-width: 12ch;
    font-size: clamp(38px, 5.5vw, 64px);
    line-height: 0.98;
    font-weight: 700;
  }

  .hero-copy p {
    max-width: 42ch;
    margin-top: 28px;
    color: rgba(252, 252, 252, 0.62);
    font-size: 14px;
    line-height: 1.7;
  }

  blockquote {
    max-width: 46ch;
    margin: 0;
    color: rgba(252, 252, 252, 0.54);
    font-size: 13px;
    line-height: 1.65;
  }

  .login-form-wrap {
    display: grid;
    place-items: center;
    padding: clamp(28px, 6vw, 64px);
    background: #0a0a0c;
    color: #fcfcfc;
  }

  .login-form {
    width: min(100%, 380px);
    display: grid;
    gap: 22px;
  }

  .login-header {
    display: grid;
    gap: 10px;
  }

  h2 {
    font-size: 26px;
    line-height: 1.1;
    font-weight: 700;
  }

  .login-header p {
    color: rgba(252, 252, 252, 0.62);
    font-size: 14px;
    line-height: 1.55;
  }

  :global(.workspace-button),
  :global(.submit-button) {
    width: 100%;
    min-height: 48px;
    border-radius: 999px;
    font-family: var(--font-sans);
    font-size: 14px;
  }

  :global(.workspace-button) {
    box-shadow: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  :global(.workspace-button:hover) {
    background-color: transparent;
    color: #ffffff;
    box-shadow: none;
  }

  .google-logo {
    width: 18px;
    height: 18px;
    display: block;
    flex: 0 0 auto;
    object-fit: contain;
  }

  .divider {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 12px;
    color: rgba(16, 16, 16, 0.42);
    font-size: 10px;
  }

  .divider span {
    height: 1px;
    background: rgba(16, 16, 16, 0.12);
  }

  .form-fields {
    display: grid;
    gap: 16px;
  }

  .field {
    display: grid;
    gap: 8px;
  }

  :global(.field label) {
    color: rgba(252, 252, 252, 0.62);
    font-size: 10px;
    font-weight: 700;
  }

  .label-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .label-row a {
    color: #7f3fe5;
    font-size: 12px;
    font-weight: 700;
    text-decoration: none;
  }

  .password-wrap {
    position: relative;
  }

  .eye-btn {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: rgba(252, 252, 252, 0.45);
    display: flex;
    align-items: center;
    line-height: 0;
    transition: color 0.15s;
  }

  .eye-btn:hover {
    color: rgba(252, 252, 252, 0.85);
  }

  :global(.login-input) {
    width: 100%;
    box-sizing: border-box;
    height: 44px;
    border-radius: 8px;
    border-color: rgba(252, 252, 252, 0.62) !important;
    background: transparent !important;
    color: rgba(252, 252, 252, 0.62);
    font-family: var(--font-sans);
    font-size: 14px;
    padding-left: 16px;
    padding-right: 40px;
    outline: none;
    caret-color: #fcfcfc;
    -webkit-text-fill-color: rgba(252, 252, 252, 0.62);
  }

  :global(.login-input::placeholder) {
    color: rgba(252, 252, 252, 0.38);
  }

  :global(.login-input:focus) {
    background: transparent !important;
  }

  :global(.login-input:focus),
  :global(.login-input:focus-visible),
  :global(.code-input input:focus-visible) {
    border-color: #7f3fe5 !important;
    box-shadow: 0 0 0 4px rgba(127, 63, 229, 0.18);
  }

  :global(.login-input:-webkit-autofill),
  :global(.login-input:-webkit-autofill:hover),
  :global(.login-input:-webkit-autofill:focus),
  :global(.login-input:-webkit-autofill:active) {
    -webkit-box-shadow: 0 0 0 1000px transparent inset !important;
    box-shadow: 0 0 0 1000px transparent inset !important;
    -webkit-text-fill-color: rgba(252, 252, 252, 0.62) !important;
    caret-color: #fcfcfc;
    transition: background-color 9999s ease-out 0s;
  }

  :global(.code-input input) {
    height: 52px;
    border-radius: 10px;
    font-family: var(--font-mono);
    font-size: 20px;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-align: center;
  }

  :global(.submit-button) {
    margin-top: 2px;
    border: none !important;
    background: #ffffff !important;
    color: #101010 !important;
    font-weight: 600;
    transition:
      background-color 0.2s ease,
      color 0.2s ease,
      transform 0.2s ease;
  }

  :global(button.submit-button:hover) {
    background: #7f3fe5 !important;
    color: #ffffff !important;
  }

  .spinner {
    width: 16px;
    height: 16px;
    border-radius: 999px;
    border: 2px solid rgba(255, 255, 255, 0.34);
    border-top-color: #ffffff;
    animation: spin 0.8s linear infinite;
  }

  .error-message {
    color: var(--pink);
    font-size: 13px;
    font-weight: 700;
    line-height: 1.45;
  }

  .security-note {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    padding: 14px 16px;
    border: 1px solid rgba(16, 16, 16, 0.08);
    border-radius: 8px;
    background: rgba(16, 16, 16, 0.06);
    color: rgba(16, 16, 16, 0.62);
    font-size: 12px;
    line-height: 1.45;
  }

  .security-note span {
    color: rgba(16, 16, 16, 0.5);
    line-height: 1.2;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 820px) {
    .login-page {
      grid-template-columns: 1fr;
    }

    .login-side {
      min-height: 220px;
      gap: 28px;
      padding: 28px;
    }

    .hero-copy p,
    blockquote {
      display: none;
    }

    h1 {
      font-size: 38px;
    }

    .login-form-wrap {
      place-items: start center;
      min-height: calc(100vh - 220px);
      padding: 32px 20px;
    }
  }

  @media (max-width: 420px) {
    .brand {
      font-size: 14px;
    }

    h1 {
      font-size: 34px;
    }

    .login-form {
      gap: 18px;
    }
  }
</style>
