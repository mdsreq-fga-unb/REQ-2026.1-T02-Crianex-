<script lang="ts">
  import { onMount } from 'svelte';
  export let visible: boolean = false;
  import { apiFetch, ApiError } from '$lib/api/backend';

  type MfaStatus = {
    hasAnyFactor: boolean;
    hasVerifiedFactor: boolean;
    pendingFactorId: string | null;
    verifiedFactorId: string | null;
  };

  type MfaEnrollment = {
    id: string;
    type: 'totp';
    friendly_name?: string;
    totp: {
      qr_code: string;
      secret: string;
      uri: string;
    };
  };

  type VerifyResponse = {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      name: string;
      role: string;
    };
  };

  type StoredEnrollment = {
    enrollment: MfaEnrollment;
    friendlyName: string;
  };

  const STORAGE_KEY = 'crianex-admin-mfa-enrollment';

  let loadingStatus = true;
  let loadingEnroll = false;
  let loadingVerify = false;
  let statusMessage = '';
  let errorMessage = '';
  let hasVerifiedFactor = false;
  let pendingFactorId: string | null = null;
  let enrollment: MfaEnrollment | null = null;
  let verificationCode = '';
  let friendlyName = 'Crianex Admin';

  function restoreStoredEnrollment() {
    if (typeof sessionStorage === 'undefined') {
      return;
    }

    const rawValue = sessionStorage.getItem(STORAGE_KEY);

    if (!rawValue) {
      return;
    }

    try {
      const stored = JSON.parse(rawValue) as StoredEnrollment;

      if (stored?.enrollment?.id && stored.enrollment.type === 'totp') {
        enrollment = stored.enrollment;
        friendlyName = stored.friendlyName || friendlyName;
        pendingFactorId = stored.enrollment.id;
      }
    } catch {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }

  function saveEnrollment() {
    if (typeof sessionStorage === 'undefined' || !enrollment) {
      return;
    }

    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ enrollment, friendlyName } satisfies StoredEnrollment)
    );
  }

  function clearStoredEnrollment() {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }

  async function loadStatus() {
    try {
      const response = await apiFetch<MfaStatus>('/api/auth/mfa/status');

      hasVerifiedFactor = response.hasVerifiedFactor;
      pendingFactorId = response.pendingFactorId;

      if (response.hasVerifiedFactor) {
        clearStoredEnrollment();
        enrollment = null;
        verificationCode = '';
        statusMessage = 'O segundo fator já está ativo nesta conta.';
      } else if (response.hasAnyFactor && pendingFactorId && !enrollment) {
        statusMessage =
          'Há um cadastro TOTP pendente. Se você ainda tem o QR anterior, conclua a verificação.';
      }
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        errorMessage = 'Sessão expirada. Faça login novamente para configurar o 2FA.';
      } else {
        errorMessage = 'Não foi possível consultar o status do 2FA.';
      }
    } finally {
      loadingStatus = false;
    }
  }

  onMount(() => {
    if (!visible) return;
    restoreStoredEnrollment();
    void loadStatus();
  });

  async function startEnrollment() {
    errorMessage = '';
    statusMessage = '';
    loadingEnroll = true;

    try {
      const response = await apiFetch<MfaEnrollment>('/api/auth/mfa/enroll', {
        method: 'POST',
        body: JSON.stringify({ friendlyName }),
      });

      enrollment = response;
      pendingFactorId = response.id;
      verificationCode = '';
      saveEnrollment();
      statusMessage =
        'QR code gerado. Escaneie com o seu app autenticador e depois confirme o código.';
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        statusMessage = 'Esse usuário já possui TOTP ativo.';
      } else if (error instanceof ApiError) {
        errorMessage = error.message;
      } else {
        errorMessage = 'Não foi possível iniciar o cadastro do 2FA.';
      }
    } finally {
      loadingEnroll = false;
    }
  }

  async function confirmEnrollment() {
    if (!enrollment || verificationCode.trim().length !== 6) {
      return;
    }

    loadingVerify = true;
    errorMessage = '';
    statusMessage = '';

    try {
      await apiFetch<VerifyResponse>('/api/auth/mfa/enroll/verify', {
        method: 'POST',
        body: JSON.stringify({
          factorId: enrollment.id,
          code: verificationCode.trim(),
        }),
      });

      hasVerifiedFactor = true;
      enrollment = null;
      pendingFactorId = null;
      verificationCode = '';
      clearStoredEnrollment();
      statusMessage = '2FA ativado com sucesso.';
    } catch (error) {
      if (error instanceof ApiError) {
        errorMessage = error.message;
      } else {
        errorMessage = 'Não foi possível validar o código de ativação.';
      }
    } finally {
      loadingVerify = false;
    }
  }
