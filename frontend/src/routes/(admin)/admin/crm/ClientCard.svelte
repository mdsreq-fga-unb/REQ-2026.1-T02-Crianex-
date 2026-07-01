<script lang="ts">
  import { Bot } from 'lucide-svelte';
  import type { CrmClient } from './+page.svelte';

  let {
    client,
    onclick,
    dragging = false,
    ondragstart,
    ondragend,
  } = $props<{
    client: CrmClient;
    onclick: () => void;
    dragging?: boolean;
    ondragstart?: () => void;
    ondragend?: () => void;
  }>();
</script>

<button
  class="crm-lead-card {dragging ? 'dragging' : ''}"
  {onclick}
  draggable={true}
  ondragstart={(e) => {
    e.dataTransfer?.setData('text/plain', client.id);
    if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
    ondragstart?.();
  }}
  ondragend={() => ondragend?.()}
>
  <div class="card-header">
    <h4 class="company-name">{client.name}</h4>
    <span class="contact-email">{client.email || 'Sem e-mail'}</span>
  </div>

  <hr class="divider" />

  <div class="card-body">
    <span class="product-badge">{client.product_name || 'Geral'}</span>
    <span class="deal-value">{client.responsible_name || '-'}</span>
  </div>

  <div class="card-footer">
    <Bot size={13} class="interaction-icon" />
    <span class="interaction-text">
      {client.interaction_count}
      {client.interaction_count === 1 ? 'interação' : 'interações'}
    </span>
  </div>
</button>

<style>
  .crm-lead-card {
    background-color: #16161a;
    border: 1px solid #2d2d35;
    border-radius: 8px;
    padding: 14px;
    width: 100%;
    text-align: left;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 12px;
    transition:
      border-color 0.15s ease,
      background-color 0.15s ease;
  }

  .crm-lead-card:hover {
    border-color: #4b4b5c;
    background-color: #1a1a1f;
  }

  .crm-lead-card.dragging {
    opacity: 0.4;
  }

  .card-header {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .company-name {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: #f3f4f6;
  }
  .contact-email {
    font-family: var(--font-mono, monospace);
    font-size: 11px;
    color: #9ca3af;
  }

  .divider {
    border: 0;
    border-top: 1px solid #2d2d35;
    margin: 0;
    width: 100%;
  }

  .card-body {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .product-badge {
    background-color: #232329;
    color: #d1d5db;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 500;
  }
  .deal-value {
    font-size: 12px;
    color: #9ca3af;
  }

  .card-footer {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #6b7280;
  }
  .interaction-text {
    font-family: var(--font-mono, monospace);
    font-size: 10px;
  }
</style>
