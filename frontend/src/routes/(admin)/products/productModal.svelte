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
    color: '#7c3aed',
    icon_text: 'AV',
    published: false,
    slug: '',
    image_url: '',
  };

  export let onSave: () => Promise<void>;

  function fechar() {
    isOpen = false;
  }
</script>

{#if isOpen}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm animate-fade"
  >
    <div
      class="admin-modal wide relative flex h-full max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-2xl border border-zinc-800/80 bg-[#121214] text-zinc-100 shadow-2xl"
    >
      <button
        type="button"
        class="absolute right-5 top-5 text-zinc-500 hover:text-zinc-300 transition-colors z-20"
        on:click={fechar}
      >
        <X class="h-5 w-5" />
      </button>

      <ProductModalLeft bind:formData />
      <ProductForm bind:formData {isEditing} on:save={onSave} on:cancel={fechar} />
    </div>
  </div>
{/if}

<style>
  :global(.animate-fade) {
    animation: fadeIn 0.15s ease-out forwards;
  }
  :global(.animate-slide) {
    animation: slideIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(3px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
