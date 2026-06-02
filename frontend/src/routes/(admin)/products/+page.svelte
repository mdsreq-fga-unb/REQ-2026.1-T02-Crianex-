<script lang="ts">
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import type { PageData } from './$types';
  import { EllipsisVertical, Pencil, EyeOff, Trash2, Eye } from 'lucide-svelte';
  import { onMount, onDestroy } from 'svelte';
  import { topbarActions } from '$lib/stores/topbar';

  import { apiFetch } from '$lib/api/backend';
  import { tick } from 'svelte';
  import { invalidateAll } from '$app/navigation';
  import ProductModal from './productModal.svelte'; // Importa o componente que criamos

  import DeleteModal from './deleteModal.svelte';

  // Estados de controle do Modal
  let isModalOpen = false;
  let isEditingMode = false;
  let currentProductId: string | null = null;

  // Molde limpo do formulário para resetar ao criar novo
  const emptyForm = {
    name_pt: '',
    name_en: '',
    slug: '',
    category_pt: '',
    category_en: '',
    tagline_pt: '',
    tagline_en: '',
    description_pt: '',
    description_en: '',
    color: '#6366f1',
    icon_text: '',
    image_url: '',
    published: false,
  };

  let modalData = { ...emptyForm };

  // Estado global de processamento para operações async (criar/editar/publicar/excluir)
  let isProcessing = false;
  let processingMessage = '';

  // Toast de sucesso (3s)
  let toastMessage = '';
  let toastVisible = false;
  let toastTimer: ReturnType<typeof setTimeout> | null = null;

  function showToast(msg: string) {
    if (toastTimer) clearTimeout(toastTimer);
    toastMessage = msg;
    toastVisible = true;
    toastTimer = setTimeout(() => {
      toastVisible = false;
    }, 3000);
  }

  onMount(() => {
    topbarActions.set([{ label: '+ Novo produto', onClick: handleNovoProduto }]);
    return () => topbarActions.set([]);
  });

  // Gatilho: Clicou em "+ Novo Produto"
  function handleNovoProduto() {
    isEditingMode = false;
    currentProductId = null;
    modalData = { ...emptyForm, slug: '' };
    isModalOpen = true;
  }

  // Gatilho: Clicou em "Editar" no Dropdown da linha do produto
  function handleEditarProduto(produto: Produto) {
    isEditingMode = true;
    currentProductId = produto.id;
    modalData = {
      name_pt: produto.name_pt,
      name_en: produto.name_en,
      slug: produto.slug,
      published: produto.published,
      category_pt: produto.category_pt ?? '',
      category_en: produto.category_en ?? '',
      tagline_pt: produto.tagline_pt ?? '',
      tagline_en: produto.tagline_en ?? '',
      description_pt: produto.description_pt ?? '',
      description_en: produto.description_en ?? '',
      color: produto.color ?? '#6366f1',
      icon_text: produto.icon_text ?? '',
      image_url: produto.image_url ?? '',
    };
    isModalOpen = true;
  }

  // Função disparada quando o modal clica em "Salvar" ou "Criar"
  async function handleSaveModal() {
    try {
      // Close modal first so native dialog/backdrop is removed
      isModalOpen = false;
      await tick();

      isProcessing = true;
      processingMessage = isEditingMode ? 'Salvando alterações...' : 'Criando produto...';

      if (isEditingMode) {
        await apiFetch(`/products/${currentProductId}`, {
          method: 'PATCH',
          body: JSON.stringify(modalData),
        });
      } else {
        await apiFetch('/products', {
          method: 'POST',
          body: JSON.stringify(modalData),
        });
      }

      await invalidateAll();
      isProcessing = false;
      showToast(isEditingMode ? 'Produto atualizado com sucesso!' : 'Produto criado com sucesso!');
    } catch (err) {
      isProcessing = false;
      console.error('Falha ao processar operação do produto:', err);
    }
  }

  export let data: PageData;

  type Produto = NonNullable<PageData['produtos']>[number];

  let listaProdutos: Produto[] = [];

  $: if (data.produtos) {
    listaProdutos = [...data.produtos].sort(
      (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
    );
  }

  $: publicados = listaProdutos.filter((p) => p.published);
  $: rascunhos = listaProdutos.filter((p) => !p.published);

  let draggingIndex: number | null = null;
  let originalOrder: typeof listaProdutos = [];

  function handleDragStart(index: number) {
    draggingIndex = index;
    originalOrder = [...listaProdutos];
  }

  function handleDragOver(index: number) {
    if (draggingIndex === null || draggingIndex === index) return;

    const updatedPublicados = [...publicados];
    const [itemArrastado] = updatedPublicados.splice(draggingIndex, 1);
    if (!itemArrastado) return;
    updatedPublicados.splice(index, 0, itemArrastado);

    draggingIndex = index;
    listaProdutos = [...updatedPublicados, ...rascunhos];
  }

  async function handleDrop() {
    draggingIndex = null;

    const newOrder = publicados.map((produto, index) => ({
      id: produto.id,
      display_order: index + 1,
    }));

    try {
      await apiFetch('/products/reorder', {
        method: 'PATCH',
        body: JSON.stringify({ orders: newOrder }),
      });
      console.log('Nova ordem da vitrine salva com sucesso!');
      await invalidateAll();
    } catch (error) {
      console.error('Erro ao salvar ordenação:', error);
      listaProdutos = [...originalOrder];

      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('401')) {
        alert('Você precisa estar autenticado como administrador para reordenar a vitrine.');
        return;
      }
      alert('Erro ao salvar a nova ordenação no banco de dados. Retornando ao estado original.');
    }
  }

  function getInitials(name: string) {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  // Retorna um texto relativo com base em um timestamp ISO (updated_at)
  function getTimeAgo(iso?: string | null) {
    if (!iso) return 'há alguns dias';
    const then = new Date(iso).getTime();
    if (Number.isNaN(then)) return 'há alguns dias';
    const diffMs = Date.now() - then;
    const mins = Math.floor(diffMs / 1000 / 60);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    if (days >= 2) return `há ${days} dias`;
    if (days === 1) return 'há 1 dia';
    if (hours >= 1) return `há ${hours} horas`;
    if (mins >= 1) return `há ${mins} minutos`;
    return 'agora';
  }

  // Lógica das Ações do Menu
  async function handleTogglePublicacao(id: string, currentStatus: boolean) {
    console.log('Mudar status do id:', id, 'para:', !currentStatus);
    try {
      isProcessing = true;
      processingMessage = currentStatus ? 'Despublicando...' : 'Publicando...';
      console.debug('[client] about to call apiFetch for', id, '->', !currentStatus);
      const res = await apiFetch(`/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !currentStatus }),
      });
      console.debug('[client] apiFetch returned', res);

      await invalidateAll();
      isProcessing = false;
    } catch (error) {
      isProcessing = false;
      console.error('Erro ao altera status de publicação:', error);
    }
  }

  let showDeleteModal = false;
  let productIdToDelete: string | null = null;

  function openDeleteModal(id: string) {
    productIdToDelete = id;
    showDeleteModal = true;
  }

  function closeDeleteModal() {
    showDeleteModal = false;
    productIdToDelete = null;
  }

  // Nome do produto selecionado para exclusão (derivado do id)
  $: productToDeleteName = productIdToDelete
    ? (listaProdutos.find((p) => p.id === productIdToDelete)?.name_pt ??
      listaProdutos.find((p) => p.id === productIdToDelete)?.name_en ??
      '')
    : '';

  async function handleExcluir(id?: string) {
    // If caller passed a non-string (e.g. an Event), ignore it and use the selected id
    const idToDelete = typeof id === 'string' ? id : productIdToDelete;
    if (!idToDelete) {
      console.warn('handleExcluir called without a valid product id', { id });
      return;
    }

    console.debug('[client] Deleting product id:', idToDelete);

    // Close the modal first so the native dialog/backdrop is removed
    closeDeleteModal();
    await tick();

    isProcessing = true;
    processingMessage = 'Excluindo produto...';

    try {
      await apiFetch(`/products/${idToDelete}`, {
        method: 'DELETE',
      });

      console.log('Produto excluído com sucesso do banco de dados!');

      await invalidateAll();
    } catch (error) {
      console.error('Erro ao tentar excluir o produto:', error);
      alert('Não foi possível excluir o produto. Verifique se ele está despublicado!');
    } finally {
      isProcessing = false;
    }
  }
</script>

<!-- Overlays globais -->
{#if toastVisible}
  <div class="toast" role="status" aria-live="polite">
    <svg class="toast-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
    </svg>
    {toastMessage}
  </div>
{/if}
{#if isProcessing}
  <div class="processing-overlay">
    <div class="processing-card">
      <svg class="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" style="opacity:.25"></circle>
        <path fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" style="opacity:.75"></path>
      </svg>
      {processingMessage || 'Processando...'}
    </div>
  </div>
{/if}

<div class="admin-content">
  <div class="panel">

    <!-- Cabeçalho do painel -->
    <div class="panel-head">
      <h3>{listaProdutos.length} produto{listaProdutos.length !== 1 ? 's' : ''} · {publicados.length} publicado{publicados.length !== 1 ? 's' : ''}</h3>
      <span class="grow"></span>
      <span class="pill">vitrine.crianex.com</span>
    </div>

    {#if data.error}
      <div class="error-bar">{data.error}</div>
    {/if}

    <!-- Seção publicados -->
    <div class="section-label">
      <span>▲ Publicados · arraste para reordenar a vitrine</span>
      <span class="mono">{publicados.length}</span>
    </div>

    {#each publicados as produto, index (produto.id)}
      <div
        class="product-row"
        class:dragging={draggingIndex === index}
        role="listitem"
        draggable="true"
        on:dragstart={() => handleDragStart(index)}
        on:dragover|preventDefault={() => handleDragOver(index)}
        on:drop={handleDrop}
      >
        <!-- Ícone / imagem -->
        {#if produto.image_url}
          <img src={produto.image_url} alt="" class="p-icon img" />
        {:else}
          <span class="p-icon" style="background:{produto.color || '#6366f1'}">
            {produto.icon_text || getInitials(produto.name_pt)}
          </span>
        {/if}

        <!-- Nome + descrição -->
        <div class="p-meta">
          <span class="p-name">{produto.name_pt}</span>
          <span class="p-desc">{produto.tagline_pt || produto.description_pt || ''}</span>
        </div>

        <!-- Categoria -->
        <span class="p-cat mono">{produto.category_pt || 'Geral'}</span>

        <!-- Status -->
        <span class="pill published">PUBLICADO</span>

        <!-- Última edição -->
        <span class="p-time mono">edit. {getTimeAgo(produto.updated_at)}</span>

        <!-- Menu -->
        <DropdownMenu.Root>
          <DropdownMenu.Trigger class="row-menu-btn">
            <EllipsisVertical size={15} />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end" class="w-44 bg-[#161619] border-zinc-800 text-zinc-300 rounded-lg shadow-xl p-1">
            <DropdownMenu.Item class="p-0">
              <button type="button" on:click={() => handleEditarProduto(produto)} class="menu-item">
                <Pencil size={13} /> Editar produto
              </button>
            </DropdownMenu.Item>
            <DropdownMenu.Item class="p-0">
              <button type="button" on:click={() => handleTogglePublicacao(produto.id, produto.published)} class="menu-item">
                <EyeOff size={13} /> Despublicar
              </button>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    {/each}

    <!-- Seção rascunhos -->
    <div class="section-label draft">
      <span>○ Não publicados · não aparecem na vitrine pública</span>
      <span class="mono">{rascunhos.length}</span>
    </div>

    {#each rascunhos as produto (produto.id)}
      <div class="product-row draft">
        {#if produto.image_url}
          <img src={produto.image_url} alt="" class="p-icon img" />
        {:else}
          <span class="p-icon" style="background:{produto.color || '#4b5563'}">
            {produto.icon_text || getInitials(produto.name_pt)}
          </span>
        {/if}

        <div class="p-meta">
          <span class="p-name">{produto.name_pt}</span>
          <span class="p-desc">{produto.tagline_pt || produto.description_pt || ''}</span>
        </div>

        <span class="p-cat mono">{produto.category_pt || 'Geral'}</span>
        <span class="pill draft-pill">RASCUNHO</span>
        <span class="p-time mono">edit. {getTimeAgo(produto.updated_at)}</span>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger class="row-menu-btn">
            <EllipsisVertical size={15} />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end" class="w-44 bg-[#161619] border-zinc-800 text-zinc-300 rounded-lg shadow-xl p-1">
            <DropdownMenu.Item class="p-0">
              <button type="button" on:click={() => handleEditarProduto(produto)} class="menu-item">
                <Pencil size={13} /> Editar produto
              </button>
            </DropdownMenu.Item>
            <DropdownMenu.Item class="p-0">
              <button type="button" on:click={() => handleTogglePublicacao(produto.id, produto.published)} class="menu-item">
                <Eye size={13} /> Publicar
              </button>
            </DropdownMenu.Item>
            <DropdownMenu.Separator class="bg-zinc-800/60 my-1" />
            <DropdownMenu.Item class="p-0" variant="destructive">
              <button type="button" on:click={() => openDeleteModal(produto.id)} class="menu-item danger">
                <Trash2 size={13} /> Excluir
              </button>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    {/each}

  </div>
</div>

<!-- Modais -->
<ProductModal bind:isOpen={isModalOpen} bind:isEditing={isEditingMode} bind:formData={modalData} onSave={handleSaveModal} />
<DeleteModal isOpen={showDeleteModal} onClose={closeDeleteModal} onConfirm={handleExcluir}>{productToDeleteName}</DeleteModal>

<style>
  /* ── Admin content wrapper ── */
  .admin-content {
    padding: 22px 24px;
    flex: 1;
  }

  /* ── Panel ── */
  .panel {
    background: var(--bg-elev);
    border: 1px solid var(--line);
    border-radius: 10px;
    overflow: hidden;
  }

  .panel-head {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 20px;
    border-bottom: 1px solid var(--line);
  }

  .panel-head h3 {
    margin: 0;
    font-size: 13px;
    font-weight: 500;
    color: var(--text);
  }

  .grow { flex: 1; }

  .pill {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.06em;
    padding: 3px 8px;
    border-radius: 4px;
    border: 1px solid var(--line);
    color: var(--text-muted);
  }

  .pill.published {
    background: rgba(102, 223, 122, 0.12);
    color: var(--green);
    border-color: rgba(102, 223, 122, 0.25);
  }

  .pill.draft-pill {
    background: var(--bg-soft);
    color: var(--text-faint);
    border-color: var(--line);
  }

  /* ── Section labels ── */
  .section-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 20px;
    background: var(--bg-soft);
    border-bottom: 1px solid var(--line);
    font-family: var(--font-mono);
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-faint);
  }

  /* ── Product row ── */
  .product-row {
    display: grid;
    grid-template-columns: 36px 1fr 160px 100px 110px 32px;
    gap: 16px;
    align-items: center;
    padding: 13px 20px;
    border-bottom: 1px solid var(--line);
    cursor: default;
    transition: background 0.1s;
  }

  .product-row:last-of-type { border-bottom: 0; }
  .product-row:hover { background: var(--bg-soft); }
  .product-row.draft { opacity: 0.72; }
  .product-row.dragging { opacity: 0.2; }

  /* ── Product icon ── */
  .p-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 700;
    color: #fff;
    flex-shrink: 0;
  }
  .p-icon.img { object-fit: cover; }

  /* ── Product metadata ── */
  .p-meta {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .p-name {
    font-size: 13.5px;
    font-weight: 500;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .p-desc {
    font-size: 11.5px;
    color: var(--text-faint);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .p-cat {
    font-size: 11px;
    color: var(--text-muted);
  }

  .p-time {
    font-size: 11px;
    color: var(--text-faint);
    text-align: right;
  }

  .mono { font-family: var(--font-mono); }

  /* ── Row menu button ── */
  :global(.row-menu-btn) {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    background: transparent;
    border: 0;
    color: var(--text-faint);
    cursor: pointer;
    transition: background 0.12s, color 0.12s;
  }
  :global(.row-menu-btn:hover) {
    background: var(--bg-tint);
    color: var(--text);
  }

  /* ── Menu items ── */
  .menu-item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 7px 12px;
    font-size: 12px;
    font-family: inherit;
    background: transparent;
    border: 0;
    color: var(--text-muted);
    cursor: pointer;
    border-radius: 4px;
    text-align: left;
    transition: background 0.1s, color 0.1s;
  }
  .menu-item:hover { background: var(--bg-soft); color: var(--text); }
  .menu-item.danger { color: #f43f5e; }
  .menu-item.danger:hover { background: rgba(244, 63, 94, 0.1); color: #f43f5e; }

  /* ── Toast ── */
  .toast {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 100;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 18px;
    background: var(--bg-elev);
    border: 1px solid var(--line);
    border-radius: 10px;
    font-size: 13px;
    font-weight: 500;
    color: var(--text);
    box-shadow: var(--shadow-3);
  }
  .toast-icon { width: 16px; height: 16px; color: var(--green); flex-shrink: 0; }

  /* ── Processing overlay ── */
  .processing-overlay {
    position: fixed;
    inset: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(6, 6, 6, 0.5);
  }
  .processing-card {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 24px;
    background: var(--bg-elev);
    border: 1px solid var(--line);
    border-radius: 10px;
    font-size: 13px;
    color: var(--text);
  }

  .error-bar {
    padding: 10px 20px;
    font-size: 13px;
    color: #f87171;
    background: rgba(248, 113, 113, 0.08);
    border-bottom: 1px solid rgba(248, 113, 113, 0.2);
  }

  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner { width: 18px; height: 18px; animation: spin 0.8s linear infinite; }
</style>
