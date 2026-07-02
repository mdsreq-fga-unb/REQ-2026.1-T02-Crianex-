<script lang="ts">
  import { onDestroy } from 'svelte';
  import { env } from '$env/dynamic/public';
  import { supabase } from '$lib/api/supabase';
  import { Plus, Check } from 'lucide-svelte';

  export let formData: any;
  let fileInput: HTMLInputElement | null = null;
  let isUploading = false;
  let imageError = '';
  let previewUrl = '';
  let dragActive = false;
  let objectUrlToCleanup = '';

  const prebuiltColors = [
    '#e71f84' /* pink */,
    '#7f3fe5' /* purple */,
    '#66df7a' /* green */,
    '#f3f4f6' /* neutral light */,
    '#9ca3af' /* neutral mid */,
    '#6b7280' /* neutral darker */,
    '#111827' /* neutral dark */,
    '#f97316' /* accent orange */,
  ];

  const maxImageSizeBytes = 2 * 1024 * 1024;

  function pickColor(c: string) {
    formData.color = c;
  }

  function triggerFilePicker() {
    fileInput?.click();
  }

  function clearFileInput() {
    if (fileInput) fileInput.value = '';
  }

  function setPreview(file: File) {
    if (objectUrlToCleanup) {
      URL.revokeObjectURL(objectUrlToCleanup);
    }
    objectUrlToCleanup = URL.createObjectURL(file);
    previewUrl = objectUrlToCleanup;
  }

  async function handleFile(file: File) {
    if (file.size > maxImageSizeBytes) {
      imageError = 'Imagem muito grande. Máx. 2MB';
      clearFileInput();
      return;
    }

    imageError = '';
    isUploading = true;
    setPreview(file);

    try {
      const fd = new FormData();
      fd.append('image', file);

      const base = env.PUBLIC_API_BASE_URL ?? 'http://localhost:3000';
      const accessToken = (await supabase?.auth.getSession())?.data.session?.access_token;
      const res = await fetch(`${base}/api/admin/products/upload`, {
        method: 'POST',
        body: fd,
        credentials: 'include',
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? `Upload falhou (${res.status})`);
      }

      const { image_url } = await res.json();
      formData.image_url = image_url;
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Falha ao enviar imagem';
      console.error('Erro ao fazer upload da imagem:', msg);
      imageError = msg;
      formData.image_url = '';
      previewUrl = '';
      if (objectUrlToCleanup) {
        URL.revokeObjectURL(objectUrlToCleanup);
        objectUrlToCleanup = '';
      }
    } finally {
      isUploading = false;
      clearFileInput();
    }
  }

  async function uploadImage(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;
    await handleFile(file);
  }

  async function handleDrop(event: DragEvent) {
    dragActive = false;
    const file = event.dataTransfer?.files?.[0];
    if (!file) return;
    await handleFile(file);
  }

  onDestroy(() => {
    if (objectUrlToCleanup) {
      URL.revokeObjectURL(objectUrlToCleanup);
    }
  });
</script>

