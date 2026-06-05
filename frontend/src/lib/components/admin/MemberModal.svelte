<script lang="ts">
  import { getInitials, validateEmail, type Member } from '$lib/utils/membros';
  import { ApiError } from '$lib/api/backend';

  let {
    isOpen = false,
    isEditing = false,
    member = {},
    onClose,
    onSave,
  } = $props<{
    isOpen: boolean;
    isEditing: boolean;
    member: Partial<Member>;
    onClose: () => void;
    onSave: (m: Partial<Member>) => Promise<void> | void;
  }>();

  let name = $state('');
  let email = $state('');
  let role = $state<'owner' | 'member'>('member');

  let loading = $state(false);
  let errorMessage = $state('');
  let emailError = $state('');

  $effect(() => {
    if (isOpen) {
      name = member.name || '';
      email = member.email || '';
      role = member.role || 'member';
      errorMessage = '';
      emailError = '';
    }
  });

  let initials = $derived(getInitials(name || member.name || ''));

  async function handleSubmit(e: Event) {
    e.preventDefault();
    errorMessage = '';
    emailError = '';

    const cleanedName = name.trim();
    const cleanedEmail = email.trim().toLowerCase();

    if (!cleanedName) {
      errorMessage = 'Por favor, preencha o nome.';
      return;
    }

    if (!isEditing && (!cleanedEmail || !validateEmail(cleanedEmail))) {
      emailError = 'Insira um e-mail válido (ex: nome@empresa.com).';
      return;
    }

    loading = true;
    try {
      await onSave({ ...member, name: cleanedName, email: cleanedEmail, role });
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status === 409) {
        emailError = err.message || 'E-mail já cadastrado na plataforma.';
      } else if (err instanceof Error) {
        errorMessage = err.message || 'Falha ao salvar membro. Tente novamente.';
      } else {
        errorMessage = 'Falha ao salvar membro. Tente novamente.';
      }
    } finally {
      loading = false;
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && !loading) onClose();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
  <div class="admin-overlay" role="presentation">
    <div class="admin-modal" role="dialog" aria-modal="true" aria-labelledby="member-modal-title">
      <header class="admin-modal-head">
        <h3 id="member-modal-title">{isEditing ? 'Editar membro' : 'Adicionar membro'}</h3>
        <button class="x" type="button" onclick={onClose} disabled={loading} aria-label="Fechar">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </header>

      <form onsubmit={handleSubmit}>
        <div class="admin-modal-body">
          <div class="avatar-edit-wrap">
            <div class="avatar-edit" aria-label="Avatar do membro" role="img">
              <span class="avatar-initials">{initials}</span>
            </div>
          </div>

          {#if errorMessage}
            <div class="error-banner" role="alert">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{errorMessage}</span>
            </div>
          {/if}

          <div class="fld-group">
            <div class="fld">
              <label for="m-name">Nome</label>
              <input
                type="text"
                id="m-name"
                placeholder="ex. Marina Pereira"
                bind:value={name}
                required
                disabled={loading}
              />
            </div>

            <div class="fld">
              <label for="m-email">E-mail</label>
              <input
                type="email"
                id="m-email"
                placeholder="nome@crianex.com.br"
                bind:value={email}
                required
                disabled={isEditing || loading}
                class:fld-input-err={emailError}
              />
              {#if emailError}
                <span class="fld-err" role="alert">{emailError}</span>
              {:else if isEditing}
                <span class="fld-hint">O e-mail não pode ser alterado após o cadastro.</span>
              {/if}
            </div>

            <div class="fld">
              <label for="m-role">Papel de Acesso</label>
              <select id="m-role" bind:value={role} disabled={loading}>
                <option value="member">Member</option>
                <option value="owner">Owner</option>
              </select>
            </div>
          </div>
        </div>

        <footer class="admin-modal-foot">
          <button type="button" class="btn ghost sm" onclick={onClose} disabled={loading}>
            Cancelar
          </button>
          <button type="submit" class="btn sm" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </footer>
      </form>
    </div>
  </div>
{/if}

<style>
  .avatar-edit-wrap {
    display: flex;
    justify-content: center;
    padding-bottom: 8px;
  }

  .avatar-edit {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--purple), var(--pink));
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
  }

  .avatar-initials {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-mono);
    font-size: 22px;
    font-weight: 600;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    z-index: 1;
    pointer-events: none;
  }

  .error-banner {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    background: rgba(239, 68, 68, 0.08);
    border: 1px solid rgba(239, 68, 68, 0.25);
    border-radius: 8px;
    padding: 10px 12px;
    color: #ef4444;
    font-size: 13px;
    line-height: 1.4;
  }

  .fld-input-err {
    border-color: #ef4444 !important;
  }

  .fld-err {
    font-size: 11.5px;
    color: #ef4444;
    margin-top: 2px;
  }

  .fld-hint {
    font-size: 11.5px;
    color: var(--text-faint);
    margin-top: 2px;
  }
</style>
