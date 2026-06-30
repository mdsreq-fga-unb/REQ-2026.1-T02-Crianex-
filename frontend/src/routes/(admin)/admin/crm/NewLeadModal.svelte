<script lang="ts">
  import { X, Users, ArrowRight } from 'lucide-svelte';
  import { apiFetch } from '$lib/api/backend'; 

  // Recebe as colunas (para o select de estágio), a coluna pré-selecionada e as funções de fechar/salvar
  let { columns, initialColumnId, onClose, onSave } = $props<{
    columns: any[];
    initialColumnId: string;
    onClose: () => void;
    onSave: (lead: any) => void;
  }>();

  // Estados do formulário
  let name = $state('');
  let contact = $state('');
  let productName = $state('');
  let value = $state('');
  let responsibleName = $state('');
  let columnId = $state(initialColumnId); // Inicia com a coluna onde o usuário clicou
  let interactionText = $state('');
  
  let isSubmitting = $state(false);

async function handleSubmit(){
    if (!name.trim()) return;
    isSubmitting = true;

    try{
        const newLeadPayload = {
            name,
            email: contact,
            product_name: productName,
            value,
            responsible_name: responsibleName,
            column_id: columnId,
            last_interaction: interactionText ? new Date().toISOString() : null,
            interactions_count: interactionText ? 1 : 0,
            status: 'active'
        };

        const saveLead = await apiFetch<any>('/api/admin/crm/clients', {
            method: 'POST',
            body: JSON.stringify(newLeadPayload)
        });

        onSave(saveLead);
    } catch(error){
        console.error("Erro ao salvar lead:", error);
    }finally{
        isSubmitting = false;
    }
  }
</script>

<div class="admin-overlay" role="presentation" onclick={onClose}>
  <div class="modal-content" role="dialog" onclick={(e) => e.stopPropagation()}>
    
    <div class="modal-header">
      <div class="title-group">
        <h3>Cadastrar novo lead</h3>
        <span class="crumbs">/ crm / novo</span>
      </div>
      <button class="x-btn" onclick={onClose}><X size={16}/></button>
    </div>

    <form class="modal-body" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      
      <div class="form-grid">
        <div class="input-group">
          <label>Nome da empresa / Lead</label>
          <input type="text" placeholder="ex. Folha Sistemas" bind:value={name} required />
        </div>
        
        <div class="input-group">
          <label>Contato (E-mail ou telefone)</label>
          <input type="text" placeholder="leandro@folha.io" bind:value={contact} />
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
          <label>Valor estimado / Mês</label>
          <input type="text" placeholder="R$ 24k/mo" bind:value={value} />
        </div>

        <div class="input-group">
          <label>Responsável</label>
          <select bind:value={responsibleName}>
            <option value="">Selecione...</option>
            <option value="Joana V.">Joana V.</option>
            <option value="Carlos M.">Carlos M.</option>
          </select>
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

      <div class="input-group textarea-group">
        <label>Primeira interação (Opcional)</label>
        <textarea 
          placeholder="Como você conheceu este lead? Pontos importantes da primeira conversa..." 
          bind:value={interactionText}
        ></textarea>
      </div>

      <div class="info-banner">
        <Users size={16} class="info-icon" />
        <p>O lead aparecerá imediatamente no kanban e pode ser arrastado entre as colunas para mudar de estágio.</p>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn-cancel" onclick={onClose} disabled={isSubmitting}>Cancelar</button>
        <button type="submit" class="btn-submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adicionando...' : 'Adicionar ao pipeline'} 
          <ArrowRight size={14} style="margin-left: 6px;" />
        </button>
      </div>
    </form>

  </div>
</div>

<style>
  /* Fundo escurecido */
  .admin-overlay {
    position: fixed;
    top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(0, 0, 0, 0.6);
    display: grid; place-items: center;
    z-index: 1000;
  }

  /* Caixa do Modal */
  .modal-content {
    background-color: #121215;
    border: 1px solid #2d2d35;
    border-radius: 12px;
    width: 600px;
    max-width: 95vw;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    display: flex; flex-direction: column;
    font-family: sans-serif;
  }

  /* Cabeçalho */
  .modal-header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 20px 24px; border-bottom: 1px solid #1f1f24;
  }
  .title-group { display: flex; align-items: baseline; gap: 8px; }
  .title-group h3 { margin: 0; color: #ffffff; font-size: 16px; font-weight: 600; }
  .crumbs { font-family: var(--font-mono, monospace); font-size: 12px; color: #6b7280; }
  .x-btn { background: none; border: none; color: #6b7280; cursor: pointer; padding: 4px; }
  .x-btn:hover { color: #fff; }

  /* Corpo do Modal */
  .modal-body { padding: 24px; display: flex; flex-direction: column; gap: 20px; }
  
  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px 20px;
  }

  /* Inputs e Labels */
  .input-group { display: flex; flex-direction: column; gap: 6px; }
  .textarea-group { grid-column: 1 / -1; }
  
  .input-group label {
    font-family: var(--font-mono, monospace);
    font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af;
  }

  .input-group input, .input-group select, .input-group textarea {
    background-color: #09090b;
    border: 1px solid #2d2d35;
    border-radius: 6px;
    padding: 10px 12px;
    color: #e4e4e7;
    font-size: 13px; outline: none;
    transition: border-color 0.2s;
  }
  .input-group textarea { min-height: 80px; resize: vertical; }
  
  .input-group input:focus, .input-group select:focus, .input-group textarea:focus {
    border-color: #7f3fe5; /* Roxo foco */
  }

  /* Info Banner */
  .info-banner {
    display: flex; align-items: flex-start; gap: 12px;
    background-color: #16161a; border: 1px solid #2d2d35; border-radius: 6px;
    padding: 12px 16px; margin-top: 4px;
  }
  :global(.info-icon) { color: #7f3fe5; flex-shrink: 0; margin-top: 2px; }
  .info-banner p { margin: 0; color: #a1a1aa; font-size: 12px; line-height: 1.4; }

  /* Rodapé / Botões */
  .modal-footer {
    display: flex; justify-content: flex-end; gap: 12px;
    margin-top: 10px;
  }
  .btn-cancel {
    background: transparent; border: 1px solid #e4e4e7; border-radius: 20px;
    color: #e4e4e7; padding: 8px 16px; font-size: 13px; font-weight: 500; cursor: pointer;
  }
  .btn-submit {
    background: #ffffff; border: 1px solid #ffffff; border-radius: 20px;
    color: #000000; padding: 8px 20px; font-size: 13px; font-weight: 600; cursor: pointer;
    display: flex; align-items: center;
  }
  .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }
</style>