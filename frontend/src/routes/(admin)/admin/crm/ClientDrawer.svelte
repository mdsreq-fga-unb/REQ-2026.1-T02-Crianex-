<script lang="ts">
  import { apiFetch } from '$lib/api/backend';
  import { X, Headphones, Mail, ArrowRight, Bot, Edit2, Check } from 'lucide-svelte';
  import type { CrmClient } from './+page.svelte';

  let { client, currentUser, columnTitle, columnColor, onClose, onUpdate } = $props<{
    client: CrmClient;
    currentUser: string;
    columnTitle: string;
    columnColor: string;
    onClose: () => void;
    onUpdate: (updated: CrmClient) => void;
  }>();

  let isEditing = $state(false);
  let isSaving = $state(false);
  let editForm = $state({ ...client });

  type InteractionType = 'nota' | 'call' | 'email';

  let activeTab = $state<InteractionType>('nota');
  let inputText = $state('');
  let isLoggingInteraction = $state(false);

  const placeholders: Record<InteractionType, string> = {
    nota: 'Anotação interna ou observação...',
    call: 'Resumo da conversa, próximos passos...',
    email: 'Conteúdo enviado, anexos...',
  };

  type Interaction = {
    id: number | string;
    type: InteractionType;
    author: string;
    text: string;
    time: string;
  };

  let interactions = $state<Interaction[]>([]);

  async function registerInteraction() {
    if (!inputText.trim()) return;
    isLoggingInteraction = true;
    try {
      await apiFetch(`/crm/clients/${client.id}/interactions`, {
        method: 'POST',
        body: JSON.stringify({ tipo: activeTab, conteudo: inputText.trim() }),
      });
      interactions = [
        { id: Date.now(), type: activeTab, author: currentUser, text: inputText.trim(), time: 'agora' },
        ...interactions,
      ];
      inputText = '';
    } catch (err) {
      console.error('Erro ao registrar interação:', err);
    } finally {
      isLoggingInteraction = false;
    }
  }

  async function handleSaveEdit() {
    isSaving = true;
    try {
      const updated = await apiFetch<CrmClient>(`/admin/crm/clients/${client.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name: editForm.name,
          email: editForm.email,
          responsible_name: editForm.responsible_name,
          product_name: editForm.product_name,
        }),
      });
      onUpdate(updated);
      isEditing = false;
    } catch (err) {
      console.error('Erro ao atualizar lead:', err);
    } finally {
      isSaving = false;
    }
  }
</script>

<div class="drawer-overlay" role="presentation" onclick={onClose}>
  <div
    class="drawer-panel"
    role="dialog"
    aria-modal="true"
    aria-label="Detalhe do lead"
    tabindex="-1"
    onclick={(e) => e.stopPropagation()}
    onkeydown={(e) => e.key === 'Escape' && onClose()}
  >
    <div class="drawer-scrollable">
      <div class="drawer-header">
        <div class="status-badge">
          <span class="dot" style="background-color: {columnColor};"></span>
          {columnTitle}
        </div>
        <div class="header-actions">
          <button class="action-btn" onclick={() => (isEditing = !isEditing)} title="Editar Lead">
            <Edit2 size={14} color={isEditing ? '#c084fc' : '#9ca3af'} />
          </button>
          <button class="close-btn" onclick={onClose}><X size={16} /></button>
        </div>
      </div>

      {#if isEditing}
        <div class="edit-mode-form">
          <div class="input-group">
            <label>NOME DA EMPRESA</label>
            <input type="text" bind:value={editForm.name} class="dark-input" />
          </div>
          <div class="input-group">
            <label>E-MAIL</label>
            <input type="email" bind:value={editForm.email} class="dark-input" />
          </div>
          <div class="meta-grid" style="margin-top: 0;">
            <div class="input-group">
              <label>PRODUTO</label>
              <select bind:value={editForm.product_name} class="dark-input">
                <option value="">Selecione...</option>
                <option value="Avali">Avali</option>
                <option value="Notify">Notify</option>
                <option value="Pontua">Pontua</option>
              </select>
            </div>
            <div class="input-group">
              <label>RESPONSÁVEL</label>
              <input type="text" bind:value={editForm.responsible_name} class="dark-input" />
            </div>
          </div>
          <button class="btn-save-edit" onclick={handleSaveEdit} disabled={isSaving}>
            {#if isSaving}
              Salvando...
            {:else}
              <Check size={14} style="margin-right: 4px;" /> Salvar Alterações
            {/if}
          </button>
        </div>
      {:else}
        <div class="client-title">
          <h2>{client.name}</h2>
          <p class="email">{client.email || 'Sem e-mail cadastrado'}</p>
        </div>

        <div class="meta-grid">
          <div class="meta-item">
            <label>PRODUTO</label>
            <div class="val">{client.product_name || '-'}</div>
          </div>
          <div class="meta-item">
            <label>RESPONSÁVEL</label>
            <div class="val">{client.responsible_name || 'Não atribuído'}</div>
          </div>
          <div class="meta-item">
            <label>INTERAÇÕES</label>
            <div class="val">{client.interaction_count}</div>
          </div>
        </div>
      {/if}

      <hr class="divider" />

      <div class="interactions-section">
        <h3 class="section-title">
          Interações registradas
          <span class="badge">{interactions.length}</span>
        </h3>

        {#if interactions.length === 0}
          <p class="no-interactions">Nenhuma interação registrada ainda.</p>
        {:else}
          <div class="timeline">
            {#each interactions as inter (inter.id)}
              <div class="interaction-card">
                <div class="icon-wrapper {inter.type}">
                  {#if inter.type === 'nota'}
                    <Bot size={13} />
                  {:else if inter.type === 'call'}
                    <Headphones size={13} />
                  {:else}
                    <Mail size={13} />
                  {/if}
                </div>
                <div class="interaction-content">
                  <div class="meta">{inter.time} • {inter.type}</div>
                  <div class="text">
                    <strong>{inter.author}</strong> • {inter.text}
                  </div>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>

    <div class="drawer-footer">
      <div class="footer-top">
        <div class="tabs">
          <button
            class="tab {activeTab === 'nota' ? 'active' : ''}"
            onclick={() => (activeTab = 'nota')}
          >
            <Bot size={12} /> Nota
          </button>
          <button
            class="tab {activeTab === 'call' ? 'active' : ''}"
            onclick={() => (activeTab = 'call')}
          >
            <Headphones size={12} /> Ligação
          </button>
          <button
            class="tab {activeTab === 'email' ? 'active' : ''}"
            onclick={() => (activeTab = 'email')}
          >
            <Mail size={12} /> E-mail
          </button>
        </div>
        <div class="current-user">COMO {currentUser.toUpperCase()}</div>
      </div>

      <form
        class="input-wrapper"
        onsubmit={(e) => {
          e.preventDefault();
          registerInteraction();
        }}
      >
        <textarea placeholder={placeholders[activeTab]} bind:value={inputText}></textarea>
        <button
          type="submit"
          class="btn-register"
          disabled={!inputText.trim() || isLoggingInteraction}
        >
          {isLoggingInteraction ? 'Registrando...' : 'Registrar'}
          <ArrowRight size={14} style="margin-left: 4px;" />
        </button>
      </form>
    </div>
  </div>
</div>

<style>
  .drawer-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.4);
    z-index: 1000;
  }
  .drawer-panel {
    position: absolute;
    top: 0;
    right: 0;
    width: 480px;
    max-width: 100%;
    height: 100%;
    background-color: #121215;
    border-left: 1px solid #1f1f24;
    box-shadow: -4px 0 24px rgba(0, 0, 0, 0.4);
    display: flex;
    flex-direction: column;
    animation: slideIn 0.2s ease-out;
  }
  .drawer-scrollable {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .drawer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .status-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: var(--font-mono, monospace);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.1em;
    color: #9ca3af;
    text-transform: uppercase;
  }
  .status-badge .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }
  .header-actions {
    display: flex;
    gap: 8px;
  }
  .close-btn {
    background: #ffffff;
    border: none;
    color: #000000;
    width: 24px;
    height: 24px;
    border-radius: 6px;
    display: grid;
    place-items: center;
    cursor: pointer;
  }
  .client-title h2 {
    margin: 0;
    font-size: 22px;
    font-weight: 600;
    color: #ffffff;
  }
  .client-title .email {
    margin: 4px 0 0 0;
    font-family: var(--font-mono, monospace);
    font-size: 12px;
    color: #9ca3af;
  }
  .meta-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 16px;
    margin-top: 8px;
  }
  .meta-item label {
    font-family: var(--font-mono, monospace);
    font-size: 9px;
    letter-spacing: 0.1em;
    color: #6b7280;
    display: block;
    margin-bottom: 6px;
  }
  .meta-item .val {
    font-size: 14px;
    font-weight: 600;
    color: #ffffff;
  }
  .divider {
    border: 0;
    border-top: 1px solid #1f1f24;
    width: 100%;
    margin: 0;
  }

  .interactions-section {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  .section-title {
    margin: 0;
    font-size: 14px;
    font-weight: 500;
    color: #ffffff;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .section-title .badge {
    background: #1f1f24;
    color: #ffffff;
    font-size: 11px;
    padding: 2px 6px;
    border-radius: 4px;
  }
  .no-interactions {
    font-size: 12px;
    color: #6b7280;
    font-family: var(--font-mono, monospace);
    margin: 0;
  }

  .timeline {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .timeline::before {
    content: '';
    position: absolute;
    left: 13px;
    top: 0;
    bottom: 0;
    width: 1px;
    background-color: #2d2d35;
    z-index: 0;
  }

  .interaction-card {
    display: flex;
    gap: 12px;
    position: relative;
    z-index: 1;
  }
  .icon-wrapper {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    flex-shrink: 0;
    display: grid;
    place-items: center;
    border: 4px solid #121215;
  }
  .icon-wrapper.nota {
    background: rgba(127, 63, 229, 0.15);
    color: #c084fc;
  }
  .icon-wrapper.call {
    background: rgba(34, 197, 94, 0.15);
    color: #4ade80;
  }
  .icon-wrapper.email {
    background: rgba(236, 72, 153, 0.15);
    color: #f472b6;
  }

  .interaction-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding-top: 4px;
  }
  .interaction-content .meta {
    font-family: var(--font-mono, monospace);
    font-size: 10px;
    color: #6b7280;
  }
  .interaction-content .text {
    font-size: 13px;
    color: #e4e4e7;
    line-height: 1.5;
  }
  .interaction-content strong {
    color: #ffffff;
    font-weight: 600;
  }

  .drawer-footer {
    border-top: 1px solid #1f1f24;
    padding: 20px 24px;
    background: #121215;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .footer-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .tabs {
    display: flex;
    gap: 8px;
  }
  .tab {
    display: flex;
    align-items: center;
    gap: 6px;
    background: transparent;
    border: 1px solid transparent;
    color: #9ca3af;
    font-size: 11px;
    font-weight: 500;
    padding: 6px 10px;
    border-radius: 6px;
    cursor: pointer;
    transition: 0.15s;
  }
  .tab:hover {
    color: #ffffff;
  }
  .tab.active {
    background: rgba(127, 63, 229, 0.15);
    color: #c084fc;
    border-color: rgba(127, 63, 229, 0.3);
  }

  .current-user {
    font-family: var(--font-mono, monospace);
    font-size: 10px;
    letter-spacing: 0.1em;
    color: #6b7280;
  }

  .input-wrapper {
    position: relative;
    background: #09090b;
    border: 1px solid #1f1f24;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .input-wrapper textarea {
    background: transparent;
    border: none;
    padding: 12px;
    color: #ffffff;
    font-size: 13px;
    font-family: sans-serif;
    resize: none;
    outline: none;
    min-height: 80px;
  }
  .input-wrapper textarea::placeholder {
    color: #52525b;
  }

  .btn-register {
    position: absolute;
    bottom: 8px;
    right: 8px;
    background: #ffffff;
    color: #000000;
    border: none;
    border-radius: 20px;
    padding: 6px 14px;
    font-size: 12px;
    font-weight: 600;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: 0.15s;
  }
  .btn-register:hover:not(:disabled) {
    background: #e4e4e7;
  }
  .btn-register:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .action-btn {
    background: transparent;
    border: 1px solid #1f1f24;
    color: #9ca3af;
    width: 24px;
    height: 24px;
    border-radius: 6px;
    display: grid;
    place-items: center;
    cursor: pointer;
    transition: 0.15s;
  }
  .action-btn:hover {
    background: #1f1f24;
    color: #ffffff;
  }

  .dark-input {
    background: #09090b;
    border: 1px solid #2d2d35;
    border-radius: 6px;
    padding: 8px 10px;
    color: #e4e4e7;
    font-size: 13px;
    width: 100%;
    outline: none;
  }
  .dark-input:focus {
    border-color: #7f3fe5;
  }

  .edit-mode-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .input-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .input-group label {
    font-family: var(--font-mono, monospace);
    font-size: 9px;
    letter-spacing: 0.1em;
    color: #6b7280;
    text-transform: uppercase;
  }

  .btn-save-edit {
    background: #7f3fe5;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 8px 12px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 8px;
  }
  .btn-save-edit:hover:not(:disabled) {
    background: #6b21c9;
  }
  .btn-save-edit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @keyframes slideIn {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }
</style>