<div class="flex w-[35%] shrink-0 flex-col gap-6 bg-[#0a0a0c] p-6 border-r border-zinc-800/60">
  <div>
    <span class="block text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-3"
      >Imagem / Capa</span
    >

    <div
      role="button"
      tabindex="0"
      class="relative flex h-52 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed transition-all duration-300"
      class:border-cyan-500={dragActive}
      class:border-zinc-700={!dragActive}
      class:bg-zinc-950={true}
      on:click={triggerFilePicker}
      on:keydown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggerFilePicker();
        }
      }}
      on:dragover|preventDefault={() => (dragActive = true)}
      on:dragleave={() => (dragActive = false)}
      on:drop|preventDefault={handleDrop}
    >
      {#if previewUrl || formData.image_url}
        <img
          src={previewUrl || formData.image_url}
          alt="capa"
          class="absolute inset-0 h-full w-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30"></div>
      {/if}

      <button
        type="button"
        class="absolute top-3 right-3 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-black/35 hover:bg-black/60 text-white transition-colors"
        on:click={triggerFilePicker}
      >
        <Plus class="h-4 w-4" />
      </button>

      <input
        type="file"
        accept="image/*"
        class="hidden"
        bind:this={fileInput}
        on:change={uploadImage}
      />

      {#if !(previewUrl || formData.image_url)}
        <div class="relative z-10 flex flex-col items-center gap-2 px-6 text-center">
          <div
            class="flex h-14 w-14 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/80 text-zinc-200 shadow-inner"
          >
            <Plus class="h-6 w-6" />
          </div>
          <div class="space-y-1">
            <p class="text-sm font-semibold text-zinc-100">
              Arraste a imagem ou clique para enviar
            </p>
            <p class="text-xs text-zinc-400">PNG, JPG ou WEBP até 2MB</p>
          </div>
        </div>
      {:else}
        <div class="absolute bottom-3 left-3 right-3 z-10 flex items-end justify-between gap-3">
          <div class="rounded-lg bg-black/40 px-3 py-2 backdrop-blur-sm">
            <p class="text-[11px] font-semibold uppercase tracking-widest text-zinc-200">
              Preview de Imagem
            </p>
            <p class="text-[10px] text-zinc-400">Clique ou arraste para trocar</p>
          </div>
          {#if isUploading}
            <div
              class="rounded-full bg-cyan-500/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-cyan-200"
            >
              Enviando...
            </div>
          {/if}
        </div>
      {/if}

      {#if imageError}
        <div
          class="absolute left-3 right-3 top-3 z-20 rounded-lg border border-rose-900/60 bg-rose-950/80 px-3 py-2 text-xs text-rose-200 shadow-lg"
        >
          {imageError}
        </div>
      {/if}

      {#if !previewUrl && !formData.image_url}
        <span
          class="absolute inset-0 flex items-center justify-center text-6xl font-bold text-zinc-800 uppercase tracking-wider select-none pointer-events-none"
        >
          {formData.icon_text || '??'}
        </span>
      {/if}
    </div>
  </div>

  <div>
    <span class="block text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-3"
      >Cor de Marca</span
    >
    <div class="grid grid-cols-6 gap-2">
      {#each prebuiltColors as itemColor}
        <button
          type="button"
          class="color-swatch relative"
          class:on={formData.color === itemColor}
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
    <div class="mt-3 flex items-center gap-3">
      <input
        type="text"
        class="w-full rounded-lg border border-zinc-800 bg-[#09090b] px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-700 focus:border-zinc-700 focus:outline-none"
        bind:value={formData.color}
        placeholder="#7c3aed"
        maxlength="7"
      />
      <div
        class="h-11 w-11 shrink-0 rounded-lg border border-zinc-800"
        style="background-color: {formData.color}"
      ></div>
    </div>
  </div>

  <div>
    <span class="block text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-2"
      >Sigla (2 Letras)</span
    >
    <input
      type="text"
      maxlength="4"
      class="w-full rounded-lg border border-zinc-800 bg-[#09090b] px-3 py-2.5 text-sm font-medium text-zinc-200 focus:border-zinc-700 focus:outline-none uppercase"
      bind:value={formData.icon_text}
    />
  </div>

  <style>
    /* Color swatch base and selected state */
    .color-swatch {
      height: 2rem;
      width: 2rem;
      border-radius: 0.5rem;
      border: 1px solid rgba(0, 0, 0, 0.45);
      transition:
        transform 0.12s ease,
        box-shadow 0.12s ease;
      display: inline-block;
    }
    .color-swatch.on {
      transform: scale(1.06);
      box-shadow:
        0 6px 18px rgba(0, 0, 0, 0.45),
        0 0 0 4px rgba(127, 62, 229, 0.06);
    }
  </style>
</div>
