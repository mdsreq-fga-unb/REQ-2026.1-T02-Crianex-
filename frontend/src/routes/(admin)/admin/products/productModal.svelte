<script lang="ts">
  import { onDestroy } from 'svelte';
  import { env } from '$env/dynamic/public';
  import { supabase } from '$lib/api/supabase';
  import { X, Plus, Check } from 'lucide-svelte';

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
    product_url: '',
  };
  export let onSave: () => Promise<void>;

  // ── lang toggle ───────────────────────────────────────────
  let activeLang: 'pt' | 'en' = 'pt';

  // ── slug ──────────────────────────────────────────────────
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

  function syncSlug() {
    const g = slugify(formData.name_pt ?? '');
    if (!g) return;
    if (!slugIsManual || !formData.slug || formData.slug === lastAutoSlug) {
      formData.slug = g;
      lastAutoSlug = g;
    }
  }

  // ── image upload ──────────────────────────────────────────
  let fileInput: HTMLInputElement | null = null;
  let isUploading = false;
  let imageError = '';
  let previewUrl = '';
  let dragActive = false;
  let objectUrl = '';

  const maxBytes = 2 * 1024 * 1024;

  const prebuiltColors = [
    '#e71f84',
    '#7f3fe5',
    '#66df7a',
    '#f3f4f6',
    '#9ca3af',
    '#6b7280',
    '#111827',
    '#f97316',
  ];

  function pickColor(c: string) {
    formData.color = c;
  }

  function setPreview(file: File) {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = URL.createObjectURL(file);
    previewUrl = objectUrl;
  }

  async function handleFile(file: File) {
    if (file.size > maxBytes) {
      imageError = 'Imagem muito grande. Máx. 2MB';
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
        const b = await res.json().catch(() => null);
        throw new Error(b?.error ?? `Upload falhou (${res.status})`);
      }
      formData.image_url = (await res.json()).image_url;
    } catch (e: unknown) {
      imageError = e instanceof Error ? e.message : 'Falha ao enviar imagem';
      formData.image_url = '';
      previewUrl = '';
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
        objectUrl = '';
      }
    } finally {
      isUploading = false;
      if (fileInput) fileInput.value = '';
    }
  }

  async function onFileChange(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (f) await handleFile(f);
  }

  async function onDrop(e: DragEvent) {
    dragActive = false;
    const f = e.dataTransfer?.files?.[0];
    if (f) await handleFile(f);
  }

  onDestroy(() => {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
  });

  // Reset preview whenever the modal opens (new product or edit)
  $: if (isOpen) {
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      objectUrl = '';
    }
    previewUrl = '';
  }

  function fechar() {
    isOpen = false;
  }
  async function submit(e: Event) {
    e.preventDefault();
    await onSave();
  }
</script>

