<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import LangToggle from './LangToggle.svelte';
  import PublishToggle from './PublishToggle.svelte';

  export let formData: any;
  export let isEditing: boolean = false;

  const dispatch = createEventDispatcher();

  const inputClass = "w-full rounded-lg border border-zinc-800/80 bg-[#09090b] px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-700 focus:border-zinc-700 focus:bg-[#050507] focus:outline-none transition-all";

  let langFields = {
    category: 'pt',
    tagline: 'pt',
    description: 'pt',
    target: 'pt',
    clients: 'pt'
  };

  function submit() {
    dispatch('save');
  }

  function cancel() {
    dispatch('cancel');
  }
</script>

<form on:submit|preventDefault={submit} class="flex w-[65%] flex-col justify-between bg-[#121214]">
  <div class="px-8 pt-6 pb-2">
    <div class="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
      <span class="capitalize">{isEditing ? 'Editar' : 'Criar'} · {formData.name_pt || 'Novo'}</span>
      <span>/</span>
      <span>produtos</span>
      <span>/</span>
      <span class="text-zinc-400">formulário</span>
    </div>
  </div>

  <div class="flex-1 overflow-y-auto px-8 py-2 space-y-5 custom-scrollbar max-h-[64vh]">
    <div>
      <span class="block text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Nome do Produto</span>
      <input type="text" class={inputClass} placeholder="Ex: Avali" bind:value={formData.name_pt} required />
    </div>

    <div>
      <div class="flex items-center justify-between mb-2">
        <span class="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Categoria</span>
        <div class="lang-toggle">
          <LangToggle bind:value={langFields.category} />
        </div>
      </div>
      {#if langFields.category === 'pt'}
        <input type="text" class={inputClass} placeholder="Gestão Educacional" bind:value={formData.category_pt} />
      {:else}
        <input type="text" class={inputClass} placeholder="Educational Management" bind:value={formData.category_en} />
      {/if}
    </div>

    <div>
      <div class="flex items-center justify-between mb-2">
        <span class="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Tagline (1 linha)</span>
        <div class="lang-toggle">
          <LangToggle bind:value={langFields.tagline} />
        </div>
      </div>
      {#if langFields.tagline === 'pt'}
        <input type="text" class={inputClass} placeholder="Plataforma de avaliações escolares..." bind:value={formData.tagline_pt} />
      {:else}
        <input type="text" class={inputClass} placeholder="School assessment platform..." bind:value={formData.tagline_en} />
      {/if}
    </div>

    <div>
      <div class="flex items-center justify-between mb-2">
        <span class="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Descrição Completa</span>
        <div class="lang-toggle">
          <LangToggle bind:value={langFields.description} />
        </div>
      </div>
      {#if langFields.description === 'pt'}
        <textarea rows="3" class="{inputClass} resize-none" placeholder="Crie, aplique e corrija avaliações..." bind:value={formData.description_pt}></textarea>
      {:else}
        <textarea rows="3" class="{inputClass} resize-none" placeholder="Create, deliver and grade assessments..." bind:value={formData.description_en}></textarea>
      {/if}
    </div>

    <div>
      <div class="flex items-center justify-between mb-2">
        <span class="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Público-Alvo</span>
        <div class="lang-toggle">
          <LangToggle bind:value={langFields.target} />
        </div>
      </div>
      {#if langFields.target === 'pt'}
        <input type="text" class={inputClass} placeholder="Redes de ensino, colégios particulares..." bind:value={formData.target_pt} />
      {:else}
        <input type="text" class={inputClass} placeholder="School networks, private schools..." bind:value={formData.target_en} />
      {/if}
    </div>

    <div>
      <div class="flex items-center justify-between mb-2">
        <span class="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Quem está usando (Clientes / Logos)</span>
        <div class="lang-toggle">
          <LangToggle bind:value={langFields.clients} />
        </div>
      </div>
      {#if langFields.clients === 'pt'}
        <input type="text" class={inputClass} placeholder="NIVERA Tech, Folha Sistemas..." bind:value={formData.clients_pt} />
      {:else}
        <input type="text" class={inputClass} placeholder="NIVERA Tech, Folha Sistemas..." bind:value={formData.clients_en} />
      {/if}
    </div>

    <div>
      <span class="block text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Slug da URL</span>
      <input type="text" class={inputClass} placeholder="ex: avali-correcao" bind:value={formData.slug} required />
    </div>

    <div>
      <span class="block text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Status de Publicação</span>
      <PublishToggle bind:published={formData.published} />
    </div>

  </div>

  <div class="flex items-center justify-between border-t border-zinc-800/80 px-8 py-4 bg-[#121214]">
    <span class="text-[10px] text-zinc-600 font-medium uppercase tracking-wider">▲ Versões PT e EN são gravadas separadamente</span>
    
    <div class="flex items-center gap-3">
      <button type="button" class="rounded-full border border-zinc-700/60 px-5 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-900 transition-colors" on:click={cancel}>Cancelar</button>
      <button type="submit" class="rounded-full bg-zinc-100 px-5 py-2 text-xs font-bold text-zinc-950 hover:bg-zinc-200 transition-colors shadow-md">{isEditing ? 'Salvar alterações' : 'Criar produto'}</button>
    </div>
  </div>

</form>
