<script lang="ts">
  import { ShieldAlert, Pencil, Trash2, Star, Bell } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import { topbarActions } from '$lib/stores/topbar';
  import { page } from '$app/stores';
  import { get } from 'svelte/store';
  import { apiFetch, ApiError } from '$lib/api/backend';
  import { tick } from 'svelte';
  import { invalidateAll } from '$app/navigation';
  import type { PageData } from './$types';
  import type { NotificationTemplate } from './+page.server';
  import {
    TEMPLATE_COLOR_PALETTE,
    type NotificationEventType,
  } from '$lib/constants/notification-types';
  import TemplateModal from './templateModal.svelte';
  import DeleteModal from './deleteModal.svelte';

  export let data: PageData;

  const emptyForm = {
    tipo_evento: '',
    nome: '',
    conteudo: '',
    color: TEMPLATE_COLOR_PALETTE[0] as string,
  };
  $: eventTypes = data.eventTypes ?? [];
  $: eventTypeLabel = (tipo: string) =>
    eventTypes.find((t: NotificationEventType) => t.value === tipo)?.label ?? tipo;

  let isModalOpen = false;
  let isEditingMode = false;
  let currentTemplateId: string | null = null;
  let modalData = { ...emptyForm };
  let modalError = '';

  let isProcessing = false;
  let processingMessage = '';

  let toastMessage = '';
  let toastVisible = false;
  let toastTimer: ReturnType<typeof setTimeout> | null = null;

  function showToast(msg: string) {
    if (toastTimer) clearTimeout(toastTimer);
    toastMessage = msg;
    toastVisible = true;
    toastTimer = setTimeout(() => {
      toastVisible = false;
    }, 3000);
  }

  $: _user = $page.data?.adminUser;
  $: canEdit = _user?.role === 'owner' || (_user?.permissions?.notifications ?? []).includes('e');
  $: canAdmin = _user?.role === 'owner' || (_user?.permissions?.notifications ?? []).includes('a');

  onMount(() => {
    const u = get(page).data?.adminUser;
    const isAdmin = u?.role === 'owner' || (u?.permissions?.notifications ?? []).includes('e');
    if (isAdmin) {
      topbarActions.set([{ label: '+ Novo template', onClick: handleNovoTemplate }]);
    }
    return () => topbarActions.set([]);
  });

  function handleNovoTemplate() {
    isEditingMode = false;
    currentTemplateId = null;
    modalData = { ...emptyForm };
    modalError = '';
    isModalOpen = true;
  }

  function handleEditarTemplate(template: NotificationTemplate) {
    isEditingMode = true;
    currentTemplateId = template.id;
    modalData = {
      tipo_evento: template.tipo_evento,
      nome: template.nome,
      conteudo: template.conteudo,
      color: template.color,
    };
    modalError = '';
    isModalOpen = true;
  }

  async function handleSaveModal() {
    modalError = '';

    if (!modalData.tipo_evento.trim() || !modalData.nome.trim() || !modalData.conteudo.trim()) {
      modalError = 'Preencha nome, tipo de evento e conteúdo.';
      return;
    }

    try {
      isProcessing = true;
      processingMessage = isEditingMode ? 'Salvando alterações...' : 'Criando template...';

      if (isEditingMode) {
        await apiFetch(`/admin/notification-templates/${currentTemplateId}`, {
          method: 'PATCH',
          body: JSON.stringify({
            nome: modalData.nome,
            conteudo: modalData.conteudo,
            color: modalData.color,
          }),
        });
      } else {
        await apiFetch('/admin/notification-templates', {
          method: 'POST',
          body: JSON.stringify(modalData),
        });
      }

      isModalOpen = false;
      await tick();
      await invalidateAll();
      showToast(
        isEditingMode ? 'Template atualizado com sucesso!' : 'Template criado com sucesso!'
      );
    } catch (err) {
      modalError =
        err instanceof ApiError ? err.message : 'Falha ao salvar o template. Tente novamente.';
    } finally {
      isProcessing = false;
    }
  }

  let listaTemplates: NotificationTemplate[] = [];
  $: if (data.templates) {
    listaTemplates = [...data.templates].sort((a, b) => a.tipo_evento.localeCompare(b.tipo_evento));
  }

  let showDeleteModal = false;
  let templateIdToDelete: string | null = null;
  let deleteError = '';

  function openDeleteModal(id: string) {
    templateIdToDelete = id;
    deleteError = '';
    showDeleteModal = true;
  }

  function closeDeleteModal() {
    showDeleteModal = false;
    templateIdToDelete = null;
  }

  $: templateToDeleteName = templateIdToDelete
    ? (listaTemplates.find((t) => t.id === templateIdToDelete)?.nome ?? '')
    : '';

  async function handleExcluir() {
    const idToDelete = templateIdToDelete;
    if (!idToDelete) return;

    closeDeleteModal();
    await tick();

    isProcessing = true;
    processingMessage = 'Removendo template...';

    try {
      await apiFetch(`/admin/notification-templates/${idToDelete}`, { method: 'DELETE' });
      await invalidateAll();
      showToast('Template removido com sucesso!');
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : 'Não foi possível remover o template. Tente novamente.';
      showToast(msg);
    } finally {
      isProcessing = false;
    }
  }
