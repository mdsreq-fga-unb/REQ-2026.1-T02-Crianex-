<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import LangToggle from './LangToggle.svelte';
  import PublishToggle from './PublishToggle.svelte';

  export let formData: any;
  export let isEditing: boolean = false;

  const dispatch = createEventDispatcher();

  const inputClass =
    'w-full rounded-lg border border-zinc-800/80 bg-[#09090b] px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-700 focus:border-zinc-700 focus:bg-[#050507] focus:outline-none transition-all fld';

  let activeLang: 'pt' | 'en' = 'pt';
  let slugIsManual = false;
  let lastAutoSlug = '';

  function slugify(text: string) {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  function syncSlugFromName() {
    const generated = slugify(formData.name_pt ?? '');
    if (!generated) return;

    const shouldAutoUpdate = !slugIsManual || !formData.slug || formData.slug === lastAutoSlug;
    if (shouldAutoUpdate) {
      formData.slug = generated;
      lastAutoSlug = generated;
    }
  }

  function handleSlugInput() {
    slugIsManual = true;
  }

  function handleNameBlur() {
    syncSlugFromName();
  }

  $: enFieldsMissing =
    activeLang === 'en'
      ? [
          !formData.name_en && 'Nome EN',
          !formData.tagline_en && 'Tagline EN',
          !formData.description_en && 'Descrição EN',
        ].filter(Boolean)
      : [];

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
      <span class="capitalize">{isEditing ? 'Editar' : 'Criar'} · {formData.name_pt || 'Novo'}</span
      >
      <span>/</span>
      <span>produtos</span>
      <span>/</span>
      <span class="text-zinc-400">formulário</span>
    </div>
  </div>

  <div class="flex-1 overflow-y-auto px-8 py-2 space-y-5 custom-scrollbar max-h-[64vh]">
    <div>
      <div class="flex items-center justify-between mb-2">
        <span class="block text-[11px] font-bold text-zinc-500 uppercase tracking-widest"
          >Nome do Produto</span
        >
        <div class="lang-toggle">
          <LangToggle bind:value={activeLang} />
        </div>
      </div>

      {#if activeLang === 'pt'}
        <input
          type="text"
          class={inputClass}
          placeholder="Ex: Avali"
          bind:value={formData.name_pt}
          on:blur={handleNameBlur}
          required
        />
      {:else}
        <input
          type="text"
          class={inputClass}
          placeholder="Ex: Assessment platform"
          bind:value={formData.name_en}
        />
      {/if}
    </div>

    <div>
      <span class="block text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-2"
        >Slug da URL</span
      >
      <input
        type="text"
        class={inputClass}
        placeholder="ex: avali-correcao"
        bind:value={formData.slug}
        on:input={handleSlugInput}
        required
      />
      <p class="mt-2 text-[11px] text-zinc-500">
        Gerado automaticamente a partir do Nome PT, mas pode ser editado manualmente.
      </p>
    </div>

    {#if activeLang === 'en' && enFieldsMissing.length}
      <div
        class="rounded-lg border border-amber-900/50 bg-amber-950/20 px-3 py-2 text-xs text-amber-200"
      >
        Campos em inglês vazios: {enFieldsMissing.join(', ')}
      </div>
    {/if}

    <div>
      <span class="block text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-2"
        >Categoria</span
      >
      {#if activeLang === 'pt'}
        <input
          type="text"
          class={inputClass}
          placeholder="Gestão Educacional"
          bind:value={formData.category_pt}
        />
      {:else}
        <input
          type="text"
          class={inputClass}
          placeholder="Educational Management"
          bind:value={formData.category_en}
        />
      {/if}
    </div>

    <div>
      <div class="flex items-center justify-between mb-2">
        <span class="text-[11px] font-bold text-zinc-500 uppercase tracking-widest"
          >Tagline (1 linha)</span
        >
      </div>
      {#if activeLang === 'pt'}
        <input
          type="text"
          class={inputClass}
          placeholder="Plataforma de avaliações escolares..."
          bind:value={formData.tagline_pt}
        />
      {:else}
        <input
          type="text"
          class={inputClass}
          placeholder="School assessment platform..."
          bind:value={formData.tagline_en}
        />
      {/if}
    </div>

    <div>
      <div class="flex items-center justify-between mb-2">
        <span class="text-[11px] font-bold text-zinc-500 uppercase tracking-widest"
          >Descrição Completa</span
        >
      </div>
      {#if activeLang === 'pt'}
        <textarea
          rows="4"
          class="{inputClass} resize-none"
          placeholder="Crie, aplique e corrija avaliações..."
          bind:value={formData.description_pt}
        ></textarea>
      {:else}
        <textarea
          rows="4"
          class="{inputClass} resize-none"
          placeholder="Create, deliver and grade assessments..."
          bind:value={formData.description_en}
        ></textarea>
      {/if}
    </div>

    <div>
      <span class="block text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-3"
        >Status de Publicação</span
      >
      <PublishToggle bind:published={formData.published} />
    </div>
  </div>

  <div class="flex items-center justify-between border-t border-zinc-800/80 px-8 py-4 bg-[#121214]">
    <span class="text-[10px] text-zinc-600 font-medium uppercase tracking-wider"
      >▲ PT e EN são gravados separadamente</span
    >

    <div class="flex items-center gap-3">
      <button
        type="button"
        class="rounded-full border border-zinc-700/60 px-5 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-900 transition-colors"
        on:click={cancel}>Cancelar</button
      >
      <button
        type="submit"
        class="rounded-full bg-zinc-100 px-5 py-2 text-xs font-bold text-zinc-950 hover:bg-zinc-200 transition-colors shadow-md"
        >{isEditing ? 'Salvar alterações' : 'Criar produto'}</button
      >
    </div>
  </div>
</form>

<style>
  /* Generic field helper used across the product modal fields */
  .fld {
    box-sizing: border-box;
  }
</style>
