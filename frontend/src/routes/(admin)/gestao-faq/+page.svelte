<script lang="ts">
  import { apiFetch } from '$lib/api/backend';
  import { supabase } from '$lib/api/supabase';
  import FaqFilters from '$lib/components/admin/FaqFilters.svelte';
  import type { FaqArticle } from './+page.server';

  let { data } = $props<{ data: { articles: FaqArticle[]; error?: string } }>();

  // ── State ────────────────────────────────────────────────
  let articles = $state<FaqArticle[]>([]);
  $effect(() => {
    articles = data.articles;
  });

  let searchQuery = $state<string>('');
  let filterCategory = $state<string>('Todos');
  let filterStatus = $state<'Todos' | 'published' | 'draft'>('Todos');

  let activeMenuId = $state<string | null>(null);

  let isConfirmOpen = $state<boolean>(false);
  let articleToRemove = $state<FaqArticle | null>(null);
  let deleting = $state<boolean>(false);

  let toastMessage = $state<string>('');
  let toastType = $state<'success' | 'error'>('success');
  let toastTimer: ReturnType<typeof setTimeout> | null = null;

  // ── Derived ──────────────────────────────────────────────

  // Unique categories extracted from loaded articles
  let categories = $derived([...new Set(articles.map((a) => a.category).filter(Boolean))]);

  let filteredArticles = $derived(
    articles
      .filter((a) => filterCategory === 'Todos' || a.category === filterCategory)
      .filter((a) => filterStatus === 'Todos' || a.status === filterStatus)
      .filter((a) => !searchQuery || a.title_pt.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  let totalPublished = $derived(articles.filter((a) => a.status === 'published').length);
  let totalDraft = $derived(articles.filter((a) => a.status === 'draft').length);

  // ── Helpers ──────────────────────────────────────────────
  function showToast(message: string, type: 'success' | 'error' = 'success') {
    toastMessage = message;
    toastType = type;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (toastMessage = ''), 4000);
  }

  function formatDate(dateStr: string | null): string {
    if (!dateStr) return '—';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(dateStr));
  }

  function handleOutsideClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (activeMenuId && !target.closest('.menu-container') && !target.closest('.menu-btn')) {
      activeMenuId = null;
    }
  }

  // ── Actions ──────────────────────────────────────────────
  async function togglePublish(article: FaqArticle) {
    const newStatus = article.status === 'published' ? 'draft' : 'published';
    try {
      const session = (await supabase.auth.getSession()).data.session;
      if (!session) throw new Error('Sessão expirada. Faça login novamente.');

      await apiFetch(`/api/admin/faq/${article.id}/status`, {
        method: 'PATCH',
        token: session.access_token,
        body: JSON.stringify({ status: newStatus }),
      });

      articles = articles.map((a) => (a.id === article.id ? { ...a, status: newStatus } : a));
      showToast(
        `Artigo ${newStatus === 'published' ? 'publicado' : 'movido para rascunho'} com sucesso!`
      );
    } catch (err: unknown) {
      const apiError = err as { message?: string };
      showToast(apiError.message || 'Falha ao atualizar status do artigo.', 'error');
    } finally {
      activeMenuId = null;
    }
  }

  function startRemoveArticle(article: FaqArticle) {
    articleToRemove = article;
    isConfirmOpen = true;
    activeMenuId = null;
  }

  async function confirmRemoveArticle() {
    if (!articleToRemove) return;
    deleting = true;
    try {
      const session = (await supabase.auth.getSession()).data.session;
      if (!session) throw new Error('Sessão expirada. Faça login novamente.');

      await apiFetch(`/api/admin/faq/${articleToRemove.id}`, {
        method: 'DELETE',
        token: session.access_token,
      });

      articles = articles.filter((a) => a.id !== articleToRemove!.id);
      showToast('Artigo removido com sucesso!');
      isConfirmOpen = false;
      articleToRemove = null;
    } catch (err: unknown) {
      const apiError = err as { message?: string };
      showToast(apiError.message || 'Falha ao remover artigo.', 'error');
    } finally {
      deleting = false;
    }
  }
</script>

<svelte:window onclick={handleOutsideClick} />