{#if isOpen}
  <!-- overlay -->
  <div class="overlay" role="dialog" aria-modal="true">
    <!-- modal -->
    <div class="modal">
      <!-- close btn -->
      <button type="button" class="close-btn" on:click={fechar} aria-label="Fechar">
        <X size={16} />
      </button>

      <!-- ── LEFT PANEL ───────────────────────────────────── -->
      <aside class="left-panel">
        <!-- image upload -->
        <section class="left-section">
          <span class="section-label">Imagem / Capa</span>
          <div
            class="dropzone"
            class:drag-over={dragActive}
            role="button"
            tabindex="0"
            on:click={() => fileInput?.click()}
            on:keydown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                fileInput?.click();
              }
            }}
            on:dragover|preventDefault={() => (dragActive = true)}
            on:dragleave={() => (dragActive = false)}
            on:drop|preventDefault={onDrop}
          >
            {#if previewUrl || formData.image_url}
              <img src={previewUrl || formData.image_url} alt="capa" class="drop-img" />
              <div class="drop-gradient"></div>
              <div class="drop-badge">
                <span class="drop-badge-title">Preview de Imagem</span>
                <span class="drop-badge-sub">Clique ou arraste para trocar</span>
              </div>
              {#if isUploading}
                <span class="uploading-pill">Enviando...</span>
              {/if}
            {:else}
              <span class="drop-icon-text">{formData.icon_text || '??'}</span>
              <div class="drop-empty">
                <div class="drop-circle"><Plus size={22} /></div>
                <p class="drop-hint">Arraste a imagem ou clique para enviar</p>
                <p class="drop-formats">PNG, JPG ou WEBP até 2MB</p>
              </div>
            {/if}

            {#if imageError}
              <div class="drop-error">{imageError}</div>
            {/if}

            <button
              type="button"
              class="drop-plus-btn"
              on:click|stopPropagation={() => fileInput?.click()}><Plus size={14} /></button
            >

            <input
              type="file"
              accept="image/*"
              bind:this={fileInput}
              on:change={onFileChange}
              class="hidden-file"
            />
          </div>
        </section>

        <!-- color picker -->
        <section class="left-section">
          <span class="section-label">Cor de Marca</span>
          <div class="swatches">
            {#each prebuiltColors as c}
              <button
                type="button"
                class="swatch"
                class:swatch-on={formData.color === c}
                style="background:{c}"
                on:click={() => pickColor(c)}
              >
                {#if formData.color === c}<Check size={13} color="white" />{/if}
              </button>
            {/each}
          </div>
          <div class="hex-row">
            <input
              type="text"
              class="left-input"
              bind:value={formData.color}
              placeholder="#7c3aed"
              maxlength="7"
            />
            <span class="color-preview" style="background:{formData.color}"></span>
          </div>
        </section>

        <!-- sigla -->
        <section class="left-section">
          <span class="section-label">Sigla (2 Letras)</span>
          <input
            type="text"
            class="left-input"
            maxlength="4"
            style="text-transform:uppercase;"
            bind:value={formData.icon_text}
          />
        </section>
      </aside>

      <!-- ── RIGHT PANEL ──────────────────────────────────── -->
      <form class="right-panel" on:submit={submit}>
        <!-- breadcrumb -->
        <div class="breadcrumb">
          <span>{isEditing ? 'Editar' : 'Criar'} · {formData.name_pt || 'Novo'}</span>
          <span class="sep">/</span><span>produtos</span>
          <span class="sep">/</span><span class="crumb-active">formulário</span>
        </div>

        <!-- scrollable fields -->
        <div class="fields">
          <!-- nome (único, sem versão EN) -->
          <div class="field-group">
            <span class="field-label">Nome do Produto</span>
            <input
              type="text"
              class="right-input"
              placeholder="Ex: Avali"
              bind:value={formData.name_pt}
              on:blur={syncSlug}
              required
            />
          </div>

          <!-- slug -->
          <div class="field-group">
            <span class="field-label">Slug da URL</span>
            <input
              type="text"
              class="right-input"
              placeholder="ex: avali-correcao"
              bind:value={formData.slug}
              on:input={() => (slugIsManual = true)}
              required
            />
            <p class="field-hint">
              Gerado automaticamente a partir do nome, mas pode ser editado manualmente.
            </p>
          </div>

          <!-- link do produto -->
          <div class="field-group">
            <span class="field-label">Link do produto</span>
            <input
              type="url"
              class="right-input"
              placeholder="https://avali.crianex.com"
              bind:value={formData.product_url}
            />
            <p class="field-hint">
              Botão "Saiba mais" na vitrine. Deixe vazio para usar a página interna.
            </p>
          </div>

          <!-- cabeçalho da seção bilíngue -->
          <div class="bilingual-header">
            <span class="field-label">Conteúdo bilíngue</span>
            <div class="lang-toggle">
              <button
                type="button"
                class:lt-active={activeLang === 'pt'}
                on:click={() => (activeLang = 'pt')}>🇧🇷 PT</button
              >
              <button
                type="button"
                class:lt-active={activeLang === 'en'}
                on:click={() => (activeLang = 'en')}>🇺🇸 EN</button
              >
            </div>
          </div>

          <!-- categoria -->
          <div class="field-group">
            <span class="field-label">Categoria</span>
            {#if activeLang === 'pt'}
              <input
                type="text"
                class="right-input"
                placeholder="Gestão Educacional"
                bind:value={formData.category_pt}
              />
            {:else}
              <input
                type="text"
                class="right-input"
                placeholder="Educational Management"
                bind:value={formData.category_en}
              />
            {/if}
          </div>

          <!-- tagline -->
          <div class="field-group">
            <span class="field-label">Tagline (1 linha)</span>
            {#if activeLang === 'pt'}
              <input
                type="text"
                class="right-input"
                placeholder="Plataforma de avaliações escolares..."
                bind:value={formData.tagline_pt}
              />
            {:else}
              <input
                type="text"
                class="right-input"
                placeholder="School assessment platform..."
                bind:value={formData.tagline_en}
              />
            {/if}
          </div>

          <!-- descrição -->
          <div class="field-group">
            <span class="field-label">Descrição Completa</span>
            {#if activeLang === 'pt'}
              <textarea
                rows="4"
                class="right-input right-textarea"
                placeholder="Crie, aplique e corrija avaliações..."
                bind:value={formData.description_pt}
              ></textarea>
            {:else}
              <textarea
                rows="4"
                class="right-input right-textarea"
                placeholder="Create, deliver and grade assessments..."
                bind:value={formData.description_en}
              ></textarea>
            {/if}
          </div>

          <!-- status -->
          <div class="field-group">
            <span class="field-label">Status de Publicação</span>
            <div class="publish-toggle">
              <button
                type="button"
                class="pub-btn"
                class:pub-on={formData.published}
                on:click={() => (formData.published = true)}
              >
                <span class="pub-title">Publicado</span>
                <span class="pub-sub">Visível na vitrine pública</span>
              </button>
              <button
                type="button"
                class="pub-btn"
                class:pub-on={!formData.published}
                on:click={() => (formData.published = false)}
              >
                <span class="pub-title">Rascunho</span>
                <span class="pub-sub">Salvo, oculto do público</span>
              </button>
            </div>
          </div>
        </div>

        <!-- footer -->
        <div class="modal-footer">
          <span class="footer-note">▲ Categoria, Tagline e Descrição têm versão bilíngue</span>
          <div class="footer-actions">
            <button type="button" class="btn-cancel" on:click={fechar}>Cancelar</button>
            <button type="submit" class="btn-save"
              >{isEditing ? 'Salvar alterações' : 'Criar produto'}</button
            >
          </div>
        </div>
      </form>
    </div>
  </div>
{/if}

<style>
  /* ── Overlay ───────────────────────────────────────────── */
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

  /* ── Modal container ────────────────────────────────────── */
  .modal {
    position: relative;
    display: flex;
    width: 100%;
    max-width: 940px;
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

  /* ── Close button ───────────────────────────────────────── */
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

  /* ── Left panel ─────────────────────────────────────────── */
  .left-panel {
    width: 300px;
    flex-shrink: 0;
    background: #0a0a0c;
    border-right: 1px solid #1f1f23;
    padding: 24px 20px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    overflow-y: auto;
  }

  .left-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .section-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #52525b;
  }

  /* ── Dropzone ───────────────────────────────────────────── */
  .dropzone {
    position: relative;
    height: 180px;
    border-radius: 12px;
    border: 1.5px dashed #3f3f46;
    background: #09090b;
    cursor: pointer;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.15s;
  }
  .dropzone:hover,
  .drag-over {
    border-color: #22d3ee;
  }

  .drop-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .drop-gradient {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.65) 0%,
      rgba(0, 0, 0, 0.1) 50%,
      rgba(0, 0, 0, 0.25) 100%
    );
  }
  .drop-badge {
    position: absolute;
    bottom: 10px;
    left: 10px;
    background: rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(4px);
    border-radius: 8px;
    padding: 6px 10px;
  }
  .drop-badge-title {
    display: block;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #e4e4e7;
  }
  .drop-badge-sub {
    display: block;
    font-size: 10px;
    color: #a1a1aa;
  }

  .uploading-pill {
    position: absolute;
    bottom: 10px;
    right: 10px;
    background: rgba(34, 211, 238, 0.15);
    color: #a5f3fc;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 3px 10px;
    border-radius: 100px;
  }

  .drop-icon-text {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 52px;
    font-weight: 700;
    color: #27272a;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    user-select: none;
    pointer-events: none;
  }

  .drop-empty {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    text-align: center;
    padding: 0 20px;
  }
  .drop-circle {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 1px solid #3f3f46;
    background: rgba(24, 24, 27, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #d4d4d8;
  }
  .drop-hint {
    font-size: 13px;
    font-weight: 600;
    color: #f4f4f5;
    line-height: 1.3;
  }
  .drop-formats {
    font-size: 11px;
    color: #71717a;
  }

  .drop-error {
    position: absolute;
    top: 8px;
    left: 8px;
    right: 8px;
    z-index: 10;
    background: rgba(69, 10, 10, 0.9);
    border: 1px solid rgba(185, 28, 28, 0.5);
    color: #fca5a5;
    font-size: 11px;
    padding: 6px 10px;
    border-radius: 8px;
  }

  .drop-plus-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 10;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    border: none;
    background: rgba(0, 0, 0, 0.4);
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.12s;
  }
  .drop-plus-btn:hover {
    background: rgba(0, 0, 0, 0.65);
  }

  .hidden-file {
    display: none;
  }

  /* ── Swatches ───────────────────────────────────────────── */
  .swatches {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 6px;
  }
  .swatch {
    width: 100%;
    aspect-ratio: 1;
    border-radius: 6px;
    border: 1px solid rgba(0, 0, 0, 0.4);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
      transform 0.1s,
      box-shadow 0.1s;
  }
  .swatch:hover {
    transform: scale(1.1);
  }
  .swatch-on {
    transform: scale(1.08);
    box-shadow:
      0 0 0 2px #7f3fe5,
      0 4px 12px rgba(0, 0, 0, 0.4);
  }

  /* ── Hex row ────────────────────────────────────────────── */
  .hex-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .color-preview {
    width: 38px;
    height: 38px;
    flex-shrink: 0;
    border-radius: 8px;
    border: 1px solid #3f3f46;
  }

  /* ── Left inputs ────────────────────────────────────────── */
  .left-input {
    width: 100%;
    background: #09090b;
    border: 1px solid #3f3f46;
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 13px;
    font-family: inherit;
    color: #e4e4e7;
    outline: none;
    transition: border-color 0.15s;
    box-sizing: border-box;
  }
  .left-input:focus {
    border-color: #52525b;
  }
  .left-input::placeholder {
    color: #52525b;
  }

  /* ── Right panel ────────────────────────────────────────── */
  .right-panel {
    flex: 1;
    min-width: 0;
    background: #121214;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /* ── Breadcrumb ─────────────────────────────────────────── */
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

  /* ── Fields area ────────────────────────────────────────── */
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

  /* ── Field group ────────────────────────────────────────── */
  .field-group {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }
  /* ── Bilingual section header ───────────────────────────── */
  .bilingual-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0 4px;
    border-top: 1px solid #1f1f23;
    margin-top: 4px;
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

  /* ── Lang toggle ────────────────────────────────────────── */
  .lang-toggle {
    display: flex;
    gap: 3px;
    background: #09090b;
    padding: 2px;
    border-radius: 6px;
  }
  .lang-toggle button {
    border: none;
    border-radius: 4px;
    padding: 3px 8px;
    font-size: 10px;
    font-weight: 700;
    font-family: inherit;
    color: #71717a;
    background: transparent;
    cursor: pointer;
    transition:
      background 0.1s,
      color 0.1s;
  }
  .lang-toggle .lt-active {
    background: #27272a;
    color: #e4e4e7;
  }

  /* ── Right inputs ───────────────────────────────────────── */
  .right-input {
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
  .right-input:focus {
    border-color: #52525b;
    background: #050507;
  }
  .right-input::placeholder {
    color: #3f3f46;
  }
  .right-textarea {
    resize: none;
  }

  /* ── Publish toggle ─────────────────────────────────────── */
  .publish-toggle {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  .pub-btn {
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding: 12px 14px;
    border-radius: 10px;
    border: 1px solid #27272a;
    background: #09090b;
    cursor: pointer;
    text-align: left;
    transition:
      border-color 0.15s,
      background 0.15s;
    font-family: inherit;
  }
  .pub-btn:hover {
    border-color: #3f3f46;
  }
  .pub-btn.pub-on {
    border-color: rgba(16, 185, 129, 0.35);
    background: rgba(16, 185, 129, 0.05);
  }
  .pub-title {
    font-size: 13px;
    font-weight: 600;
    color: #e4e4e7;
  }
  .pub-sub {
    font-size: 11px;
    color: #71717a;
  }

  /* ── Footer ─────────────────────────────────────────────── */
  .modal-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 28px;
    border-top: 1px solid #1f1f23;
    background: #121214;
    flex-shrink: 0;
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