</script>

{#if visible}
  <section class="mfa-card" aria-labelledby="mfa-title">
    <div class="mfa-header">
      <p class="eyebrow">Segurança da conta</p>
      <h2 id="mfa-title">Vincular app autenticador</h2>
      <p>
        Gere um QR code padrão TOTP, escaneie no aplicativo que você preferir e confirme o código de
        6 dígitos para ativar a autenticação em duas etapas.
      </p>
    </div>

    {#if loadingStatus}
      <p class="status">Carregando status do 2FA...</p>
    {:else if hasVerifiedFactor}
      <div class="success-box">
        <strong>2FA ativo</strong>
        <p>{statusMessage}</p>
      </div>
    {:else}
      <div class="enroll-grid">
        <div class="enroll-copy">
          <label for="friendly-name">Nome exibido no app</label>
          <input
            id="friendly-name"
            class="setup-input"
            type="text"
            bind:value={friendlyName}
            placeholder="Crianex Admin"
          />

          <button
            class="setup-button"
            type="button"
            on:click={startEnrollment}
            disabled={loadingEnroll}
          >
            {#if loadingEnroll}
              Gerando QR code...
            {:else}
              Gerar QR code
            {/if}
          </button>

          {#if statusMessage}
            <p class="status">{statusMessage}</p>
          {/if}

          {#if pendingFactorId && !enrollment}
            <p class="hint">
              Existe um cadastro TOTP em andamento. Se o QR anterior ainda estiver visível, conclua
              a verificação abaixo.
            </p>
          {/if}
        </div>

        {#if enrollment}
          <div class="qr-panel">
            <div class="qr-box">
              <img src={enrollment.totp.qr_code} alt={enrollment.totp.uri} />
            </div>

            <div class="secret-box">
              <span>Secret</span>
              <code>{enrollment.totp.secret}</code>
            </div>

            <div class="verify-box">
              <label for="verification-code">Código do app</label>
              <input
                id="verification-code"
                class="setup-input code-input"
                type="text"
                inputmode="numeric"
                maxlength="6"
                bind:value={verificationCode}
                placeholder="000000"
              />

              <button
                class="setup-button confirm-button"
                type="button"
                on:click={confirmEnrollment}
                disabled={loadingVerify}
              >
                {#if loadingVerify}
                  Confirmando...
                {:else}
                  Confirmar e ativar
                {/if}
              </button>
            </div>
          </div>
        {/if}
      </div>
    {/if}

    {#if errorMessage}
      <p class="error">{errorMessage}</p>
    {/if}
  </section>
{/if}

<style>
  .mfa-card {
    display: grid;
    gap: 20px;
    padding: clamp(20px, 4vw, 32px);
    border: 1px solid rgba(252, 252, 252, 0.12);
    border-radius: 24px;
    background:
      linear-gradient(180deg, rgba(252, 252, 252, 0.03), rgba(252, 252, 252, 0.01)),
      rgba(10, 10, 12, 0.88);
    box-shadow: 0 24px 90px rgba(0, 0, 0, 0.36);
  }

  .mfa-header {
    display: grid;
    gap: 10px;
  }

  .eyebrow {
    margin: 0;
    color: rgba(252, 252, 252, 0.54);
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  h2,
  p {
    margin: 0;
  }

  h2 {
    font-size: clamp(24px, 3vw, 34px);
    line-height: 1.05;
  }

  .mfa-header p:last-child {
    max-width: 64ch;
    color: rgba(252, 252, 252, 0.72);
    line-height: 1.6;
  }

  .status,
  .hint,
  .error {
    font-size: 13px;
    line-height: 1.55;
  }

  .status {
    color: #cdb7ff;
  }

  .hint {
    color: rgba(252, 252, 252, 0.62);
  }

  .error {
    color: #ff9db6;
  }

  .success-box {
    padding: 16px 18px;
    border-radius: 18px;
    background: rgba(127, 63, 229, 0.14);
    border: 1px solid rgba(127, 63, 229, 0.3);
    display: grid;
    gap: 6px;
  }

  .success-box strong {
    font-size: 14px;
  }

  .success-box p {
    color: rgba(252, 252, 252, 0.75);
    font-size: 13px;
  }

  .enroll-grid {
    display: grid;
    gap: 20px;
  }

  .enroll-copy {
    display: grid;
    gap: 12px;
  }

  .enroll-copy label,
  .verify-box label {
    color: rgba(252, 252, 252, 0.68);
    font-size: 11px;
    font-family: var(--font-mono);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .setup-input {
    width: 100%;
    min-height: 48px;
    border-radius: 12px;
    border: 1px solid rgba(252, 252, 252, 0.16);
    background: rgba(252, 252, 252, 0.03);
    color: #fcfcfc;
    padding: 0 14px;
    outline: none;
  }

  .setup-input:focus-visible {
    border-color: #7f3fe5;
    box-shadow: 0 0 0 4px rgba(127, 63, 229, 0.18);
  }

  /* svelte-ignore css_unused_selector */
  .setup-button {
    min-height: 48px;
    border-radius: 999px;
    border: 0;
    background: #ffffff;
    color: #101010;
    font-weight: 700;
    cursor: pointer;
  }

  /* svelte-ignore css_unused_selector */
  .setup-button:disabled {
    opacity: 0.6;
    cursor: progress;
  }

  .qr-panel {
    display: grid;
    gap: 16px;
    padding: 16px;
    border-radius: 22px;
    background: rgba(252, 252, 252, 0.03);
    border: 1px solid rgba(252, 252, 252, 0.1);
  }

  .qr-box {
    display: grid;
    place-items: center;
    padding: 16px;
    border-radius: 18px;
    background: #ffffff;
  }

  .qr-box img {
    width: min(100%, 240px);
    height: auto;
    display: block;
  }

  .secret-box {
    display: grid;
    gap: 8px;
  }

  .secret-box span {
    color: rgba(252, 252, 252, 0.58);
    font-size: 11px;
    font-family: var(--font-mono);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .secret-box code {
    padding: 12px 14px;
    border-radius: 12px;
    background: rgba(0, 0, 0, 0.28);
    border: 1px solid rgba(252, 252, 252, 0.1);
    color: #fcfcfc;
    font-family: var(--font-mono);
    font-size: 12px;
    word-break: break-all;
  }

  .verify-box {
    display: grid;
    gap: 10px;
  }

  .code-input {
    letter-spacing: 0.18em;
    text-align: center;
    font-family: var(--font-mono);
    font-size: 18px;
    font-weight: 700;
  }

  /* svelte-ignore css_unused_selector */
  .confirm-button {
    background: #7f3fe5;
    color: #ffffff;
  }

  @media (min-width: 920px) {
    .enroll-grid {
      grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
      align-items: start;
    }

    .qr-panel {
      align-self: start;
    }
  }
</style>
