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
  import { invalidateAll } from '$app/navigation';

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

  // Lógica das Ações do Menu
  function handleEditar(id: string) {
    console.log('Editar produto id:', id);
    // Aqui você pode redirecionar ex: goto(`/admin/produtos/${id}`)
  }

  async function handleTogglePublicacao(id: string, currentStatus: boolean) {
    console.log('Mudar status do id:', id, 'para:', !currentStatus);
    try {
      console.debug('[client] about to call apiFetch for', id, '->', !currentStatus);
      const res = await apiFetch(`/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !currentStatus }),
      });
      console.debug('[client] apiFetch returned', res);

      await invalidateAll();
    } catch (error) {
      console.error('Erro ao altera status de publicação:', error);
    }
  }

  async function handleExcluir(id: string) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    console.log('Deletar produto id:', id);
    // Disparar o DELETE /admin/products/:id
  }
</script>

<div class="min-h-screen bg-[#0a0a0b] text-zinc-100 p-8 font-sans">
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

      <Button class="h-9 bg-white text-black hover:bg-zinc-200 font-medium text-xs rounded-lg px-4">
        <Plus class="h-4 w-4 mr-1.5" /> Novo produto
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

            <div
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white shadow-inner"
              style="background-color: {produto.color || '#6366f1'}"
            >
              {produto.icon_text || getInitials(produto.name_pt)}
            </div>
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
              <span>edit. há {produto.days_ago || '2 dias'}</span>
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
                    on:click={() => handleEditar(produto.id)}
                    class="w-full flex items-center gap-2 px-3 py-2 text-xs rounded hover:bg-zinc-900 cursor-pointer focus:bg-zinc-900 focus:text-white text-left"
                  >
                    <Pencil class="h-3.5 w-3.5 text-zinc-400" />
                    <span>Editar produto</span>
                  </button>
                </DropdownMenu.Item>
                <DropdownMenu.Item class="p-0">
                  <button
                    type="button"
                    on:click={() => handleTogglePublicacao(produto.id, produto.published)}
                    class="w-full flex items-center gap-2 px-3 py-2 text-xs rounded hover:bg-zinc-900 cursor-pointer focus:bg-zinc-900 focus:text-white text-left"
                  >
                    <EyeOff class="h-3.5 w-3.5 text-zinc-400" />
                    <span>Despublicar</span>
                  </button>
                </DropdownMenu.Item>
                <DropdownMenu.Separator class="bg-zinc-800/60 my-1" />
                <DropdownMenu.Item class="p-0">
                  <button
                    type="button"
                    on:click={() => handleExcluir(produto.id)}
                    class="w-full flex items-center gap-2 px-3 py-2 text-xs rounded text-[#f43f5e] hover:bg-rose-950/20 cursor-pointer focus:bg-rose-950/20 focus:text-[#f43f5e] font-medium text-left"
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
            <div
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white/90"
              style="background-color: {produto.color || '#4b5563'}"
            >
              {produto.icon_text || getInitials(produto.name_pt)}
            </div>
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
              <span>edit. há {produto.days_ago || '5 dias'}</span>
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
                    on:click={() => handleEditar(produto.id)}
                    class="w-full flex items-center gap-2 px-3 py-2 text-xs rounded hover:bg-zinc-900 cursor-pointer focus:bg-zinc-900 focus:text-white text-left"
                  >
                    <Pencil class="h-3.5 w-3.5 text-zinc-400" />
                    <span>Editar produto</span>
                  </button>
                </DropdownMenu.Item>
                <DropdownMenu.Item class="p-0">
                  <button
                    type="button"
                    on:click={() => handleTogglePublicacao(produto.id, produto.published)}
                    class="w-full flex items-center gap-2 px-3 py-2 text-xs rounded hover:bg-zinc-900 cursor-pointer focus:bg-zinc-900 focus:text-white text-left"
                  >
                    <Eye class="h-3.5 w-3.5 text-zinc-400" />
                    <span>Publicar</span>
                  </button>
                </DropdownMenu.Item>
                <DropdownMenu.Separator class="bg-zinc-800/60 my-1" />
                <DropdownMenu.Item class="p-0">
                  <button
                    type="button"
                    on:click={() => handleExcluir(produto.id)}
                    class="w-full flex items-center gap-2 px-3 py-2 text-xs rounded text-[#f43f5e] hover:bg-rose-950/20 cursor-pointer focus:bg-rose-950/20 focus:text-[#f43f5e] font-medium text-left"
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
    </Card.Content>
  </Card.Root>
</div>
