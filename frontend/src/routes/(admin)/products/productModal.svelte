<script lang="ts">
  import { X } from 'lucide-svelte';
  import ProductModalLeft from '$lib/components/product/ProductModalLeft.svelte';
  import ProductForm from '$lib/components/product/ProductForm.svelte';
  
  // Propriedades expostas para a +page.svelte controlar o modal
  export let isOpen = false;
  export let isEditing = false;
  export let formData = {
    name_pt: '',
    name_en: '',
    category_pt: '',
    category_en: '',
    tagline_pt: '',
    tagline_en: '',
    description_pt: '',
    description_en: '',
    target_pt: '',
    target_en: '',
    clients_pt: '',
    clients_en: '',
    color: '#7c3aed', // Roxo padrão do protótipo
    icon_text: 'AV',
    published: false,
    slug: ''
  };
  
  export let onSave: () => Promise<void>;


  const inputClass = "w-full rounded-lg border border-zinc-800/80 bg-[#09090b] px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-700 focus:border-zinc-700 focus:bg-[#050507] focus:outline-none transition-all";

  // Estado das abas de idioma individual por campo
  let langFields = {
    category: 'pt',
    tagline: 'pt',
    description: 'pt',
    target: 'pt',
    clients: 'pt'
  };

  function fechar() {
    isOpen = false;
  }
</script>

{#if isOpen}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm animate-fade">
    
    <div class="relative flex h-full max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-zinc-800/80 bg-[#121214] text-zinc-100 shadow-2xl">
      
      <button 
        type="button" 
        class="absolute right-5 top-5 text-zinc-500 hover:text-zinc-300 transition-colors z-20"
        on:click={fechar}
      >
        <X class="h-5 w-5" />
      </button>

      <ProductModalLeft bind:formData />
      <ProductForm bind:formData isEditing={isEditing} on:save={onSave} on:cancel={fechar} />

    </div>
  </div>
{/if}

<style>
  /* Container da caixinha de idioma toggle */
  .lang-toggle {
    display: flex;
    align-items: center;
    gap: 2px;
    border-radius: 6px;
    background-color: #09090b; /* Ajustado para dar contraste */
    padding: 2px;
    border: 1px solid rgba(39, 39, 42, 0.8);
  }

  /* Botõezinhos PT / EN internos */
  .lang-btn {
    border-radius: 4px;
    padding: 2px 6px;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.05em;
    color: #71717a;
    transition: color 0.15s, background-color 0.15s;
    text-transform: uppercase;
  }
  .lang-btn.active {
    background-color: #27272a;
    color: #e4e4e7;
  }

  /* Barra de rolagem estilizada escura */
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #27272a;
    border-radius: 9999px;
  }

  /* Animações globais de transição */
  :global(.animate-fade) {
    animation: fadeIn 0.15s ease-out forwards;
  }
  :global(.animate-slide) {
    animation: slideIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(3px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>