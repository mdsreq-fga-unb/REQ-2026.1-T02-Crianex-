<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Badge } from '$lib/components/ui/badge';
  import * as Card from '$lib/components/ui/card';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu'; // 1. Importado o Dropdown do Shadcn
  import type { PageData } from './$types';
  import {
    Search,
    Bell,
    EllipsisVertical,
    Plus,
    GripVertical,
    Pencil,
    EyeOff,
    Trash2,
    Eye,
  } from 'lucide-svelte';

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

  // Gatilho: Clicou em "+ Novo Produto"
  function handleNovoProduto() {
    isEditingMode = false;
    currentProductId = null;
    modalData = { ...emptyForm, slug: '' };
    isModalOpen = true;
  }

  // Gatilho: Clicou em "Editar" no Dropdown da linha do produto
  function handleEditarProduto(produto: any) {
    isEditingMode = true;
    currentProductId = produto.id;
    modalData = { ...produto }; // Copia os dados atuais para o modal
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

<div class="min-h-screen bg-[#0a0a0b] text-zinc-100 p-8 font-sans">
  {#if toastVisible}
    <div
      class="fixed bottom-6 right-6 z-100 flex items-center gap-3 rounded-xl border border-zinc-700/60 bg-[#161619] px-5 py-3 text-sm font-medium text-zinc-100 shadow-2xl transition-all"
      role="status"
      aria-live="polite"
    >
      <svg
        class="h-4 w-4 text-green-400 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2.5"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      {toastMessage}
    </div>
  {/if}
  {#if isProcessing}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        class="bg-[#0b0b0c] border border-zinc-800 rounded-lg px-6 py-4 flex items-center gap-4 shadow-lg"
      >
        <svg
          class="animate-spin h-5 w-5 text-cyan-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
          ></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
        <div class="text-sm text-zinc-200">{processingMessage || 'Processando...'}</div>
      </div>
    </div>
  {/if}
  <header class="flex justify-between items-center mb-8">
    <div>
      <h1 class="text-lg font-semibold flex items-center gap-2 tracking-tight">
        Produtos da vitrine
        <span class="text-zinc-500 text-xs font-normal">/ vitrine / produtos</span>
      </h1>
    </div>

    <div class="flex items-center gap-3">
      <div class="relative w-80">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <Input
          type="text"
          placeholder="Buscar clientes, tickets, produtos...   ⌘K"
          class="pl-9 h-9 bg-[#121214] border-zinc-800 text-zinc-300 placeholder:text-zinc-500 focus-visible:ring-zinc-700 text-xs rounded-lg"
        />
      </div>

      <Button
        variant="outline"
        size="icon"
        class="h-9 w-9 bg-transparent border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-full relative"
      >
        <Bell class="h-4 w-4" />
        <span class="absolute top-2 right-2.5 h-1.5 w-1.5 bg-white rounded-full"></span>
      </Button>

      <Button
        on:click={() => handleNovoProduto()}
        class="h-9 bg-white text-black hover:bg-zinc-200 font-medium text-xs rounded-lg px-4 flex items-center gap-2 whitespace-nowrap"
      >
        <Plus class="h-4 w-4" />
        <span>Novo produto</span>
      </Button>
    </div>
  </header>

  <Card.Root class="bg-[#121214] border-zinc-800/80 text-zinc-100 rounded-xl overflow-hidden">
    <Card.Header
      class="flex flex-row justify-between items-center border-b border-zinc-800/60 px-6 py-4"
    >
      <Card.Title class="text-xs font-medium text-zinc-300">
        {listaProdutos.length} produtos •
        <span class="text-zinc-400">{publicados.length} publicados</span>
      </Card.Title>

      <div class="flex items-center gap-3">
        <Badge
          variant="secondary"
          class="bg-[#1a1a1e] text-zinc-400 border border-zinc-800 font-mono text-[10px] tracking-wider px-2 py-0.5 rounded"
        >
          VITRINE.CRIANEX.COM
        </Badge>
        <Input
          type="text"
          placeholder="Buscar produto..."
          class="h-8 w-44 bg-[#1a1a1e] border-zinc-800 text-xs text-zinc-300 placeholder:text-zinc-500"
        />
      </div>
    </Card.Header>

    <Card.Content class="p-0">
      {#if data.error}
        <div class="p-4 text-center text-sm text-red-400 bg-red-950/20 border-b border-red-900/30">
          {data.error}
        </div>
      {/if}

      <div
        class="text-[10px] font-bold text-zinc-500 tracking-wider px-6 py-2 bg-[#161619]/40 border-b border-zinc-800/40 flex justify-between items-center"
      >
        <span>A PUBLICADOS · ARRASTE PARA REORDENAR A VITRINE</span>
        <span class="font-mono text-zinc-600">{publicados.length}</span>
      </div>

      {#each publicados as produto, index (produto.id)}
        <div
          class="flex items-center justify-between px-6 py-4 border-b border-zinc-800/40 hover:bg-zinc-900/30 transition-all duration-150 select-none"
          class:opacity-20={draggingIndex === index}
          role="listitem"
          draggable="true"
          on:dragstart={() => handleDragStart(index)}
          on:dragover|preventDefault={() => handleDragOver(index)}
          on:drop={handleDrop}
        >
          <div class="flex items-center gap-4 w-7/12">
            <GripVertical
              class="h-4 w-4 text-zinc-600 cursor-grab active:cursor-grabbing hover:text-zinc-400 transition-colors"
            />

            {#if produto.image_url}
              <img
                src={produto.image_url}
                alt="capa"
                class="h-9 w-9 shrink-0 rounded-lg object-cover shadow-inner"
              />
            {:else}
              <div
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white shadow-inner"
                style="background-color: {produto.color || '#6366f1'}"
              >
                {produto.icon_text || getInitials(produto.name_pt)}
              </div>
            {/if}
            <div class="min-w-0">
              <h3 class="font-medium text-zinc-200 text-sm tracking-tight">{produto.name_pt}</h3>
              <p class="text-xs text-zinc-500 truncate max-w-md mt-0.5">
                {produto.description_pt || 'Sem descrição em português.'}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-6 w-5/12 justify-end text-xs">
            <span class="text-zinc-400 font-medium text-right min-w-[120px] truncate"
              >{produto.category_pt || 'Geral'}</span
            >

            <span
              class="bg-[#12221a] text-[#4ade80] px-2 py-0.5 rounded text-[10px] font-bold tracking-wider border border-[#163524] shadow-sm"
            >
              PUBLICADO
            </span>

            <div class="flex items-center gap-4 text-zinc-500 text-xs whitespace-nowrap">
              <span>edit. {getTimeAgo(produto.updated_at)}</span>
              <span class="text-zinc-600 font-mono text-[10px]">PT · EN</span>
            </div>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button
                  variant="ghost"
                  size="icon"
                  class="h-8 w-8 text-zinc-500 hover:text-zinc-300 rounded-lg"
                >
                  <EllipsisVertical class="h-4 w-4" />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content
                align="end"
                class="w-44 bg-[#161619] border-zinc-800 text-zinc-300 rounded-lg shadow-xl p-1"
              >
                <DropdownMenu.Item class="p-0">
                  <button
                    type="button"
                    on:click={() => handleEditarProduto(produto)}
                    class="w-full flex items-center gap-2 px-3 py-2 text-xs rounded hover:bg-white hover:text-black cursor-pointer focus:bg-zinc-900 focus:text-white text-left"
                  >
                    <Pencil class="h-3.5 w-3.5 text-zinc-400" />
                    <span>Editar produto</span>
                  </button>
                </DropdownMenu.Item>
                <DropdownMenu.Item class="p-0">
                  <button
                    type="button"
                    on:click={() => handleTogglePublicacao(produto.id, produto.published)}
                    class="w-full flex items-center gap-2 px-3 py-2 text-xs rounded hover:bg-white hover:text-black cursor-pointer focus:bg-zinc-900 focus:text-white text-left"
                  >
                    <EyeOff class="h-3.5 w-3.5 text-zinc-400" />
                    <span>Despublicar</span>
                  </button>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
        </div>
      {/each}

      <!-- Product Modal -->
      <ProductModal
        bind:isOpen={isModalOpen}
        bind:isEditing={isEditingMode}
        bind:formData={modalData}
        onSave={handleSaveModal}
      />

      <div
        class="text-[10px] font-bold text-zinc-500 tracking-wider px-6 py-2 bg-[#161619]/40 border-b border-zinc-800/40 flex justify-between items-center mt-2"
      >
        <span>○ NÃO PUBLICADOS · NÃO APARECEM NA VITRINE PÚBLICA</span>
        <span class="font-mono text-zinc-600">{rascunhos.length}</span>
      </div>

      {#each rascunhos as produto (produto.id)}
        <div
          class="flex items-center justify-between px-6 py-4 border-b border-zinc-800/30 hover:bg-zinc-900/20 transition-all duration-150 opacity-75"
        >
          <div class="flex items-center gap-4 w-7/12 pl-8">
            {#if produto.image_url}
              <img
                src={produto.image_url}
                alt="capa"
                class="h-9 w-9 shrink-0 rounded-lg object-cover"
              />
            {:else}
              <div
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white/90"
                style="background-color: {produto.color || '#4b5563'}"
              >
                {produto.icon_text || getInitials(produto.name_pt)}
              </div>
            {/if}
            <div class="min-w-0">
              <h3 class="font-medium text-zinc-300 text-sm tracking-tight">{produto.name_pt}</h3>
              <p class="text-xs text-zinc-550 truncate max-w-md mt-0.5">
                {produto.description_pt || 'Sem descrição disponível.'}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-6 w-5/12 justify-end text-xs">
            <span class="text-zinc-500 text-right min-w-[120px] truncate"
              >{produto.category_pt || 'Geral'}</span
            >

            <span
              class="bg-[#27272a] text-zinc-400 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider border border-zinc-700/60 shadow-sm"
            >
              RASCUNHO
            </span>

            <div class="flex items-center gap-4 text-zinc-500 text-xs whitespace-nowrap">
              <span>edit. {getTimeAgo(produto.updated_at)}</span>
              <span class="text-zinc-600 font-mono text-[10px]">PT · EN</span>
            </div>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button
                  variant="ghost"
                  size="icon"
                  class="h-8 w-8 text-zinc-500 hover:text-zinc-300 rounded-lg"
                >
                  <EllipsisVertical class="h-4 w-4" />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content
                align="end"
                class="w-44 bg-[#161619] border-zinc-800 text-zinc-300 rounded-lg shadow-xl p-1"
              >
                <DropdownMenu.Item class="p-0">
                  <button
                    type="button"
                    on:click={() => handleEditarProduto(produto)}
                    class="w-full flex items-center gap-2 px-3 py-2 text-xs rounded hover:bg-white hover:text-black cursor-pointer focus:bg-zinc-900 focus:text-white text-left"
                  >
                    <Pencil class="h-3.5 w-3.5 text-zinc-400" />
                    <span>Editar produto</span>
                  </button>
                </DropdownMenu.Item>
                <DropdownMenu.Item class="p-0">
                  <button
                    type="button"
                    on:click={() => handleTogglePublicacao(produto.id, produto.published)}
                    class="w-full flex items-center gap-2 px-3 py-2 text-xs rounded hover:bg-white hover:text-black cursor-pointer focus:bg-zinc-900 focus:text-white text-left"
                  >
                    <Eye class="h-3.5 w-3.5 text-zinc-400" />
                    <span>Publicar</span>
                  </button>
                </DropdownMenu.Item>
                <DropdownMenu.Separator class="bg-zinc-800/60 my-1" />
                <DropdownMenu.Item class="p-0" variant="destructive">
                  <button
                    type="button"
                    on:click={() => openDeleteModal(produto.id)}
                    class="w-full flex items-center gap-2 px-3 py-2 text-xs rounded text-[#f43f5e] hover:bg-red-950/20 hover:text-[#f43f5e] cursor-pointer focus:bg-rose-950/20 focus:text-[#f43f5e] font-medium text-left"
                  >
                    <Trash2 class="h-3.5 w-3.5" />
                    <span>Excluir</span>
                  </button>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
        </div>
      {/each}

      <DeleteModal isOpen={showDeleteModal} onClose={closeDeleteModal} onConfirm={handleExcluir}
        >{productToDeleteName}</DeleteModal
      >
    </Card.Content>
  </Card.Root>
</div>
