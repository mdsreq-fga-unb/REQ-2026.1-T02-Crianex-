<script lang="ts">
  import { X, Check } from 'lucide-svelte';
  import {
    TEMPLATE_COLOR_PALETTE,
    type NotificationEventType,
  } from '$lib/constants/notification-types';

  export let isOpen = false;
  export let isEditing = false;
  export let formData = {
    tipo_evento: '',
    nome: '',
    conteudo: '',
    color: TEMPLATE_COLOR_PALETTE[0] as string,
  };
  export let errorMessage = '';
  export let onSave: () => Promise<void>;
  export let eventTypes: NotificationEventType[] = [];

  function fechar() {
    isOpen = false;
  }

  async function submit(e: Event) {
    e.preventDefault();
    await onSave();
  }

  // Ao escolher o tipo pela primeira vez (criação), pré-preenche a cor sugerida do
  // catálogo — o admin ainda pode trocar livremente pelo seletor de cor abaixo.
  function onTipoChange(e: Event) {
    const value = (e.target as HTMLSelectElement).value;
    formData = { ...formData, tipo_evento: value };
    if (!isEditing) {
      const eventType = eventTypes.find((t) => t.value === value);
      if (eventType) formData = { ...formData, color: eventType.color };
    }
  }
</script>

{#if isOpen}
  <div class="overlay" role="dialog" aria-modal="true">
    <div class="modal">
      <button type="button" class="close-btn" on:click={fechar} aria-label="Fechar">
        <X size={16} />
      </button>

      <form class="panel" on:submit={submit}>
        <div class="breadcrumb">
          <span>{isEditing ? 'Editar' : 'Criar'} · {formData.nome || 'Novo template'}</span>
          <span class="sep">/</span><span class="crumb-active">notificações</span>
        </div>

        <div class="fields">
          {#if errorMessage}
            <div class="error-bar">{errorMessage}</div>
          {/if}

          <div class="field-group">
            <span class="field-label">Nome do template</span>
            <input
              type="text"
              class="field-input"
              placeholder="Ex.: Novo lead capturado"
              bind:value={formData.nome}
              required
            />
          </div>

          <div class="field-group">
            <span class="field-label">Tipo de evento</span>
            <select
              class="field-input"
              value={formData.tipo_evento}
              on:change={onTipoChange}
              disabled={isEditing}
              required
            >
              <option value="" disabled>Selecione um tipo…</option>
              {#each eventTypes as eventType}
                <option value={eventType.value} disabled={!eventType.implemented}>
                  {eventType.label}{!eventType.implemented ? ' (em breve)' : ''}
                </option>
              {/each}
            </select>
            <span class="field-hint">
              {eventTypes.find((t) => t.value === formData.tipo_evento)?.descricao ??
                'Escolhendo um tipo, ele é ativado automaticamente ao salvar — só existe 1 template ativo por tipo.'}
            </span>
          </div>

          <div class="field-group">
            <span class="field-label">Cor de destaque</span>
            <div class="color-swatches">
              {#each TEMPLATE_COLOR_PALETTE as color}
                <button
                  type="button"
                  class="color-swatch"
                  style="background:{color}"
                  aria-label="Usar cor {color}"
                  aria-pressed={formData.color === color}
                  on:click={() => (formData = { ...formData, color })}
                >
                  {#if formData.color === color}<Check size={12} color="#09090b" />{/if}
                </button>
              {/each}
            </div>
            <span class="field-hint">
              Cor usada para destacar as notificações resultantes deste tipo de evento na central de
              notificações.
            </span>
          </div>

          <div class="field-group">
            <span class="field-label">Conteúdo</span>
            <textarea
              rows="5"
              class="field-input field-textarea"
              placeholder="Texto da notificação exibido ao admin..."
              bind:value={formData.conteudo}
              required
            ></textarea>
          </div>
        </div>

        <div class="modal-footer">
          <span class="footer-note"
            >▲ Templates não removem histórico de notificações já enviadas</span
          >
          <div class="footer-actions">
            <button type="button" class="btn-cancel" on:click={fechar}>Cancelar</button>
            <button type="submit" class="btn-save"
              >{isEditing ? 'Salvar alterações' : 'Criar template'}</button
            >
          </div>
        </div>
      </form>
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    inset: 0;
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: rgba(0, 0, 0, 0.82);
    backdrop-filter: blur(4px);
    animation: fade-in 0.15s ease-out;
  }
  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .modal {
    position: relative;
    display: flex;
    width: 100%;
    max-width: 560px;
    max-height: 90vh;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid #2a2a2e;
    box-shadow: 0 32px 64px rgba(0, 0, 0, 0.6);
    animation: slide-in 0.18s cubic-bezier(0.16, 1, 0.3, 1);
  }
  @keyframes slide-in {
    from {
      opacity: 0;
      transform: translateY(6px) scale(0.985);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }

  .close-btn {
    position: absolute;
    top: 14px;
    right: 14px;
    z-index: 10;
    width: 28px;
    height: 28px;
    border-radius: 8px;
    border: none;
    background: rgba(255, 255, 255, 0.06);
    color: #a1a1aa;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
      background 0.12s,
      color 0.12s;
  }
  .close-btn:hover {
    background: rgba(255, 255, 255, 0.12);
    color: #f4f4f5;
  }

  .panel {
    flex: 1;
    min-width: 0;
    background: #121214;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .breadcrumb {
    padding: 16px 28px 12px;
    font-size: 11px;
    color: #52525b;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
    border-bottom: 1px solid #1f1f23;
  }
  .sep {
    color: #3f3f46;
  }
  .crumb-active {
    color: #71717a;
  }

  .fields {
    flex: 1;
    overflow-y: auto;
    padding: 20px 28px;
    display: flex;
    flex-direction: column;
    gap: 18px;
    scrollbar-width: thin;
    scrollbar-color: #27272a transparent;
  }

  .field-group {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }
  .field-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #52525b;
  }
  .field-hint {
    font-size: 11px;
    color: #52525b;
    line-height: 1.4;
  }

  .field-input {
    width: 100%;
    background: #09090b;
    border: 1px solid #27272a;
    border-radius: 8px;
    padding: 9px 12px;
    font-size: 13.5px;
    font-family: inherit;
    color: #e4e4e7;
    outline: none;
    transition:
      border-color 0.15s,
      background 0.15s;
    box-sizing: border-box;
  }
  .field-input:focus {
    border-color: #52525b;
    background: #050507;
  }
  .field-input::placeholder {
    color: #3f3f46;
  }
  .field-input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .field-textarea {
    resize: none;
  }

  select.field-input {
    appearance: none;
    cursor: pointer;
  }
  select.field-input option:disabled {
    color: #52525b;
  }

  .color-swatches {
    display: flex;
    gap: 8px;
  }
  .color-swatch {
    width: 26px;
    height: 26px;
    border-radius: 7px;
    border: 2px solid transparent;
    cursor: pointer;
    padding: 0;
    display: grid;
    place-items: center;
    transition: border-color 0.12s;
  }
  .color-swatch[aria-pressed='true'] {
    border-color: #f4f4f5;
    box-shadow: 0 0 0 2px #121214;
  }

  .error-bar {
    padding: 10px 12px;
    font-size: 12.5px;
    color: #f87171;
    background: rgba(248, 113, 113, 0.08);
    border: 1px solid rgba(248, 113, 113, 0.2);
    border-radius: 8px;
  }

  .modal-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 28px;
    border-top: 1px solid #1f1f23;
    background: #121214;
    flex-shrink: 0;
    gap: 12px;
  }
  .footer-note {
    font-size: 10px;
    color: #3f3f46;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .footer-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }

  .btn-cancel {
    border: 1px solid rgba(82, 82, 91, 0.5);
    border-radius: 100px;
    background: transparent;
    color: #a1a1aa;
    padding: 7px 18px;
    font-size: 12px;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    transition:
      background 0.12s,
      color 0.12s;
  }
  .btn-cancel:hover {
    background: #18181b;
    color: #e4e4e7;
  }

  .btn-save {
    border: none;
    border-radius: 100px;
    background: #f4f4f5;
    color: #09090b;
    padding: 7px 18px;
    font-size: 12px;
    font-weight: 700;
    font-family: inherit;
    cursor: pointer;
    transition: background 0.12s;
  }
  .btn-save:hover {
    background: #e4e4e7;
  }
</style>
