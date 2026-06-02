<script lang="ts">
  import { validateEmail, type Member } from '$lib/utils/membros';

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
  let status = $state<'active' | 'inactive'>('active');

  let loading = $state(false);
  let errorMessage = $state('');

  // Sync internal state when member prop changes
  $effect(() => {
    name = member.name || '';
    email = member.email || '';
    role = member.role || 'member';
    status = member.status || 'active';
    errorMessage = '';
  });

  async function handleSubmit(e: Event) {
    e.preventDefault();
    errorMessage = '';

    const cleanedName = name.trim();
    const cleanedEmail = email.trim().toLowerCase();

    if (!cleanedName || !cleanedEmail) {
      errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
      return;
    }

    if (!validateEmail(cleanedEmail)) {
      errorMessage = 'Por favor, insira um e-mail válido (ex: nome@empresa.com).';
      return;
    }

    loading = true;
    try {
      await onSave({
        ...member,
        name: cleanedName,
        email: cleanedEmail,
        role,
        status,
      });
    } catch (err: any) {
      errorMessage = err.message || 'Falha ao salvar membro. Tente novamente.';
    } finally {
      loading = false;
    }
  }
</script>

{#if isOpen}
  <div class="modal-overlay">
    <div class="modal" role="dialog" aria-labelledby="modal-title">
      <header class="modal-header">
        <h3 id="modal-title">{isEditing ? 'Editar Membro' : 'Cadastrar Membro'}</h3>
        <button class="modal-close-btn" onclick={onClose} disabled={loading}>&times;</button>
      </header>

      <form class="modal-body" onsubmit={handleSubmit}>
        {#if errorMessage}
          <div class="error-banner" role="alert">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="error-icon"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{errorMessage}</span>
          </div>
        {/if}

        <div class="fld">
          <label for="name">Nome Completo *</label>
          <input
            type="text"
            id="name"
            placeholder="ex. Marina Pereira"
            bind:value={name}
            required
            disabled={loading}
          />
        </div>

        <div class="fld">
          <label for="email">E-mail Corporativo *</label>
          <input
            type="email"
            id="email"
            placeholder="nome@crianex.com.br"
            bind:value={email}
            required
            disabled={isEditing || loading}
          />
          {#if isEditing}
            <span class="field-hint">O e-mail não pode ser alterado após o cadastro.</span>
          {/if}
        </div>

        <div class="fld-row">
          <div class="fld">
            <label for="role">Papel de Acesso *</label>
            <select id="role" bind:value={role} disabled={loading}>
              <option value="member">Member</option>
              <option value="owner">Owner</option>
            </select>
          </div>

          <div class="fld">
            <label for="status">Status *</label>
            <select id="status" bind:value={status} disabled={loading}>
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
          </div>
        </div>

        <footer class="modal-footer">
          <button type="button" class="btn-cancel" onclick={onClose} disabled={loading}>
            Cancelar
          </button>
          <button type="submit" class="btn-submit" disabled={loading}>
            {#if loading}
              Salvando...
            {:else}
              {isEditing ? 'Salvar Alterações' : 'Cadastrar e Enviar Convite'}
            {/if}
          </button>
        </footer>
      </form>
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(6, 6, 6, 0.6);
    backdrop-filter: blur(2px);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }

  .modal {
    background-color: var(--bg-elev);
    border: 1px solid var(--line);
    border-radius: 12px;
    width: 100%;
    max-width: 520px;
    display: flex;
    flex-direction: column;
    box-shadow: var(--shadow-3);
    animation: modalIn 0.2s ease-out;
  }

  @keyframes modalIn {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid var(--line);
  }

  .modal-header h3 {
    font-size: 16px;
    font-weight: 600;
    color: var(--text);
  }

  .modal-close-btn {
    background: transparent;
    border: none;
    font-size: 22px;
    color: var(--text-muted);
    cursor: pointer;
  }

  .modal-close-btn:hover {
    color: var(--text);
  }

  .modal-body {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .error-banner {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    background-color: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 6px;
    padding: 10px 12px;
    color: #ef4444;
    font-size: 13px;
    line-height: 1.4;
  }

  .error-icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .fld {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .fld label {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    text-transform: uppercase;
    font-weight: 600;
  }

  .fld input,
  .fld select {
    background-color: var(--bg);
    border: 1px solid var(--line);
    border-radius: 6px;
    padding: 10px 12px;
    font-family: inherit;
    font-size: 13.5px;
    color: var(--text);
    outline: none;
    transition: border-color 0.2s;
  }

  .fld input:focus,
  .fld select:focus {
    border-color: var(--purple);
  }

  .fld input:disabled,
  .fld select:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .field-hint {
    font-size: 11px;
    color: var(--text-faint);
    margin-top: 2px;
  }

  .fld-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding-top: 8px;
    border-top: 1px solid var(--line);
    margin-top: 12px;
  }

  .btn-cancel {
    background: transparent;
    color: var(--text-muted);
    border: 1px solid var(--line);
    border-radius: 6px;
    padding: 10px 16px;
    font-size: 13.5px;
    font-weight: 500;
    cursor: pointer;
    transition:
      border-color 0.2s,
      color 0.2s;
  }

  .btn-cancel:hover:not(:disabled) {
    border-color: var(--line-strong);
    color: var(--text);
  }

  .btn-cancel:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-submit {
    background-color: #ffffff;
    color: #101010;
    border: none;
    border-radius: 6px;
    padding: 10px 16px;
    font-size: 13.5px;
    font-weight: 600;
    cursor: pointer;
    transition:
      background-color 0.2s,
      opacity 0.2s;
  }

  .btn-submit:hover:not(:disabled) {
    background-color: var(--purple);
    color: #ffffff;
  }

  .btn-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    .modal-overlay {
      padding: 12px;
    }

    .fld-row {
      grid-template-columns: 1fr;
    }
  }
</style>
