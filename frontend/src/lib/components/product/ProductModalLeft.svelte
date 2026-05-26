<script lang="ts">
  import { supabase } from '$lib/api/supabase';
  import { Plus, Check } from 'lucide-svelte';
  

  export let formData: any;
  let fileInput: HTMLInputElement | null = null;
  let isUploading = false;

  const prebuiltColors = [
    '#7c3aed',
    '#ec4899',
    '#22c55e',
    '#3b82f6',
    '#eab308',
    '#06b6d4',
    '#10b981',
    '#f97316'
  ];

  function pickColor(c: string) {
    formData.color = c;
  }


  function triggerFilePicker() {
    fileInput?.click();
  }

  async function uploadImage(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input || !input.files || input.files.length === 0) return;

    const file = input.files[0];
    if (!file) return;
    isUploading = true;
    try {
      const fileExt = file.name.split('.').pop() ?? 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2,7)}.${fileExt}`;
      const filePath = `covers/${fileName}`;

      if (supabase) {
        const { data, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false // evita sobrescrever
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = await supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        formData.image_url = publicUrl;
      } else {
        // Fallback: converte para data URL (base64) para permitir pré-visualização
        // e testes locais sem necessidade de um cliente Supabase configurado
        const reader = new FileReader();
        const dataUrl: string = await new Promise((resolve, reject) => {
          reader.onerror = () => reject(new Error('Falha ao ler arquivo'));
          reader.onload = () => resolve(String(reader.result));
          reader.readAsDataURL(file);
        });
        formData.image_url = dataUrl;
        console.info('Imagem carregada localmente como data URL (fallback)');
      }
    } catch (error: any) {
      console.error('Erro ao fazer upload da imagem:', error?.message ?? error);
      alert('Falha ao enviar imagem: ' + (error?.message ?? String(error)));
    } finally {
      isUploading = false;
      if (fileInput) fileInput.value = '';
    }
  }
</script>

<div class="flex w-[35%] flex-col gap-6 bg-[#0a0a0c] p-6 border-r border-zinc-800/60">
  <div>
    <span class="block text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Imagem / Capa</span>

    <div 
      class="relative flex h-40 w-full flex-col items-center justify-center rounded-xl shadow-lg transition-all duration-300"
      style="background-color: {formData.color}"
    >
      <button
        type="button"
        class="absolute top-3 right-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
        on:click={triggerFilePicker}
      >
        <Plus class="h-4 w-4" />
      </button>

      <input type="file" accept="image/*" class="hidden" bind:this={fileInput} on:change={uploadImage} />

      {#if formData.image_url}
        <img src={formData.image_url} alt="capa" class="absolute inset-0 h-full w-full object-cover rounded-xl" />
      {:else}
        <span class="text-5xl font-bold text-white uppercase tracking-wider select-none">
          {formData.icon_text || '??'}
        </span>
      {/if}
    </div>
  </div>

  <div>
    <span class="block text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Cor de Marca</span>
    <div class="grid grid-cols-6 gap-2">
      {#each prebuiltColors as itemColor}
        <button
          type="button"
          class="relative h-8 w-8 rounded-lg border border-zinc-900 transition-transform active:scale-95"
          style="background-color: {itemColor}"
          on:click={() => pickColor(itemColor)}
        >
          {#if formData.color === itemColor}
            <div class="absolute inset-0 flex items-center justify-center bg-black/10 rounded-lg">
              <Check class="h-4 w-4 text-white font-bold" />
            </div>
          {/if}
        </button>
      {/each}
    </div>
  </div>

  <div>
    <span class="block text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Sigla (2 Letras)</span>
    <input 
      type="text" 
      maxlength="4"
      class="w-full rounded-lg border border-zinc-800 bg-[#09090b] px-3 py-2.5 text-sm font-medium text-zinc-200 focus:border-zinc-700 focus:outline-none uppercase"
      bind:value={formData.icon_text}
    />
  </div>

</div>
