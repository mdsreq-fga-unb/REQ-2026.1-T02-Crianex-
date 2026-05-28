<script lang="ts">
  import {
    Search,
    Bell,
    EllipsisVertical,
    GripVertical,
    Pencil,
    EyeOff,
    Eye,
    X,
  } from 'lucide-svelte';
  import { apiFetch } from '$lib/api/backend';
  import { invalidateAll } from '$app/navigation';
  import type { PageData } from './$types';

  export let data: PageData;

  type Produto = NonNullable<PageData['produtos']>[number];

  // ── List state ───────────────────────────────────────────────────────────
  let search = '';
  let menuOpen: string | null = null;
  let dragId: string | null = null;
  let dropTarget: { id: string; after: boolean } | null = null;
  let originalOrder: Produto[] = [];
  let listaProdutos: Produto[] = [];
  let deleting: Produto | null = null;

  $: if (data.produtos) {
    listaProdutos = [...data.produtos].sort(
      (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
    );
  }

  $: publicados = listaProdutos.filter((p) => p.published).filter(filterFn);
  $: rascunhos = listaProdutos.filter((p) => !p.published).filter(filterFn);

  function filterFn(p: Produto) {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.name_pt.toLowerCase().includes(q) ||
      (p.category_pt ?? '').toLowerCase().includes(q) ||
      (p.tagline_pt ?? '').toLowerCase().includes(q)
    );
  }

  // ── Drag-and-drop ─────────────────────────────────────────────────────────
  function handleDragStart(id: string) {
    dragId = id;
    originalOrder = [...listaProdutos];
  }

  function handleDragOver(e: DragEvent, targetId: string) {
    if (!dragId || dragId === targetId) return;
    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    dropTarget = { id: targetId, after: e.clientY > rect.top + rect.height / 2 };
  }

  function handleDragLeave() {
    dropTarget = null;
  }
  function handleDragEnd() {
    dragId = null;
    dropTarget = null;
  }

  async function handleDrop(e: DragEvent, targetId: string) {
    e.preventDefault();
    if (!dragId || dragId === targetId) {
      dragId = null;
      dropTarget = null;
      return;
    }
    const after = dropTarget?.after;
    const next = [...listaProdutos];
    const fromIdx = next.findIndex((p) => p.id === dragId);
    if (fromIdx >= 0) {
      const [moved] = next.splice(fromIdx, 1);
      const toIdx = next.findIndex((p) => p.id === targetId);
      next.splice(toIdx + (after ? 1 : 0), 0, moved);
    }

    const newOrder = next
      .filter((p) => p.published)
      .map((p, i) => ({ id: p.id, display_order: i + 1 }));

    listaProdutos = next;
    dragId = null;
    dropTarget = null;

    try {
      await apiFetch('/products/reorder', {
        method: 'PATCH',
        body: JSON.stringify({ orders: newOrder }),
      });
      await invalidateAll();
    } catch {
      listaProdutos = [...originalOrder];
    }
  }

  // ── Actions ───────────────────────────────────────────────────────────────
  async function handleTogglePublicacao(id: string, current: boolean) {
    try {
      await apiFetch(`/products/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ published: !current }),
      });
      await invalidateAll();
    } catch (err) {
      console.error('Erro ao alterar publicação:', err);
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

  function formatDate(iso: string | null | undefined) {
    if (!iso) return '—';
    const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
    if (diff === 0) return 'hoje';
    if (diff === 1) return 'há 1 dia';
    return `há ${diff} dias`;
  }
</script>

<!-- ── Topbar ─────────────────────────────────────────────────────────────── -->
<div class="admin-topbar">
  <h2>Produtos da vitrine</h2>
  <span class="crumbs">/ vitrine / produtos</span>
  <span class="grow"></span>
  <div class="admin-search">
    <Search size={14} />
    <input placeholder="Buscar clientes, tickets, produtos…" aria-label="Busca global" />
    <span
      style="font-family: var(--font-mono); font-size: 10px; padding: 2px 6px; border: 1px solid var(--line); border-radius: 4px"
      >⌘K</span
    >
  </div>
  <span class="bell-wrap">
    <button class="btn sm ghost" type="button" aria-label="Notificações" style="padding: 6px 10px">
      <Bell size={14} />
    </button>
    <span class="badge-dot"></span>
  </span>
  <button class="btn sm" type="button">+ Novo produto</button>
</div>

<!-- ── Content ────────────────────────────────────────────────────────────── -->
<div class="admin-content">
  <div class="panel" style="padding: 14px">
    <div class="panel-head" style="margin-bottom: 4px">
      <h3>{listaProdutos.length} produtos · {publicados.length} publicados</h3>
      <span class="grow"></span>
      <span class="pill">vitrine.crianex.com</span>
      <div class="admin-search" style="width: 220px">
        <Search size={13} />
        <input placeholder="Buscar produto…" bind:value={search} aria-label="Filtrar produtos" />
      </div>
    </div>

    {#if data.error}
      <p style="color: var(--pink); font-size: 13px; padding: 8px 0">{data.error}</p>
    {/if}

    <!-- Publicados -->
    <div class="list-divider">
      <span>✓ Publicados</span>
      <span class="ct">arraste para reordenar a vitrine</span>
      <span class="ln"></span>
      <span class="ct">{publicados.length}</span>
    </div>

    {#if publicados.length === 0}
      <div class="empty">Nenhum produto publicado.</div>
    {/if}

    {#each publicados as p (p.id)}
      <div
        role="listitem"
        draggable="true"
        on:dragstart={() => handleDragStart(p.id)}
        on:dragover|preventDefault={(e) => handleDragOver(e, p.id)}
        on:dragleave={handleDragLeave}
        on:drop={(e) => handleDrop(e, p.id)}
        on:dragend={handleDragEnd}
        class="product-row dnd-row"
        class:dragging={dragId === p.id}
        class:drop-after={dropTarget?.id === p.id && !!dropTarget?.after}
        class:drop-before={dropTarget?.id === p.id && !dropTarget?.after}
      >
        <button class="dnd-handle" type="button" aria-label="Arrastar para reordenar">
          <GripVertical size={12} />
        </button>

        <span
          class="pico"
          style:background={(p as any).color || '#7f3fe5'}
          style:background-image={p.image_url ? `url(${p.image_url})` : 'none'}
          style:background-size="cover"
          style:background-position="center"
        >
          {#if !p.image_url}{p.icon_text || getInitials(p.name_pt)}{/if}
        </span>

        <div>
          <div class="pname">{p.name_pt}</div>
          <div class="psub">{p.tagline_pt || p.description_pt || ''}</div>
        </div>

        <span class="pcat">{p.category_pt || ''}</span>

        <span>
          <span class="status-pill paid"><span class="dt"></span>publicado</span>
        </span>

        <span class="pdate">edit. {formatDate(p.updated_at)}</span>

        <span style="font-family: var(--font-mono); font-size: 10.5px; color: var(--text-faint)">
          PT · EN
        </span>

        <div style="position: relative">
          <button
            class="menu-btn"
            type="button"
            aria-label="Ações do produto"
            on:click={() => (menuOpen = menuOpen === p.id ? null : p.id)}
          >
            <EllipsisVertical size={14} />
          </button>
          {#if menuOpen === p.id}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div
              style="position: fixed; inset: 0; z-index: 30"
              on:click={() => (menuOpen = null)}
            ></div>
            <div class="row-menu-pop">
              <button type="button" on:click={() => (menuOpen = null)}>
                <Pencil size={13} /> Editar produto
              </button>
              <button
                type="button"
                on:click={() => {
                  handleTogglePublicacao(p.id, p.published);
                  menuOpen = null;
                }}
              >
                <EyeOff size={13} /> Despublicar
              </button>
              <div class="sep"></div>
              <button
                type="button"
                class="danger"
                on:click={() => {
                  deleting = p;
                  menuOpen = null;
                }}
              >
                <X size={13} /> Excluir
              </button>
            </div>
          {/if}
        </div>
      </div>
    {/each}

    <!-- Não publicados -->
    <div class="list-divider">
      <span>○ Não publicados</span>
      <span class="ct">não aparecem na vitrine pública</span>
      <span class="ln"></span>
      <span class="ct">{rascunhos.length}</span>
    </div>

    {#if rascunhos.length === 0}
      <div class="empty">Todos os produtos estão publicados.</div>
    {/if}

    {#each rascunhos as p (p.id)}
      <div class="product-row unpub">
        <span></span>

        <span
          class="pico"
          style:background={(p as any).color || '#7f3fe5'}
          style:background-image={p.image_url ? `url(${p.image_url})` : 'none'}
          style:background-size="cover"
          style:background-position="center"
        >
          {#if !p.image_url}{p.icon_text || getInitials(p.name_pt)}{/if}
        </span>

        <div>
          <div class="pname">{p.name_pt}</div>
          <div class="psub">{p.tagline_pt || p.description_pt || ''}</div>
        </div>

        <span class="pcat">{p.category_pt || ''}</span>

        <span>
          <span class="status-pill inactive"><span class="dt"></span>rascunho</span>
        </span>

        <span class="pdate">edit. {formatDate(p.updated_at)}</span>

        <span style="font-family: var(--font-mono); font-size: 10.5px; color: var(--text-faint)">
          PT · EN
        </span>

        <div style="position: relative">
          <button
            class="menu-btn"
            type="button"
            aria-label="Ações do produto"
            on:click={() => (menuOpen = menuOpen === p.id ? null : p.id)}
          >
            <EllipsisVertical size={14} />
          </button>
          {#if menuOpen === p.id}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div
              style="position: fixed; inset: 0; z-index: 30"
              on:click={() => (menuOpen = null)}
            ></div>
            <div class="row-menu-pop">
              <button type="button" on:click={() => (menuOpen = null)}>
                <Pencil size={13} /> Editar produto
              </button>
              <button
                type="button"
                on:click={() => {
                  handleTogglePublicacao(p.id, p.published);
                  menuOpen = null;
                }}
              >
                <Eye size={13} /> Publicar agora
              </button>
              <div class="sep"></div>
              <button
                type="button"
                class="danger"
                on:click={() => {
                  deleting = p;
                  menuOpen = null;
                }}
              >
                <X size={13} /> Excluir
              </button>
            </div>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</div>

<!-- ── DeleteConfirm Modal ─────────────────────────────────────────────────── -->
{#if deleting}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="admin-overlay" on:click={() => (deleting = null)}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="admin-modal" style="max-width: 460px" on:click|stopPropagation tabindex="-1">
      <div class="admin-modal-body danger-modal">
        <div class="danger-icon"><X size={24} /></div>
        <h4>Excluir produto?</h4>
        <p>
          Esta ação remove o produto da vitrine pública imediatamente e exclui suas informações
          localizadas (PT/EN). Não pode ser desfeita.
        </p>
        <div class="name-confirm">
          <span class="lbl">Item:</span>
          <span class="val">{deleting.name_pt}</span>
        </div>
      </div>

      <div class="admin-modal-foot">
        <button class="btn ghost sm" type="button" on:click={() => (deleting = null)}
          >Cancelar</button
        >
        <button class="btn-danger" type="button">
          <X size={13} /> Excluir definitivamente
        </button>
      </div>
    </div>
  </div>
{/if}
