<script lang="ts">
  import { X, Users, ArrowRight } from 'lucide-svelte';
  import { apiFetch } from '$lib/api/backend';
  import type { CrmClient } from './+page.svelte';

  type CrmColumn = { id: string; title: string };

  let { columns, initialColumnId, onClose, onSave } = $props<{
    columns: CrmColumn[];
    initialColumnId: string;
    onClose: () => void;
    onSave: (lead: CrmClient) => void;
  }>();

  let name = $state('');
  let email = $state('');
  let productName = $state('');
  let responsibleName = $state('');
  let columnId = $state(initialColumnId);
  let isSubmitting = $state(false);
  let errorMsg = $state('');

  async function handleSubmit() {
    if (!name.trim()) return;
    isSubmitting = true;
    errorMsg = '';
    try {
      const newLead = await apiFetch<CrmClient>('/admin/crm/clients', {
        method: 'POST',
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          product_name: productName || undefined,
          responsible_name: responsibleName || undefined,
          column_id: columnId || undefined,
        }),
      });
      onSave(newLead);
    } catch (err) {
      const e = err as { message?: string };
      errorMsg = e.message || 'Erro ao salvar lead.';
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class="admin-overlay" role="presentation" onclick={onClose}>
  <div
    class="modal-content"
    role="dialog"
    aria-modal="true"
    aria-label="Cadastrar novo lead"
    tabindex="-1"
    onclick={(e) => e.stopPropagation()}
    onkeydown={(e) => e.key === 'Escape' && onClose()}
  >
    <div class="modal-header">
      <div class="title-group">
        <h3>Cadastrar novo lead</h3>
        <span class="crumbs">/ crm / novo</span>
      </div>
      <button class="x-btn" onclick={onClose}><X size={16} /></button>
    </div>

    <form
      class="modal-body"
      onsubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      {#if errorMsg}
        <div class="error-banner">{errorMsg}</div>
      {/if}

      <div class="form-grid">
        <div class="input-group">
          <label>Nome da empresa / Lead</label>
          <input type="text" placeholder="ex. Folha Sistemas" bind:value={name} required />
        </div>

        <div class="input-group">
          <label>E-mail de contato</label>
          <input type="email" placeholder="leandro@folha.io" bind:value={email} />
        </div>

        <div class="input-group">
          <label>Produto de interesse</label>
          <select bind:value={productName}>
            <option value="">Selecione...</option>
            <option value="Avali">Avali</option>
            <option value="Notify">Notify</option>
            <option value="Pontua">Pontua</option>
          </select>
        </div>

        <div class="input-group">
          <label>Responsável</label>
          <input type="text" placeholder="Nome do responsável" bind:value={responsibleName} />
        </div>

        <div class="input-group">
          <label>Estágio inicial</label>
          <select bind:value={columnId}>
            {#each columns as col}
              <option value={col.id}>{col.title}</option>
            {/each}
          </select>
        </div>
      </div>

      <div class="info-banner">
        <Users size={16} class="info-icon" />
        <p>O lead aparecerá imediatamente no kanban e pode ser arrastado entre as colunas para mudar de estágio.</p>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn-cancel" onclick={onClose} disabled={isSubmitting}>
          Cancelar
        </button>
        <button type="submit" class="btn-submit" disabled={isSubmitting || !name.trim()}>
          {isSubmitting ? 'Adicionando...' : 'Adicionar ao pipeline'}
          <ArrowRight size={14} style="margin-left: 6px;" />
        </button>
      </div>
    </form>
  </div>
</div>

<style>
  .admin-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.6);
    display: grid;
    place-items: center;
    z-index: 1000;
  }

  .modal-content {
    background-color: #121215;
    border: 1px solid #2d2d35;
    border-radius: 12px;
    width: 560px;
    max-width: 95vw;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    font-family: sans-serif;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid #1f1f24;
  }
  .title-group {
    display: flex;
    align-items: baseline;
    gap: 8px;
  }
  .title-group h3 {
    margin: 0;
    color: #ffffff;
    font-size: 16px;
    font-weight: 600;
  }
  .crumbs {
    font-family: var(--font-mono, monospace);
    font-size: 12px;
    color: #6b7280;
  }
  .x-btn {
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    padding: 4px;
  }
  .x-btn:hover {
    color: #fff;
  }

  .modal-body {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .error-banner {
    background: rgba(231, 31, 132, 0.1);
    border: 1px solid rgba(231, 31, 132, 0.3);
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 13px;
    color: #f3f4f6;
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px 20px;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .input-group label {
    font-family: var(--font-mono, monospace);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #9ca3af;
  }
  .input-group input,
  .input-group select {
    background-color: #09090b;
    border: 1px solid #2d2d35;
    border-radius: 6px;
    padding: 10px 12px;
    color: #e4e4e7;
    font-size: 13px;
    outline: none;
    transition: border-color 0.2s;
  }
  .input-group input:focus,
  .input-group select:focus {
    border-color: #7f3fe5;
  }

  .info-banner {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    background-color: #16161a;
    border: 1px solid #2d2d35;
    border-radius: 6px;
    padding: 12px 16px;
  }
  :global(.info-icon) {
    color: #7f3fe5;
    flex-shrink: 0;
    margin-top: 2px;
  }
  .info-banner p {
    margin: 0;
    color: #a1a1aa;
    font-size: 12px;
    line-height: 1.4;
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 10px;
  }
  .btn-cancel {
    background: transparent;
    border: 1px solid #e4e4e7;
    border-radius: 20px;
    color: #e4e4e7;
    padding: 8px 16px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
  }
  .btn-submit {
    background: #ffffff;
    border: 1px solid #ffffff;
    border-radius: 20px;
    color: #000000;
    padding: 8px 20px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
  }
  .btn-submit:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
</style>
