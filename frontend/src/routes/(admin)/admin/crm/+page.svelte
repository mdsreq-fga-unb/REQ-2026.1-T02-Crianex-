<script lang="ts">
  import { Settings, X, Check, MoreVertical, Plus } from 'lucide-svelte';
  import { apiFetch } from '$lib/api/backend';
  import { onMount } from 'svelte';
  import ClientCard from './ClientCard.svelte';
  import ClientDrawer from './ClientDrawer.svelte';
  import NewLeadModal from './NewLeadModal.svelte';

  type CrmColumn = {
    id: string;
    title: string;
    color: string;
    position: number;
    is_default: boolean;
    entry_hint: string | null;
    exit_hint: string | null;
    created_at: string;
    updated_at: string;
  };

  export type CrmClient = {
    id: string;
    name: string;
    email: string;
    status: 'ativo' | 'inativo';
    column_id: string | null;
    responsible_name: string | null;
    product_name: string | null;
    interaction_count: number;
    last_interaction: string | null;
  };

  const COL_COLORS = [
    '#7f3fe5',
    '#e71f84',
    '#66df7a',
    '#3b82f6',
    '#f59e0b',
    '#06b6d4',
    '#ec4899',
    '#9a968e',
  ];

  let { data } = $props<{
    data: {
      columns: CrmColumn[];
      error?: string;
      forbidden?: boolean;
      adminUser?: { name: string };
    };
  }>();

  // ── State ──
  let columns = $state<CrmColumn[]>([]);
  let colsLoading = $state(false);
  let colsError = $state('');
  let editingCols = $state(false);

  let clients = $state<CrmClient[]>([]);
  let activeClient = $state<CrmClient | null>(null);
  let showNewLeadModal = $state(false);
  let addLeadColumnId = $state('');

  // Column editor state
  let editCols = $state<(CrmColumn & { _new?: boolean })[]>([]);
  let colDragId = $state<string | null>(null);
  let colDropTarget = $state<{ id: string; after: boolean } | null>(null);
  let colSaving = $state(false);
  let invalidColIds = $state<Set<string>>(new Set());

  // Single-column quick editor (opened from the card's gear button)
  let quickCol = $state<CrmColumn | null>(null);
  let quickSaving = $state(false);
  let quickError = $state('');

  $effect(() => {
    if (data.columns?.length) {
      columns = [...data.columns].sort((a, b) => a.position - b.position);
    }
  });

  // ── Column editor ──
  function openEditor() {
    editCols = columns.map((c) => ({ ...c }));
    editingCols = true;
  }
  function editorUpd(id: string, patch: Partial<CrmColumn>) {
    editCols = editCols.map((c) => (c.id === id ? { ...c, ...patch } : c));
  }
  function editorAdd() {
    editCols = [
      ...editCols,
      {
        id: `col-${Date.now()}`,
        title: 'Nova coluna',
        color: COL_COLORS[editCols.length % COL_COLORS.length],
        position: editCols.length,
        is_default: false,
        entry_hint: '',
        exit_hint: '',
        created_at: '',
        updated_at: '',
        _new: true,
      },
    ];
  }
  function editorDel(id: string) {
    if (editCols.length <= 1) return;
    if (editCols.find((c) => c.id === id)?.is_default) return;
    editCols = editCols.filter((c) => c.id !== id);
  }
  function editorDrop(targetId: string) {
    if (!colDragId || colDragId === targetId) {
      colDragId = null;
      colDropTarget = null;
      return;
    }
    const next = [...editCols];
    const from = next.findIndex((c) => c.id === colDragId);
    const [moved] = next.splice(from, 1);
    let to = next.findIndex((c) => c.id === targetId);
    if (colDropTarget?.after) to += 1;
    next.splice(to, 0, moved);
    editCols = next;
    colDragId = null;
    colDropTarget = null;
  }

  // ── Single-column quick editor (gear button on the card) ──
  function openQuickEditor(col: CrmColumn) {
    quickCol = { ...col };
    quickError = '';
  }
  function closeQuickEditor() {
    quickCol = null;
    quickError = '';
  }
  async function saveQuickColumn() {
    if (!quickCol) return;
    if (!quickCol.title.trim()) {
      quickError = 'Informe um nome para a coluna.';
      return;
    }
    quickSaving = true;
    quickError = '';
    try {
      const updated = await apiFetch<CrmColumn>(`/admin/crm/columns/${quickCol.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: quickCol.title,
          color: quickCol.color,
          entry_hint: quickCol.entry_hint,
          exit_hint: quickCol.exit_hint,
        }),
      });
      columns = columns
        .map((c) => (c.id === updated.id ? updated : c))
        .sort((a, b) => a.position - b.position);
      quickCol = null;
    } catch (err) {
      const e = err as { status?: number; message?: string };
      quickError = e.message || 'Erro ao salvar coluna.';
    } finally {
      quickSaving = false;
    }
  }
  async function deleteQuickColumn() {
    if (!quickCol || quickCol.is_default) return;
    quickSaving = true;
    quickError = '';
    try {
      await apiFetch<void>(`/admin/crm/columns/${quickCol.id}`, { method: 'DELETE' });
      columns = columns.filter((c) => c.id !== quickCol!.id);
      quickCol = null;
    } catch (err) {
      const e = err as { status?: number; message?: string };
      quickError =
        e.status === 409
          ? e.message ||
            'Não é possível remover esta coluna. Verifique se há leads vinculados ou se é a coluna padrão.'
          : e.message || 'Erro ao remover coluna.';
    } finally {
      quickSaving = false;
    }
  }

  async function saveColumns() {
    const empty = editCols.filter((c) => !c.title.trim());
    if (empty.length) {
      invalidColIds = new Set(empty.map((c) => c.id));
      colsError = 'Toda coluna precisa de um nome. Preencha os campos destacados.';
      return;
    }
    invalidColIds = new Set();
    colSaving = true;
    colsError = '';
    try {
      const originalIds = new Set(columns.map((c) => c.id));
      const newIds = new Set(editCols.map((c) => c.id));

      // Delete removed columns
      for (const col of columns.filter((c) => !newIds.has(c.id))) {
        await apiFetch<void>(`/admin/crm/columns/${col.id}`, { method: 'DELETE' });
      }

      // Create new / update existing
      const saved: CrmColumn[] = [];
      for (let i = 0; i < editCols.length; i++) {
        const col = editCols[i]!;
        const pos = i;
        if (!originalIds.has(col.id)) {
          const created = await apiFetch<CrmColumn>('/admin/crm/columns', {
            method: 'POST',
            body: JSON.stringify({
              title: col.title,
              color: col.color,
              position: pos,
              entry_hint: col.entry_hint,
              exit_hint: col.exit_hint,
            }),
          });
          saved.push(created);
        } else {
          const orig = columns.find((c) => c.id === col.id)!;
          const changed =
            col.title !== orig.title ||
            col.color !== orig.color ||
            col.entry_hint !== orig.entry_hint ||
            col.exit_hint !== orig.exit_hint ||
            pos !== orig.position;
          if (changed) {
            const updated = await apiFetch<CrmColumn>(`/admin/crm/columns/${col.id}`, {
              method: 'PATCH',
              body: JSON.stringify({
                title: col.title,
                color: col.color,
                position: pos,
                entry_hint: col.entry_hint,
                exit_hint: col.exit_hint,
              }),
            });
            saved.push(updated);
          } else {
            saved.push({ ...col, position: pos });
          }
        }
      }

      columns = saved.sort((a, b) => a.position - b.position);
      editingCols = false;
    } catch (err) {
      const e = err as { status?: number; message?: string };
      colsError =
        e.status === 409
          ? e.message ||
            'Não é possível remover esta coluna. Verifique se há leads vinculados ou se é a coluna padrão.'
          : e.message || 'Erro ao salvar colunas.';
    } finally {
      colSaving = false;
    }
  }

  function openAddLead(colId: string) {
    addLeadColumnId = colId;
    showNewLeadModal = true;
  }

  onMount(async () => {
    try {
      colsLoading = true;
      const [freshCols, freshClients] = await Promise.all([
        apiFetch<CrmColumn[]>('/admin/crm/columns'),
        apiFetch<CrmClient[]>('/admin/crm/clients'),
      ]);
      if (freshCols?.length) columns = freshCols.sort((a, b) => a.position - b.position);
      if (freshClients?.length) clients = freshClients;
    } catch {
      /* keep server-loaded data */
    } finally {
      colsLoading = false;
    }
  });
</script>

<div class="crm-root">
  <!-- ── Header ── -->
  <div class="crm-head">
    <span class="crm-title">Pipeline de Leads</span>
    <span class="crm-crumb">/ {columns.length} {columns.length === 1 ? 'coluna' : 'colunas'}</span>
    <span class="grow"></span>
    <button class="btn sm" onclick={openEditor}>
      <Settings size={13} /> Personalizar colunas
    </button>
  </div>

  <div class="crm-body">
    {#if colsLoading}
      <div class="crm-loading">Carregando colunas…</div>
    {:else if data.forbidden}
      <div class="crm-empty-state">
        <div class="ico"><Settings size={18} /></div>
        Acesso restrito — apenas administradores podem gerenciar o CRM.
      </div>
    {:else if columns.length === 0}
      <div class="crm-empty-state">
        <div class="ico"><Settings size={18} /></div>
        Nenhuma coluna configurada.
        <button class="btn sm" style="margin-top:12px" onclick={openEditor}>
          <Plus size={13} /> Configurar pipeline
        </button>
      </div>
    {:else}
      <div class="crm-kanban">
        {#each columns as col (col.id)}
          {@const colClients = clients.filter((c) => c.column_id === col.id)}
          <div class="crm-col" role="region" aria-label={col.title}>
            <div class="crm-col-head">
              <span class="dot" style="background:{col.color}"></span>
              <span class="title">{col.title}</span>
              {#if col.is_default}<span class="default-badge">padrão</span>{/if}
              <span class="ct">{colClients.length}</span>
              <button class="gear" title="Editar coluna" onclick={() => openQuickEditor(col)}>
                <Settings size={12} />
              </button>
            </div>

            {#if colClients.length === 0}
              <div class="crm-col-empty">
                <span>Nenhum lead</span>
                <button
                  class="crm-addcard"
                  style="margin-top: 12px; padding: 12px;"
                  onclick={() => openAddLead(col.id)}
                >
                  + adicionar
                </button>
              </div>
            {:else}
              <div class="crm-col-body">
                {#each colClients as client (client.id)}
                  <ClientCard {client} onclick={() => (activeClient = client)} />
                {/each}
                <button
                  class="crm-addcard"
                  style="padding:12px; margin-top: 4px;"
                  onclick={() => openAddLead(col.id)}
                >
                  + adicionar
                </button>
              </div>
            {/if}
          </div>
        {/each}
        <button class="crm-addcol" onclick={openEditor} title="Adicionar coluna"> + COLUNA </button>
      </div>
    {/if}
  </div>
</div>

<!-- ── Column Editor Modal ── -->
{#if editingCols}
  <div class="admin-overlay" role="presentation" onclick={() => (editingCols = false)}>
    <div
      class="admin-modal wide"
      role="dialog"
      aria-modal="true"
      aria-label="Editar colunas do pipeline"
      tabindex="-1"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.key === 'Escape' && (editingCols = false)}
    >
      <div class="admin-modal-head">
        <h3>Editar colunas do pipeline</h3>
        <span class="crumbs">/ crm / colunas</span>
        <button class="x" onclick={() => (editingCols = false)}><X size={13} /></button>
      </div>
      <div class="admin-modal-body">
        {#if colsError}
          <div class="crm-err-banner">{colsError}</div>
        {/if}
        <div class="crm-coleditor" role="list" ondragover={(e) => e.preventDefault()}>
          {#each editCols as c (c.id)}
            <div
              class="crm-colrow {colDragId === c.id ? 'dragging' : ''} {colDropTarget?.id === c.id
                ? colDropTarget?.after
                  ? 'drop-after'
                  : 'drop-before'
                : ''}"
              role="listitem"
              ondragover={(e) => {
                e.preventDefault();
                if (colDragId && colDragId !== c.id) {
                  const r = e.currentTarget.getBoundingClientRect();
                  colDropTarget = { id: c.id, after: e.clientY > r.top + r.height / 2 };
                }
              }}
              ondrop={(e) => {
                e.preventDefault();
                editorDrop(c.id);
              }}
            >
              <div class="r1">
                <span
                  class="handle"
                  role="button"
                  tabindex="0"
                  draggable="true"
                  ondragstart={() => (colDragId = c.id)}
                  ondragend={() => {
                    colDragId = null;
                    colDropTarget = null;
                  }}
                  title="arraste para reordenar"
                >
                  <MoreVertical size={13} /><MoreVertical size={13} style="margin-left:-9px" />
                </span>
                <input
                  class="cname {invalidColIds.has(c.id) ? 'invalid' : ''}"
                  bind:value={c.title}
                  oninput={() => {
                    if (c.title.trim() && invalidColIds.has(c.id)) {
                      invalidColIds = new Set([...invalidColIds].filter((id) => id !== c.id));
                    }
                  }}
                />
                <div class="crm-swatches">
                  {#each COL_COLORS as col}
                    <button
                      type="button"
                      class="crm-swatch {c.color === col ? 'on' : ''}"
                      style="background:{col}"
                      aria-label="Usar cor {col}"
                      onclick={() => editorUpd(c.id, { color: col })}
                    ></button>
                  {/each}
                </div>
                {#if c.is_default}
                  <span class="default-badge">padrão</span>
                {/if}
                <button
                  class="del"
                  onclick={() => editorDel(c.id)}
                  title="Excluir coluna"
                  disabled={editCols.length <= 1 || c.is_default}
                >
                  <X size={14} />
                </button>
              </div>
              <div class="crit">
                <div class="f">
                  <label for="entry-hint-{c.id}">Critério de entrada</label>
                  <textarea
                    id="entry-hint-{c.id}"
                    bind:value={c.entry_hint}
                    placeholder="Quando um lead entra nesta coluna?"
                  ></textarea>
                </div>
                <div class="f">
                  <label for="exit-hint-{c.id}">Critério de saída</label>
                  <textarea
                    id="exit-hint-{c.id}"
                    bind:value={c.exit_hint}
                    placeholder="Quando um lead sai desta coluna?"
                  ></textarea>
                </div>
              </div>
            </div>
          {/each}
          <button class="crm-addcard" style="padding:12px" onclick={editorAdd}>
            + adicionar coluna
          </button>
        </div>
      </div>
      <div class="admin-modal-foot">
        <span
          class="mono"
          style="font-size:10.5px;color:var(--text-faint);letter-spacing:0.06em;text-transform:uppercase;margin-right:auto"
        >
          arraste pelo ⠿ para reordenar
        </span>
        <button class="btn ghost sm" onclick={() => (editingCols = false)} disabled={colSaving}
          >Cancelar</button
        >
        <button class="btn sm" onclick={saveColumns} disabled={colSaving}>
          {#if colSaving}Salvando…{:else}Salvar pipeline <Check size={12} />{/if}
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- ── Quick column editor (gear button on the card) ── -->
{#if quickCol}
  <div class="admin-overlay" role="presentation" onclick={closeQuickEditor}>
    <div
      class="admin-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Editar coluna"
      tabindex="-1"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.key === 'Escape' && closeQuickEditor()}
    >
      <div class="admin-modal-head">
        <h3>Editar coluna</h3>
        <span class="crumbs">/ crm / colunas / {quickCol.title}</span>
        <button class="x" onclick={closeQuickEditor}><X size={13} /></button>
      </div>
      <div class="admin-modal-body">
        {#if quickError}
          <div class="crm-err-banner">{quickError}</div>
        {/if}
        <div class="crm-colrow">
          <div class="r1">
            <input
              class="cname {!quickCol.title.trim() ? 'invalid' : ''}"
              bind:value={quickCol.title}
            />
            <div class="crm-swatches">
              {#each COL_COLORS as col}
                <button
                  type="button"
                  class="crm-swatch {quickCol.color === col ? 'on' : ''}"
                  style="background:{col}"
                  aria-label="Usar cor {col}"
                  onclick={() => (quickCol = quickCol && { ...quickCol, color: col })}
                ></button>
              {/each}
            </div>
            {#if quickCol.is_default}
              <span class="default-badge">padrão</span>
            {/if}
            <button
              class="del"
              onclick={deleteQuickColumn}
              title="Excluir coluna"
              disabled={quickCol.is_default || quickSaving}
            >
              <X size={14} />
            </button>
          </div>
          <div class="crit">
            <div class="f">
              <label for="quick-entry-hint">Critério de entrada</label>
              <textarea
                id="quick-entry-hint"
                bind:value={quickCol.entry_hint}
                placeholder="Quando um lead entra nesta coluna?"
              ></textarea>
            </div>
            <div class="f">
              <label for="quick-exit-hint">Critério de saída</label>
              <textarea
                id="quick-exit-hint"
                bind:value={quickCol.exit_hint}
                placeholder="Quando um lead sai desta coluna?"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
      <div class="admin-modal-foot">
        <button class="btn ghost sm" onclick={closeQuickEditor} disabled={quickSaving}
          >Cancelar</button
        >
        <button class="btn sm" onclick={saveQuickColumn} disabled={quickSaving}>
          {#if quickSaving}Salvando…{:else}Salvar <Check size={12} />{/if}
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- ── Client Drawer ── -->
{#if activeClient}
  {@const activeCol = columns.find((c) => c.id === activeClient?.column_id)}
  <ClientDrawer
    client={activeClient}
    columnTitle={activeCol?.title || 'Desconhecido'}
    columnColor={activeCol?.color || '#9ca3af'}
    currentUser={data.adminUser?.name || 'Usuário'}
    onClose={() => (activeClient = null)}
    onUpdate={(updatedClient) => {
      clients = clients.map((c) => (c.id === updatedClient.id ? updatedClient : c));
      activeClient = updatedClient;
    }}
  />
{/if}

<!-- ── New Lead Modal ── -->
{#if showNewLeadModal}
  <NewLeadModal
    columns={columns}
    initialColumnId={addLeadColumnId}
    onClose={() => (showNewLeadModal = false)}
    onSave={(newLead) => {
      clients = [...clients, newLead];
      showNewLeadModal = false;
    }}
  />
{/if}

<style>
  /* ── Layout ── */
  .crm-root {
    flex: 1;
    min-height: 0;
    min-width: 0;
    display: flex;
    flex-direction: column;
    background: var(--bg);
    color: var(--text);
    overflow: hidden;
  }
  .crm-head {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 20px;
    border-bottom: 1px solid var(--line);
    background: var(--bg-elev);
    flex-shrink: 0;
    flex-wrap: wrap;
  }
  .crm-title {
    font-size: 13.5px;
    font-weight: 600;
    letter-spacing: -0.01em;
  }
  .crm-crumb {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-faint);
  }
  .grow {
    flex: 1;
  }

  /* ── Body ── */
  .crm-body {
    flex: 1;
    min-width: 0;
    overflow: auto;
    padding: 16px 20px 28px;
  }

  /* ── Empty / loading states ── */
  .crm-loading {
    padding: 60px 20px;
    text-align: center;
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--text-faint);
  }
  .crm-empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 80px 20px;
    text-align: center;
    font-size: 13px;
    color: var(--text-muted);
  }
  .crm-empty-state .ico {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    display: grid;
    place-items: center;
    background: var(--bg-soft);
    border: 1px solid var(--line);
    margin: 0 auto 12px;
    color: var(--text-faint);
  }

  /* ── Kanban ── */
  .crm-kanban {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    min-height: 100%;
  }
  .crm-col {
    flex: 0 0 260px;
    background: var(--bg-soft);
    border-radius: 12px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    border: 1px solid var(--line);
  }
  .crm-col-body {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-top: 4px;
  }
  .crm-col-head {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 4px 2px;
  }
  .crm-col-head .dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .crm-col-head .title {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: -0.01em;
    flex: 1;
  }
  .crm-col-head .ct {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--text-faint);
    background: var(--bg-elev);
    border: 1px solid var(--line);
    padding: 1px 6px;
    border-radius: 100px;
  }
  .crm-col-head .gear {
    background: transparent;
    border: 0;
    color: var(--text-faint);
    cursor: pointer;
    padding: 3px;
    border-radius: 6px;
    display: grid;
    place-items: center;
  }
  .crm-col-head .gear:hover {
    color: var(--text);
    background: var(--bg-elev);
  }
  .default-badge {
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--purple);
    background: var(--accent-soft);
    border: 1px solid var(--accent-line);
    padding: 1px 6px;
    border-radius: 100px;
  }
  .crm-col-empty {
    border: 1px dashed var(--line);
    border-radius: 9px;
    padding: 22px 10px;
    text-align: center;
    font-size: 11.5px;
    color: var(--text-faint);
    font-family: var(--font-mono);
  }
  .crm-addcol {
    flex: 0 0 52px;
    align-self: stretch;
    min-height: 80px;
    background: transparent;
    border: 1px dashed var(--line-strong);
    border-radius: 12px;
    color: var(--text-faint);
    cursor: pointer;
    display: grid;
    place-items: center;
    font-family: var(--font-mono);
    font-size: 11px;
    writing-mode: vertical-rl;
    letter-spacing: 0.1em;
    transition:
      color 0.12s,
      border-color 0.12s;
  }
  .crm-addcol:hover {
    color: var(--text);
    border-color: var(--purple);
  }
  .crm-addcard {
    background: transparent;
    border: 1px dashed var(--line-strong);
    border-radius: 9px;
    color: var(--text-faint);
    font-family: inherit;
    font-size: 12px;
    cursor: pointer;
    transition:
      color 0.12s,
      border-color 0.12s;
    width: 100%;
  }
  .crm-addcard:hover {
    color: var(--text);
    border-color: var(--purple);
  }

  /* ── Column editor ── */
  .crm-coleditor {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .crm-colrow {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: var(--bg-soft);
    border: 1px solid var(--line);
    border-radius: 10px;
    padding: 12px;
    transition:
      border-color 0.12s,
      box-shadow 0.12s;
  }
  .crm-colrow.dragging {
    opacity: 0.4;
  }
  .crm-colrow.drop-before {
    box-shadow: 0 -3px 0 var(--purple);
  }
  .crm-colrow.drop-after {
    box-shadow: 0 3px 0 var(--purple);
  }
  .crm-colrow .r1 {
    display: flex;
    align-items: center;
    gap: 9px;
  }
  .crm-colrow .handle {
    color: var(--text-faint);
    cursor: grab;
    display: inline-flex;
  }
  .crm-colrow input.cname {
    flex: 1;
    background: var(--bg);
    border: 1px solid var(--line);
    border-radius: 7px;
    padding: 7px 10px;
    font-family: inherit;
    font-size: 13px;
    font-weight: 500;
    color: var(--text);
    outline: none;
  }
  .crm-colrow input.cname:focus {
    border-color: var(--purple);
  }
  .crm-colrow input.cname.invalid {
    border-color: var(--pink);
  }
  .crm-colrow .del {
    background: transparent;
    border: 0;
    color: var(--text-faint);
    cursor: pointer;
    padding: 5px;
    border-radius: 6px;
  }
  .crm-colrow .del:hover:not(:disabled) {
    color: var(--pink);
    background: rgba(231, 31, 132, 0.1);
  }
  .crm-colrow .del:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  .crm-swatches {
    display: flex;
    gap: 5px;
  }
  .crm-swatch {
    width: 20px;
    height: 20px;
    border-radius: 5px;
    border: 2px solid transparent;
    cursor: pointer;
    padding: 0;
  }
  .crm-swatch.on {
    border-color: var(--text);
    box-shadow: 0 0 0 2px var(--bg-soft);
  }
  .crm-colrow .crit {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .crm-colrow .crit .f {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .crm-colrow .crit label {
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-faint);
  }
  .crm-colrow .crit textarea {
    background: var(--bg);
    border: 1px solid var(--line);
    border-radius: 7px;
    padding: 6px 9px;
    font-family: inherit;
    font-size: 12px;
    color: var(--text);
    outline: none;
    resize: none;
    min-height: 44px;
    line-height: 1.4;
  }
  .crm-colrow .crit textarea:focus {
    border-color: var(--purple);
  }

  /* ── Error banner ── */
  .crm-err-banner {
    background: rgba(231, 31, 132, 0.1);
    border: 1px solid rgba(231, 31, 132, 0.3);
    border-radius: 9px;
    padding: 10px 14px;
    font-size: 12.5px;
    color: var(--text);
    margin-bottom: 12px;
  }

  /* ── Responsive ── */
  @media (max-width: 760px) {
    .crm-kanban {
      flex-direction: column;
    }
    .crm-col {
      width: 100%;
      min-width: unset;
    }
    .crm-colrow .crit {
      grid-template-columns: 1fr;
    }
    .crm-head {
      gap: 8px;
    }
  }
</style>
