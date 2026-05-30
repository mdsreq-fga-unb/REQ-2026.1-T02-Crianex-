<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { ApiError } from '$lib/api/backend';
  import { authorizeAdminSession } from '$lib/api/admin-auth';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';

  let email = $state('');
  let password = $state('');
  let loading = $state(false);
  let errorMessage = $state('');
  let submitHovered = $state(false);
  let showErrorModal = $state(false);

  function showError(msg: string) {
    errorMessage = msg;
    showErrorModal = true;
  }

  function dismissError() {
    showErrorModal = false;
  }

  async function validateSessionAndRedirect(): Promise<boolean> {
    const { supabase } = await import('$lib/api/supabase');
    const { data } = await supabase.auth.getSession();

    if (!data.session) {
      return false;
    }

    try {
      // Sync client session to server HttpOnly cookies
      const resp = await fetch('/api/admin/session', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          accessToken: data.session.access_token,
          refreshToken: (data.session as any).refresh_token,
          expiresAt: (data.session as any).expires_at,
        }),
      });

      if (!resp.ok) {
        await supabase.auth.signOut();
        const payload = await resp.json().catch(() => ({}));
        showError(payload?.message ?? 'Não foi possível validar sua sessão agora.');
        return false;
      }

      await supabase.auth.signOut();
      await goto('/admin');
      return true;
    } catch (error) {
      await supabase.auth.signOut();

      if (error instanceof ApiError && error.status === 403) {
        showError('Conta não autorizada. Solicite acesso ao administrador.');
      } else {
        showError('Não foi possível validar sua sessão agora.');
      }

      return false;
    }
  }

  onMount(async () => {
    const queryMessage = new URLSearchParams(window.location.search).get('error');

    if (queryMessage) {
      showError(queryMessage);
    }

    try {
      await validateSessionAndRedirect();
    } catch {
      // A tela deve renderizar mesmo quando o Supabase ainda nao estiver configurado localmente.
    }
  });

  async function handleGoogleSignIn() {
    errorMessage = '';
    loading = true;

    try {
      const { supabase } = await import('$lib/api/supabase');
      const redirectTo = `${window.location.origin}/admin/login/callback`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
        },
      });

      if (error) {
        showError('Não foi possível iniciar o login com Google agora.');
      }
    } catch {
      showError('Não foi possível iniciar o login com Google agora.');
    } finally {
      loading = false;
    }
  }

  async function handleSubmit() {
    errorMessage = '';

    const normalizedEmail = email.trim().toLowerCase();

    loading = true;

    try {
      const { supabase } = await import('$lib/api/supabase');
      const { error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) {
        if (error.status === 401 || error.status === 400) {
          showError('E-mail ou senha inválidos.');
        } else {
          showError('Não foi possível entrar no painel agora. Tente novamente.');
        }

        return;
      }

      const authorized = await validateSessionAndRedirect();

      if (!authorized && !showErrorModal) {
        showError('Conta não autorizada. Solicite acesso ao administrador.');
      }
    } catch {
      showError('Não foi possível conectar ao serviço de autenticação agora.');
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
          class="google-btn workspace-button"
          variant="outline"
          type="button"
          disabled={loading}
          onclick={handleGoogleSignIn}
        >
          <img class="google-logo" src="/assets/logo-google.png" alt="" aria-hidden="true" />
          Entrar com Google
        </Button>

        <div class="divider" aria-hidden="true">
          <span></span>
          <p>ou com senha</p>
          <span></span>
        </div>

        <form
          class="form-fields"
          onsubmit={(event) => {
            event.preventDefault();
            void handleSubmit();
          }}
        >
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
              <a href="/admin/login" aria-label="Recuperar senha">Esqueci</a>
            </div>
            <Input
              class="login-input"
              id="admin-password"
              type="password"
              placeholder="••••••••"
              autocomplete="current-password"
              bind:value={password}
              disabled={loading}
              required
            />
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

  {#if showErrorModal}
    <div class="modal-backdrop" role="presentation" onclick={dismissError}>
      <div
        class="modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onclick={(e) => e.stopPropagation()}
      >
        <div class="modal-icon" aria-hidden="true">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <div class="modal-body">
          <p id="modal-title" class="modal-title">Falha na autenticação</p>
          <p class="modal-message">{errorMessage}</p>
        </div>
        <button class="modal-close" onclick={dismissError} aria-label="Fechar">✕</button>
      </div>
    </div>
  {/if}
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
    height: 100dvh;
    overflow: hidden;
  }

  .login-page {
    height: 100dvh;
    display: grid;
    grid-template-columns: minmax(320px, 1fr) minmax(360px, 0.92fr);
    background: #0b0b0d;
    font-family: 'Space Grotesk', system-ui, sans-serif;
    overflow: hidden;
  }

  .login-side {
    position: relative;
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
    padding: clamp(20px, 4vw, 48px) clamp(20px, 6vw, 64px);
    background: #0a0a0c;
    color: #fcfcfc;
    overflow-y: auto;
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

  :global(.google-btn) {
    background: transparent;
    color: #fcfcfc;
    border-color: rgba(252, 252, 252, 0.14);
    box-shadow: none;
    transition:
      border-color 0.2s ease,
      background-color 0.2s ease,
      transform 0.2s ease;
  }

  :global(.google-btn:hover) {
    background: rgba(252, 252, 252, 0.04) !important;
    border-color: #fcfcfc !important;
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

  :global(.login-input) {
    height: 44px;
    border-radius: 8px;
    border-color: rgba(252, 252, 252, 0.62) !important;
    background: transparent !important;
    color: rgba(252, 252, 252, 0.62);
    font-family: var(--font-sans);
    font-size: 14px;
    padding-left: 16px;
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

  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.72);
    display: grid;
    place-items: center;
    padding: 20px;
    z-index: 100;
    backdrop-filter: blur(4px);
    animation: fadeIn 0.15s ease;
  }

  .modal {
    width: min(100%, 400px);
    background: #111114;
    border: 1px solid rgba(231, 31, 132, 0.32);
    border-radius: 16px;
    padding: 24px;
    display: flex;
    align-items: flex-start;
    gap: 16px;
    box-shadow:
      0 0 0 1px rgba(231, 31, 132, 0.12),
      0 24px 64px rgba(0, 0, 0, 0.6);
    animation: slideUp 0.2s ease;
    position: relative;
  }

  .modal-icon {
    flex-shrink: 0;
    color: var(--pink);
    margin-top: 2px;
  }

  .modal-body {
    flex: 1;
    display: grid;
    gap: 6px;
  }

  .modal-title {
    font-size: 14px;
    font-weight: 700;
    color: #fcfcfc;
  }

  .modal-message {
    font-size: 13px;
    color: rgba(252, 252, 252, 0.7);
    line-height: 1.5;
  }

  .modal-close {
    position: absolute;
    top: 14px;
    right: 14px;
    background: none;
    border: none;
    color: rgba(252, 252, 252, 0.4);
    font-size: 14px;
    cursor: pointer;
    padding: 4px;
    line-height: 1;
    transition: color 0.15s;
  }

  .modal-close:hover {
    color: #fcfcfc;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      transform: translateY(8px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 820px) {
    .admin-root {
      height: auto;
      overflow: auto;
    }

    .login-page {
      height: auto;
      min-height: 100dvh;
      grid-template-columns: 1fr;
      overflow: visible;
    }

    .login-side {
      height: auto;
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
      padding: 32px 20px 40px;
      overflow-y: visible;
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
