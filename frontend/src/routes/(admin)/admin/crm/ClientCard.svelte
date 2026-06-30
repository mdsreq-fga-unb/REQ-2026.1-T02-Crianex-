<script lang="ts">
  import { Bot } from 'lucide-svelte';


  type CrmClient = {
    id: string;
    name: string;
    email: string | null;
    column_id: string;
    product_name: string | null;
    value: string | null;
    responsible_name: string | null;
    last_interaction: string | null;
    interaction_count: number;
    status: 'active' | 'inactive';
  };

  // Recebe os dados do cliente e a ação de clique do componente pai
  let { client, onclick } = $props<{
    client: CrmClient;
    onclick: () => void;
  }>();
</script>

<button class="crm-lead-card" {onclick}>
  <div class="card-header">
    <h4 class="company-name">{client.name}</h4>
    <span class="contact-email">{client.email || 'Sem e-mail'}</span>
  </div>

  <hr class="divider" />

  <div class="card-body">
    <span class="product-badge">{client.product_name || 'Geral'}</span>
    <span class="deal-value">{client.value || '-'}</span>
  </div>

  <div class="card-footer">
    <Bot size={13} class="interaction-icon" />
    <span class="interaction-text">
      {client.interaction_count} {client.interaction_count === 1 ? 'interação' : 'interações'}
    </span>
  </div>
</button>

<style>
  /* Base do Card */
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
    transition: border-color 0.15s ease, background-color 0.15s ease;
  }

  .crm-lead-card:hover {
    border-color: #4b4b5c;
    background-color: #1a1a1f;
  }

  /* Cabeçalho */
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

  /* Divisória */
  .divider {
    border: 0;
    border-top: 1px solid #2d2d35;
    margin: 0;
    width: 100%;
  }

  /* Corpo (Produto e Valor) */
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
    font-size: 13px;
    font-weight: 700;
    color: #ffffff;
  }

  /* Rodapé (Interações) */
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
  :global(.interaction-icon) {
    color: #6b7280;
  }
</style>