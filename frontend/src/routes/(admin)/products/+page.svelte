<script lang="ts">
  // 1. Importando os componentes do Shadcn que você acabou de baixar
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Badge } from '$lib/components/ui/badge';
  import * as Card from '$lib/components/ui/card';
  import type { PageData } from './$types';
  import { Search, Bell, EllipsisVertical, Plus, GripVertical } from 'lucide-svelte';
  import { apiFetch } from '$lib/api/backend';

  export let data: PageData;

  $: listaProdutos = data.produtos ?? [];

  let draggingIndex: number | null = null;

  function handleDragStart(index: number) {
    draggingIndex = index;
  }

  function handleDragOver(index: number) {
    if (draggingIndex === null || draggingIndex === index) return;

    const updatedItem = [...listaProdutos];

    const [itemArrastado] = updatedItem.splice(draggingIndex, 1);
    updatedItem.splice(index, 0, itemArrastado);

    draggingIndex = index;
    listaProdutos = updatedItem;
  }

  async function handleDrop() {
    draggingIndex = null;

    const newOrder = listaProdutos.map((produto, index) => ({
      id: produto.id,
      display_order: index + 1,
    }));

    try {
      // Usando o seu centralizador com método POST e o corpo em JSON
      await apiFetch('/products/reorder', {
        method: 'POST',
        body: JSON.stringify({ orders: newOrder }),
      });

      console.log('Nova ordem salva com sucesso através do apiFetch!');
    } catch (error) {
      console.error('Erro ao conectar com back-end para reordenar:', error);
      alert('Erro ao salvar a nova ordenação no banco.');
    }
  }
</script>

<div class="min-h-screen bg-[#0a0a0b] text-zinc-100 p-8 font-sans">
  <header class="flex justify-between items-center mb-8">
    <div>
      <h1 class="text-xl font-bold flex items-center gap-2">
        Produtos da vitrine
        <span class="text-zinc-500 text-sm font-normal">/ vitrine / produtos</span>
      </h1>
    </div>

    <div class="flex items-center gap-4">
      <div class="relative w-64">
        <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
        <Input
          type="text"
          placeholder="Buscar clientes, tickets, produtos..."
          class="pl-9 bg-[#121214] border-zinc-800 text-zinc-300 placeholder:text-zinc-500 focus-visible:ring-zinc-700"
        />
      </div>

      <Button
        variant="outline"
        size="icon"
        class="bg-transparent border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900"
      >
        <Bell class="h-4 w-4" />
      </Button>

      <Button class="bg-white text-black hover:bg-zinc-200 font-medium">
        <Plus class="h-4 w-4 mr-1.5" /> Novo produto
      </Button>
    </div>
  </header>

  <Card.Root class="bg-[#121214] border-zinc-800 text-zinc-100">
    <Card.Header
      class="flex flex-row justify-between items-center border-b border-zinc-800/50 pb-4"
    >
      <Card.Title class="text-sm font-medium text-zinc-400"
        >{listaProdutos.length} produtos publicados</Card.Title
      >
      <Badge
        variant="secondary"
        class="bg-zinc-900 text-zinc-400 border border-zinc-800 font-mono text-[10px]"
        >VITRINE.CRIANEX.COM</Badge
      >
    </Card.Header>

    <Card.Content class="p-0">
      {#if data.error}
        <div class="p-4 text-center text-sm text-red-400">{data.error}</div>
      {/if}

      {#each listaProdutos as produto, index (produto.id)}
        <div
          class="flex items-center justify-between p-4 border-b border-zinc-800/50 hover:bg-zinc-900/40 transition-all duration-150 select-none"
          class:opacity-40={draggingIndex === index}
          role="listitem"
          draggable="true"
          on:dragstart={() => handleDragStart(index)}
          on:dragover|preventDefault={() => handleDragOver(index)}
          on:drop={handleDrop}
        >
          <div class="flex items-center gap-4 w-7/12">
            <GripVertical class="h-4 w-4 text-zinc-600 cursor-grab active:cursor-grabbing" />

            <div
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
              style="background-color: {produto.color || '#6366f1'}"
            >
              {produto.icon_text || 'PR'}
            </div>
            <div class="min-w-0">
              <h3 class="font-semibold text-zinc-100 text-sm">{produto.name_pt}</h3>
              <p class="text-sm text-zinc-400 truncate pr-4">{produto.description_pt || ''}</p>
            </div>
          </div>

          <div class="flex items-center gap-8 w-5/12 justify-end text-xs">
            <span class="text-zinc-400 w-44 truncate text-right"
              >{produto.category_pt || 'Geral'}</span
            >

            <span
              class="bg-[#14241c] text-[#4ade80] px-2 py-0.5 rounded text-[10px] font-bold tracking-wider border border-[#1b3827]"
            >
              {produto.published ? 'PUBLICADO' : 'RASCUNHO'}
            </span>

            <button class="text-zinc-500 hover:text-zinc-300 px-1">
              <EllipsisVertical class="h-4 w-4" />
            </button>
          </div>
        </div>
      {/each}
    </Card.Content>
  </Card.Root>
</div>