<div class="faq-container">
  <!-- Topbar -->
  <header class="admin-topbar">
    <div class="crumbs" aria-label="Navegação de contexto">
      <span>/ conteúdo</span>
      <span class="active-crumb">/ faq</span>
    </div>
    <div class="header-action-group">
      <a href="/admin/gestao-faq/novo" class="btn-add">
        <span>+</span> Criar artigo
      </a>
    </div>
  </header>

  <!-- KPIs -->
  <section class="kpis-grid" aria-label="Indicadores dos artigos FAQ">
    <div class="kpi-card">
      <span class="kpi-label">Total de Artigos</span>
      <span class="kpi-value">{articles.length}</span>
    </div>
    <div class="kpi-card">
      <span class="kpi-label">Publicados</span>
      <span class="kpi-value">{totalPublished}</span>
    </div>
    <div class="kpi-card">
      <span class="kpi-label">Rascunhos</span>
      <span class="kpi-value draft">{totalDraft}</span>
    </div>
    <div class="kpi-card">
      <span class="kpi-label">Categorias</span>
      <span class="kpi-value">{categories.length}</span>
    </div>
  </section>

  <!-- Server error banner -->
  {#if data.error}
    <div class="error-banner" role="alert">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="error-icon"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      {data.error}
    </div>
  {/if}

  <!-- Filters -->
  <FaqFilters bind:searchQuery bind:filterCategory bind:filterStatus {categories} />

  <!-- Content Panel -->
  <main class="panel">
    {#if articles.length === 0 && !data.error}
      <!-- Empty state: no articles at all -->
      <div class="empty">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="empty-icon"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
        <p>Nenhum artigo criado</p>
        <div class="empty-actions">
          <a href="/admin/gestao-faq/novo" class="btn-add">Criar primeiro artigo</a>
        </div>
      </div>
    {:else if filteredArticles.length === 0}
      <!-- Empty state: filters returned no results -->
      <div class="empty">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="empty-icon"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <p>Nenhum artigo encontrado para os filtros selecionados.</p>
      </div>
    {:else}
      <!-- Data Table -->
      <div class="data-table" role="table" aria-label="Tabela de artigos FAQ">
        <div class="dt-row header" role="row">
          <span>Título PT</span>
          <span>Categoria</span>
          <span>Status</span>
          <span>Avaliações</span>
          <span>Publicado em</span>
          <span>Ações</span>
        </div>

        {#each filteredArticles as article (article.id)}
          <div class="dt-row" role="row">
            <!-- Título -->
            <span class="title-cell">{article.title_pt}</span>

            <!-- Categoria -->
            <span class="category-cell">
              <span class="category-chip">{article.category || '—'}</span>
            </span>

            <!-- Status Pill -->
            <span class="status-cell">
              <span class="status-pill {article.status}">
                <span class="dt"></span>
                {article.status === 'published' ? 'publicado' : 'rascunho'}
              </span>
            </span>

            <!-- Avaliações -->
            <span class="ratings-cell">
              <span class="rating good" title="Útil">
                👍 {article.ratings_positive}
              </span>
              <span class="rating bad" title="Não útil">
                👎 {article.ratings_negative}
              </span>
            </span>

            <!-- Data de publicação -->
            <span class="date-cell mono">{formatDate(article.published_at)}</span>

            <!-- Menu de Ações -->
            <span class="actions-cell">
              <div class="action-wrapper">
                <button
                  class="menu-btn"
                  aria-label="Ações para {article.title_pt}"
                  onclick={() => (activeMenuId = activeMenuId === article.id ? null : article.id)}
                >
                  ⋯
                </button>

                {#if activeMenuId === article.id}
                  <div class="menu-container" role="menu">
                    <a
                      class="menu-item"
                      role="menuitem"
                      href="/admin/gestao-faq/{article.id}/editar"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="menu-ico"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                      Editar
                    </a>
                    <button
                      class="menu-item"
                      role="menuitem"
                      onclick={() => togglePublish(article)}
                    >
                      {#if article.status === 'published'}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="menu-ico"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="9" y1="9" x2="15" y2="15"></line>
                          <line x1="15" y1="9" x2="9" y2="15"></line>
                        </svg>
                        Despublicar
                      {:else}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="menu-ico"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Publicar
                      {/if}
                    </button>
                    <button
                      class="menu-item danger"
                      role="menuitem"
                      onclick={() => startRemoveArticle(article)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="menu-ico"
                      >
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path
                          d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                        ></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                      Remover
                    </button>
                  </div>
                {/if}
              </div>
            </span>
          </div>
        {/each}
      </div>
    {/if}
  </main>

  <!-- Delete Confirmation Modal -->
  {#if isConfirmOpen}
    <div class="modal-overlay">
      <div class="modal confirm-modal" role="dialog" aria-labelledby="confirm-title">
        <header class="modal-header">
          <h3 id="confirm-title">Confirmar Remoção</h3>
          <button
            class="modal-close-btn"
            onclick={() => (isConfirmOpen = false)}
            disabled={deleting}
          >
            &times;
          </button>
        </header>
        <div class="modal-body">
          <p>
            Tem certeza que deseja remover o artigo <strong>{articleToRemove?.title_pt}</strong>?
          </p>
          <p class="warning-text">Esta ação é permanente e não pode ser desfeita.</p>
        </div>
        <footer class="modal-footer">
          <button class="btn-cancel" onclick={() => (isConfirmOpen = false)} disabled={deleting}>
            Cancelar
          </button>
          <button class="btn-submit danger-btn" onclick={confirmRemoveArticle} disabled={deleting}>
            {deleting ? 'Removendo...' : 'Remover artigo'}
          </button>
        </footer>
      </div>
    </div>
  {/if}

  <!-- Toast -->
  {#if toastMessage}
    <div
      class="toast-container"
      class:error={toastType === 'error'}
      role="status"
      aria-live="polite"
    >
      <span>{toastMessage}</span>
    </div>
  {/if}
</div>

<style>
  .faq-container {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  /* Topbar */
  .admin-topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
  }

  .crumbs {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-faint);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    display: flex;
    gap: 6px;
  }

  .active-crumb {
    color: var(--text);
  }

  .header-action-group {
    display: flex;
    gap: 10px;
  }

  .btn-add {
    background-color: #ffffff;
    color: #101010;
    border: none;
    border-radius: 999px;
    padding: 8px 16px;
    font-size: 13.5px;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    text-decoration: none;
    transition:
      background-color 0.2s,
      transform 0.15s;
  }

  .btn-add:hover {
    background-color: var(--purple);
    color: #ffffff;
  }

  /* KPIs */
  .kpis-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
  }

  .kpi-card {
    background-color: var(--bg-elev);
    border: 1px solid var(--line);
    border-radius: 8px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .kpi-label {
    font-size: 12.5px;
    color: var(--text-muted);
    font-weight: 500;
  }

  .kpi-value {
    font-size: 24px;
    font-weight: 700;
    color: var(--green);
    letter-spacing: -0.02em;
  }

  .kpi-value.draft {
    color: var(--text-faint);
  }

  /* Error banner */
  .error-banner {
    display: flex;
    align-items: center;
    gap: 10px;
    background-color: rgba(239, 68, 68, 0.08);
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 8px;
    padding: 12px 16px;
    font-size: 13.5px;
    color: #ef4444;
  }

  .error-icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  /* Panel */
  .panel {
    background-color: var(--bg-elev);
    border: 1px solid var(--line);
    border-radius: 10px;
    padding: 16px;
    overflow-x: auto;
  }

  /* Table */
  .data-table {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-width: 680px;
  }

  .data-table .dt-row {
    display: grid;
    grid-template-columns: 2.5fr 140px 120px 110px 120px 48px;
    align-items: center;
    padding: 10px 12px;
    border-bottom: 1px solid var(--line);
  }

  .data-table .dt-row.header {
    border-bottom: 2px solid var(--line-strong);
    color: var(--text-muted);
    font-family: var(--font-mono);
    font-size: 10.5px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
    padding-bottom: 12px;
  }

  .data-table .dt-row:not(.header):hover {
    background-color: var(--bg-soft);
  }

  .title-cell {
    font-weight: 500;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 12px;
  }

  .category-cell {
    display: flex;
    align-items: center;
  }

  .category-chip {
    font-family: var(--font-mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 2px 6px;
    background-color: var(--bg-soft);
    color: var(--text-muted);
    border-radius: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 120px;
  }

  .status-cell {
    display: flex;
    align-items: center;
  }

  .status-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11.5px;
    font-weight: 500;
    padding: 2px 8px;
    border-radius: 999px;
  }

  .status-pill.published {
    background-color: rgba(16, 185, 129, 0.1);
    color: var(--green);
  }

  .status-pill.draft {
    background-color: var(--bg-soft);
    color: var(--text-faint);
  }

  .status-pill .dt {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: currentColor;
  }

  .ratings-cell {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .rating {
    font-size: 12px;
    color: var(--text-muted);
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .date-cell {
    font-size: 12px;
    color: var(--text-muted);
  }

  .actions-cell {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .action-wrapper {
    position: relative;
  }

  .menu-btn {
    background: transparent;
    border: none;
    font-size: 18px;
    color: var(--text-muted);
    cursor: pointer;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    transition:
      background-color 0.15s,
      color 0.15s;
  }

  .menu-btn:hover {
    background-color: var(--bg-soft);
    color: var(--text);
  }

  .menu-container {
    position: absolute;
    right: 0;
    top: 100%;
    background-color: var(--bg-elev);
    border: 1px solid var(--line);
    border-radius: 8px;
    padding: 4px;
    box-shadow: var(--shadow-3);
    min-width: 150px;
    z-index: 50;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 8px 10px;
    background: transparent;
    border: 0;
    cursor: pointer;
    color: var(--text);
    font-family: inherit;
    font-size: 12.5px;
    border-radius: 6px;
    text-align: left;
    text-decoration: none;
    transition: background-color 0.15s;
  }

  .menu-item:hover {
    background-color: var(--bg-soft);
  }

  .menu-item.danger {
    color: var(--pink);
  }

  .menu-item.danger:hover {
    background-color: rgba(231, 31, 132, 0.08);
  }

  .menu-ico {
    width: 13px;
    height: 13px;
    flex-shrink: 0;
    color: currentColor;
  }

  /* Empty state */
  .empty {
    padding: 48px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    text-align: center;
  }

  .empty-icon {
    width: 48px;
    height: 48px;
    color: var(--text-faint);
  }

  .empty p {
    font-size: 14px;
    color: var(--text-muted);
  }

  .empty-actions {
    display: flex;
    gap: 10px;
    margin-top: 6px;
  }

  /* Confirm Modal */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(6, 6, 6, 0.6);
    backdrop-filter: blur(2px);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }

  .modal {
    background-color: var(--bg-elev);
    border: 1px solid var(--line);
    border-radius: 12px;
    width: 100%;
    max-width: 420px;
    display: flex;
    flex-direction: column;
    box-shadow: var(--shadow-3);
    animation: modalIn 0.2s ease-out;
  }

  @keyframes modalIn {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid var(--line);
  }

  .modal-header h3 {
    font-size: 16px;
    font-weight: 600;
    color: var(--text);
  }

  .modal-close-btn {
    background: transparent;
    border: none;
    font-size: 22px;
    color: var(--text-muted);
    cursor: pointer;
  }

  .modal-close-btn:hover {
    color: var(--text);
  }

  .modal-body {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 14.5px;
    line-height: 1.5;
    color: var(--text);
  }

  .warning-text {
    font-size: 13px;
    color: var(--text-muted);
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 16px 20px;
    border-top: 1px solid var(--line);
  }

  .btn-cancel {
    background: transparent;
    color: var(--text-muted);
    border: 1px solid var(--line);
    border-radius: 6px;
    padding: 8px 16px;
    font-size: 13.5px;
    font-weight: 500;
    cursor: pointer;
    transition:
      border-color 0.2s,
      color 0.2s;
  }

  .btn-cancel:hover:not(:disabled) {
    border-color: var(--line-strong);
    color: var(--text);
  }

  .btn-submit {
    background-color: #ffffff;
    color: #101010;
    border: none;
    border-radius: 6px;
    padding: 8px 16px;
    font-size: 13.5px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .btn-submit:hover:not(:disabled) {
    background-color: var(--purple);
    color: #ffffff;
  }

  .btn-submit.danger-btn {
    background-color: rgba(239, 68, 68, 0.1);
    color: #ef4444;
    border: 1px solid rgba(239, 68, 68, 0.3);
  }

  .btn-submit.danger-btn:hover:not(:disabled) {
    background-color: #ef4444;
    color: #ffffff;
    border-color: #ef4444;
  }

  .btn-submit:disabled,
  .btn-cancel:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Toast */
  .toast-container {
    position: fixed;
    bottom: 24px;
    right: 24px;
    background-color: #101010;
    color: #ffffff;
    border: 1px solid var(--green);
    border-radius: 8px;
    padding: 12px 20px;
    font-size: 13.5px;
    font-weight: 500;
    box-shadow: var(--shadow-3);
    z-index: 200;
    animation: toastIn 0.25s ease-out;
  }

  .toast-container.error {
    border-color: #ef4444;
  }

  @keyframes toastIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Responsive */
  @media (max-width: 768px) {
    .data-table .dt-row {
      grid-template-columns: 2fr 100px 48px;
      font-size: 12.5px;
    }

    .category-cell,
    .ratings-cell,
    .date-cell {
      display: none;
    }

    .modal-overlay {
      padding: 12px;
    }
  }
</style>