</script>

{#if toastVisible}
  <div class="toast" role="status" aria-live="polite">
    <svg
      class="toast-icon"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2.5"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
    </svg>
    {toastMessage}
  </div>
{/if}
{#if isProcessing}
  <div class="processing-overlay">
    <div class="processing-card">
      <svg class="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" style="opacity:.25"
        ></circle>
        <path fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" style="opacity:.75"
        ></path>
      </svg>
      {processingMessage || 'Processando...'}
    </div>
  </div>
{/if}

<div class="admin-content">
  {#if data.forbidden}
    <div class="notif-state">
      <span class="ico"><ShieldAlert size={22} /></span>
      <div class="t">Acesso restrito</div>
      <div class="s">Você não tem permissão para gerenciar templates de notificação.</div>
    </div>
  {:else}
    <div class="panel">
      <div class="panel-head">
        <h3>
          {listaTemplates.length} template{listaTemplates.length !== 1 ? 's' : ''} ativo{listaTemplates.length !==
          1
            ? 's'
            : ''}
        </h3>
        <span class="grow"></span>
        <span class="pill">CP9 · notificações</span>
      </div>

      {#if data.error}
        <div class="error-bar">{data.error}</div>
      {/if}

      {#if listaTemplates.length === 0}
        <div class="notif-state">
          <span class="ico"><Bell size={22} /></span>
          <div class="t">Nenhum template configurado</div>
          <div class="s">Crie um template para padronizar notificações de um tipo de evento.</div>
        </div>
      {:else}
        {#each listaTemplates as template (template.id)}
          <div class="template-row">
            <div class="t-meta">
              <div class="t-name-row">
                <span class="t-name">{template.nome}</span>
                {#if template.is_default}
                  <span class="pill default-pill"><Star size={10} /> padrão</span>
                {/if}
              </div>
              <span class="t-desc">{template.conteudo}</span>
            </div>
            <span class="t-event mono">
              <span class="t-color-dot" style="background:{template.color}"></span>
              {eventTypeLabel(template.tipo_evento)}
            </span>

            {#if canEdit || canAdmin}
              <div class="t-actions">
                {#if canEdit}
                  <button
                    type="button"
                    class="icon-btn"
                    title="Editar template"
                    aria-label="Editar template"
                    on:click={() => handleEditarTemplate(template)}
                  >
                    <Pencil size={14} />
                  </button>
                {/if}
                {#if canAdmin && !template.is_default}
                  <button
                    type="button"
                    class="icon-btn danger"
                    title="Remover template"
                    aria-label="Remover template"
                    on:click={() => openDeleteModal(template.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                {/if}
              </div>
            {/if}
          </div>
        {/each}
      {/if}
    </div>
  {/if}
</div>

<TemplateModal
  bind:isOpen={isModalOpen}
  bind:isEditing={isEditingMode}
  bind:formData={modalData}
  {eventTypes}
  errorMessage={modalError}
  onSave={handleSaveModal}
/>
<DeleteModal isOpen={showDeleteModal} onClose={closeDeleteModal} onConfirm={handleExcluir}
  >{templateToDeleteName}</DeleteModal
>

<style>
  .admin-content {
    padding: 22px 24px;
    flex: 1;
  }

  .panel {
    background: var(--bg-elev);
    border: 1px solid var(--line);
    border-radius: 10px;
    overflow: hidden;
  }

  .panel-head {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 20px;
    border-bottom: 1px solid var(--line);
  }
  .panel-head h3 {
    margin: 0;
    font-size: 13px;
    font-weight: 500;
    color: var(--text);
  }
  .grow {
    flex: 1;
  }
  .pill {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.06em;
    padding: 3px 8px;
    border-radius: 4px;
    border: 1px solid var(--line);
    color: var(--text-muted);
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
  .default-pill {
    background: rgba(234, 179, 8, 0.12);
    color: #eab308;
    border-color: rgba(234, 179, 8, 0.25);
  }

  .template-row {
    display: grid;
    grid-template-columns: 1fr 160px 72px;
    gap: 16px;
    align-items: center;
    padding: 13px 20px;
    border-bottom: 1px solid var(--line);
  }
  .template-row:last-of-type {
    border-bottom: 0;
  }
  .template-row:hover {
    background: var(--bg-soft);
  }

  .t-meta {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }
  .t-name-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .t-name {
    font-size: 13.5px;
    font-weight: 500;
    color: var(--text);
  }
  .t-desc {
    font-size: 11.5px;
    color: var(--text-faint);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .t-event {
    font-size: 11px;
    color: var(--text-muted);
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .t-color-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .mono {
    font-family: var(--font-mono);
  }

  .t-actions {
    display: flex;
    justify-content: flex-end;
    gap: 6px;
  }
  .icon-btn {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    background: transparent;
    border: 0;
    color: var(--text-faint);
    cursor: pointer;
    transition:
      background 0.12s,
      color 0.12s;
  }
  .icon-btn:hover {
    background: var(--bg-tint);
    color: var(--text);
  }
  .icon-btn.danger:hover {
    background: rgba(244, 63, 94, 0.1);
    color: #f43f5e;
  }

  .notif-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 72px 20px;
    color: var(--text-muted);
  }
  .notif-state .ico {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: grid;
    place-items: center;
    background: var(--bg-soft);
    border: 1px solid var(--line);
    color: var(--text-faint);
    margin-bottom: 12px;
  }
  .notif-state .t {
    font-size: 14px;
    color: var(--text);
  }
  .notif-state .s {
    font-size: 12px;
    margin-top: 4px;
  }

  .error-bar {
    padding: 10px 20px;
    font-size: 13px;
    color: #f87171;
    background: rgba(248, 113, 113, 0.08);
    border-bottom: 1px solid rgba(248, 113, 113, 0.2);
  }

  .toast {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 100;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 18px;
    background: var(--bg-elev);
    border: 1px solid var(--line);
    border-radius: 10px;
    font-size: 13px;
    font-weight: 500;
    color: var(--text);
    box-shadow: var(--shadow-3);
  }
  .toast-icon {
    width: 16px;
    height: 16px;
    color: var(--green);
    flex-shrink: 0;
  }

  .processing-overlay {
    position: fixed;
    inset: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(6, 6, 6, 0.5);
  }
  .processing-card {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 24px;
    background: var(--bg-elev);
    border: 1px solid var(--line);
    border-radius: 10px;
    font-size: 13px;
    color: var(--text);
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  .spinner {
    width: 18px;
    height: 18px;
    animation: spin 0.8s linear infinite;
  }
</style>
