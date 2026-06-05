<script lang="ts">
  import { apiFetch } from '$lib/api/backend';
  import { supabase } from '$lib/api/supabase';
  import { topbarActions } from '$lib/stores/topbar';
  import { onMount } from 'svelte';
  import type { FaqArticle, FaqCategory } from './+page.server';

  let { data } = $props<{
    data: { articles: FaqArticle[]; categories: FaqCategory[]; error?: string };
  }>();

  // ── State ────────────────────────────────────────────────
  let articles = $state<FaqArticle[]>([]);
  let categories = $state<FaqCategory[]>([]);

  $effect(() => {
    articles = data.articles;
    categories = data.categories;
  });

  let searchQuery = $state('');
  let filterCategory = $state('all');

  let activeMenuId = $state<string | null>(null);

  // Modal criar/editar
  let isFormOpen = $state(false);
  let editingArticle = $state<FaqArticle | null>(null);
  let formTitle = $state('');
  let formTitleEn = $state('');
  let formBody = $state('');
  let formBodyEn = $state('');
  let formCategoryId = $state('');
  let formPublished = $state(false);
  let formSaving = $state(false);

  let questionTab = $state<'pt' | 'en'>('pt');
  let answerTab = $state<'pt' | 'en'>('pt');

  // Modal excluir
  let isConfirmOpen = $state(false);
  let articleToRemove = $state<FaqArticle | null>(null);
  let deleting = $state(false);

  let toastMessage = $state('');
  let toastType = $state<'success' | 'error'>('success');
  let toastTimer: ReturnType<typeof setTimeout> | null = null;

  // ── Topbar action ────────────────────────────────────────
  onMount(() => {
    topbarActions.set([{ label: '+ Novo artigo', onClick: openCreateModal }]);
    return () => topbarActions.set([]);
  });

  // ── Derived ──────────────────────────────────────────────
  let filteredArticles = $derived(
    articles
      .filter((a) => filterCategory === 'all' || a.category_id === filterCategory)
      .filter((a) => !searchQuery || a.title_pt.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  let publishedArticles = $derived(filteredArticles.filter((a) => a.published));
  let draftArticles = $derived(filteredArticles.filter((a) => !a.published));

  function helpfulPct(a: FaqArticle): number | null {
    const total = a.helpful_count + a.not_helpful_count;
    return total === 0 ? null : Math.round((a.helpful_count / total) * 100);
  }

  function getCategoryLabel(id: string): string {
    return categories.find((c) => c.id === id)?.label_pt ?? '—';
  }

  // ── Helpers ──────────────────────────────────────────────
  function showToast(message: string, type: 'success' | 'error' = 'success') {
    toastMessage = message;
    toastType = type;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (toastMessage = ''), 4000);
  }

  function handleOutsideClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (activeMenuId && !target.closest('.row-menu-pop') && !target.closest('.menu-btn')) {
      activeMenuId = null;
    }
  }

  // ── Modal: criar/editar ──────────────────────────────────
  function openCreateModal() {
    editingArticle = null;
    formTitle = '';
    formTitleEn = '';
    formBody = '';
    formBodyEn = '';
    formCategoryId = categories[0]?.id ?? '';
    formPublished = false;
    questionTab = 'pt';
    answerTab = 'pt';
    isFormOpen = true;
  }

  function openEditModal(article: FaqArticle) {
    editingArticle = article;
    formTitle = article.title_pt;
    formTitleEn = article.title_en ?? '';
    formBody = article.body_pt ?? '';
    formBodyEn = article.body_en ?? '';
    formCategoryId = article.category_id;
    formPublished = article.published;
    questionTab = 'pt';
    answerTab = 'pt';
    isFormOpen = true;
    activeMenuId = null;
  }

  async function saveArticle() {
    if (!formTitle.trim() || !formCategoryId) return;
    formSaving = true;
    try {
      const session = (await supabase.auth.getSession()).data.session;
      if (!session) throw new Error('Sessão expirada.');

      if (editingArticle) {
        const updated = await apiFetch<FaqArticle>(`/admin/faq/articles/${editingArticle.id}`, {
          method: 'PATCH',
          token: session.access_token,
          body: JSON.stringify({
            title_pt: formTitle,
            title_en: formTitleEn || null,
            body_pt: formBody,
            body_en: formBodyEn,
            category_id: formCategoryId,
            published: formPublished,
          }),
        });
        articles = articles.map((a) => (a.id === editingArticle!.id ? updated : a));
        showToast('Artigo atualizado com sucesso!');
      } else {
        const created = await apiFetch<FaqArticle>('/admin/faq/articles', {
          method: 'POST',
          token: session.access_token,
          body: JSON.stringify({
            title_pt: formTitle,
            title_en: formTitleEn || null,
            body_pt: formBody,
            body_en: formBodyEn,
            category_id: formCategoryId,
          }),
        });
        articles = [created, ...articles];
        showToast('Artigo criado com sucesso!');
      }
      isFormOpen = false;
    } catch (err: unknown) {
      const apiError = err as { message?: string };
      showToast(apiError.message || 'Erro ao salvar artigo.', 'error');
    } finally {
      formSaving = false;
    }
  }

  // ── Ações de linha ────────────────────────────────────────
  async function togglePublish(article: FaqArticle) {
    const newPublished = !article.published;
    try {
      const session = (await supabase.auth.getSession()).data.session;
      if (!session) throw new Error('Sessão expirada.');

      const updated = await apiFetch<FaqArticle>(`/admin/faq/articles/${article.id}`, {
        method: 'PATCH',
        token: session.access_token,
        body: JSON.stringify({ published: newPublished }),
      });

      articles = articles.map((a) => (a.id === article.id ? updated : a));
      showToast(newPublished ? 'Artigo publicado com sucesso!' : 'Movido para rascunho.');
    } catch (err: unknown) {
      const apiError = err as { message?: string };
      showToast(apiError.message || 'Falha ao atualizar status.', 'error');
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
      if (!session) throw new Error('Sessão expirada.');

      await apiFetch(`/admin/faq/articles/${articleToRemove.id}`, {
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

<div class="admin-content">
  <!-- Error banner -->
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
        class="err-ico"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      {data.error} — exibindo dados de exemplo
    </div>
  {/if}

  <!-- Panel -->
  <div class="panel">
    <!-- Panel header -->
    <div class="panel-head">
      <h3>{articles.length} artigos · {publishedArticles.length} publicados</h3>
      <span class="grow"></span>
      <div class="admin-search">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="search-ico"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input type="text" placeholder="Buscar pergunta…" bind:value={searchQuery} />
      </div>
    </div>

    <!-- Category filter chips -->
    <div class="chip-row">
      <button
        class="filter-chip {filterCategory === 'all' ? 'on' : ''}"
        onclick={() => (filterCategory = 'all')}
      >
        todas <span class="ct">{articles.length}</span>
      </button>
      {#each categories as cat}
        {@const ct = articles.filter((a) => a.category_id === cat.id).length}
        {#if ct > 0}
          <button
            class="filter-chip {filterCategory === cat.id ? 'on' : ''}"
            onclick={() => (filterCategory = cat.id)}
          >
            {cat.label_pt} <span class="ct">{ct}</span>
          </button>
        {/if}
      {/each}
    </div>

    <!-- Published section -->
    <div class="list-divider">
      <span>✓ Publicados</span>
      <span class="ln"></span>
      <span class="ct">{publishedArticles.length}</span>
    </div>

    {#if publishedArticles.length === 0}
      <div class="empty-section">Nenhum artigo publicado nesta categoria.</div>
    {/if}

    {#each publishedArticles as article (article.id)}
      {@const pct = helpfulPct(article)}
      <div class="faq-row">
        <span class="qmark">?</span>
        <span class="cat-chip">{getCategoryLabel(article.category_id)}</span>
        <div class="qtitle">{article.title_pt}</div>
        <span class="status-pill published">
          <span class="dt"></span>publicado
        </span>
        <span class="stat">{pct !== null ? `${pct}% útil` : '—'}</span>
        <div class="row-actions" style="position:relative">
          <button
            class="menu-btn"
            onclick={() => (activeMenuId = activeMenuId === article.id ? null : article.id)}
          >
            ⋮
          </button>
          {#if activeMenuId === article.id}
            <div class="row-menu-pop" role="menu">
              <button role="menuitem" onclick={() => openEditModal(article)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  class="mi"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Editar artigo
              </button>
              <button role="menuitem" onclick={() => togglePublish(article)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  class="mi"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                </svg>
                Despublicar
              </button>
              <div class="sep"></div>
              <button role="menuitem" class="danger" onclick={() => startRemoveArticle(article)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  class="mi"
                >
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path
                    d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                  ></path>
                </svg>
                Excluir
              </button>
            </div>
          {/if}
        </div>
      </div>
    {/each}

    <!-- Drafts section -->
    <div class="list-divider">
      <span>○ Rascunhos</span>
      <span class="ln"></span>
      <span class="ct">{draftArticles.length}</span>
    </div>

    {#if draftArticles.length === 0}
      <div class="empty-section">Nenhum rascunho.</div>
    {/if}

    {#each draftArticles as article (article.id)}
      {@const pct = helpfulPct(article)}
      <div class="faq-row draft">
        <span class="qmark">?</span>
        <span class="cat-chip">{getCategoryLabel(article.category_id)}</span>
        <div class="qtitle">{article.title_pt}</div>
        <span class="status-pill draft">
          <span class="dt"></span>rascunho
        </span>
        <span class="stat">{pct !== null ? `${pct}% útil` : '—'}</span>
        <div class="row-actions" style="position:relative">
          <button
            class="menu-btn"
            onclick={() => (activeMenuId = activeMenuId === article.id ? null : article.id)}
          >
            ⋮
          </button>
          {#if activeMenuId === article.id}
            <div class="row-menu-pop" role="menu">
              <button role="menuitem" onclick={() => openEditModal(article)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  class="mi"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Editar artigo
              </button>
              <button role="menuitem" onclick={() => togglePublish(article)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  class="mi"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Publicar
              </button>
              <div class="sep"></div>
              <button role="menuitem" class="danger" onclick={() => startRemoveArticle(article)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  class="mi"
                >
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path
                    d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                  ></path>
                </svg>
                Excluir
              </button>
            </div>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</div>

<!-- ── Modal: criar / editar ── -->
{#if isFormOpen}
  <div
    class="modal-overlay"
    role="dialog"
    aria-modal="true"
    tabindex="-1"
    onclick={(e) => {
      if (e.target === e.currentTarget) isFormOpen = false;
    }}
    onkeydown={(e) => {
      if (e.key === 'Escape') isFormOpen = false;
    }}
  >
    <div class="admin-modal wide">
      <div class="modal-head">
        <h3>{editingArticle ? `Editar · ${editingArticle.title_pt}` : 'Novo artigo de FAQ'}</h3>
        <span class="crumbs">/ faq / formulário</span>
        <button class="x-btn" onclick={() => (isFormOpen = false)} aria-label="fechar">✕</button>
      </div>

      <div class="modal-body">
        <div class="fld-row">
          <div class="fld">
            <label for="faq-cat">Categoria</label>
            <select id="faq-cat" bind:value={formCategoryId}>
              {#each categories as cat}
                <option value={cat.id}>{cat.label_pt}</option>
              {/each}
              {#if categories.length === 0}
                <option value="" disabled>Nenhuma categoria cadastrada</option>
              {/if}
            </select>
          </div>
          <div class="fld">
            <label for="faq-status">Status</label>
            <select
              id="faq-status"
              disabled={!editingArticle}
              value={formPublished ? 'published' : 'draft'}
              onchange={(e) => {
                formPublished = (e.currentTarget as HTMLSelectElement).value === 'published';
              }}
            >
              <option value="published">Publicado</option>
              <option value="draft">Rascunho</option>
            </select>
          </div>
        </div>

        <!-- Pergunta PT/EN -->
        <div class="fld">
          <div class="fld-label-row">
            <label for={questionTab === 'pt' ? 'faq-title-pt' : 'faq-title-en'}>Pergunta</label>
            <div class="lang-tabs">
              <button
                type="button"
                class="lang-tab {questionTab === 'pt' ? 'on' : ''}"
                onclick={() => (questionTab = 'pt')}
              >
                <span class="flag">🇧🇷</span> PT
              </button>
              <button
                type="button"
                class="lang-tab {questionTab === 'en' ? 'on' : ''}"
                onclick={() => (questionTab = 'en')}
              >
                <span class="flag">🇺🇸</span> EN
              </button>
            </div>
          </div>
          {#if questionTab === 'pt'}
            <input
              id="faq-title-pt"
              type="text"
              placeholder="Como funciona a contratação dos produtos Crianex?"
              bind:value={formTitle}
            />
          {:else}
            <input
              id="faq-title-en"
              type="text"
              placeholder="How does the Crianex product subscription work?"
              bind:value={formTitleEn}
            />
          {/if}
        </div>

        <!-- Resposta PT/EN -->
        <div class="fld">
          <div class="fld-label-row">
            <label for={answerTab === 'pt' ? 'faq-content-pt' : 'faq-content-en'}>Resposta</label>
            <div class="lang-tabs">
              <button
                type="button"
                class="lang-tab {answerTab === 'pt' ? 'on' : ''}"
                onclick={() => (answerTab = 'pt')}
              >
                <span class="flag">🇧🇷</span> PT
              </button>
              <button
                type="button"
                class="lang-tab {answerTab === 'en' ? 'on' : ''}"
                onclick={() => (answerTab = 'en')}
              >
                <span class="flag">🇺🇸</span> EN
              </button>
            </div>
          </div>
          {#if answerTab === 'pt'}
            <textarea
              id="faq-content-pt"
              class="answer-area"
              placeholder="Explique em 1–3 parágrafos…"
              bind:value={formBody}
            ></textarea>
          {:else}
            <textarea
              id="faq-content-en"
              class="answer-area"
              placeholder="Explain in 1–3 paragraphs…"
              bind:value={formBodyEn}
            ></textarea>
          {/if}
        </div>

        <div class="tip-box">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="tip-ico"
          >
            <polygon
              points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
            ></polygon>
          </svg>
          <div>
            <div class="tip-title">Dica</div>
            <div class="tip-body">
              Mantenha respostas curtas e objetivas. Use markdown leve (negrito, listas) — está
              habilitado.
            </div>
          </div>
        </div>
      </div>

      <div class="modal-foot">
        <span class="foot-hint">PT obrigatório · EN opcional</span>
        <button class="btn-ghost" onclick={() => (isFormOpen = false)} disabled={formSaving}>
          Cancelar
        </button>
        <button
          class="btn-primary"
          onclick={saveArticle}
          disabled={formSaving || !formTitle.trim() || !formCategoryId}
        >
          {formSaving ? 'Salvando…' : editingArticle ? 'Salvar alterações' : 'Criar artigo'}
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- ── Modal: confirmar exclusão ── -->
{#if isConfirmOpen}
  <div class="modal-overlay" role="dialog" aria-modal="true">
    <div class="admin-modal">
      <div class="modal-head">
        <h3>Excluir artigo?</h3>
        <button
          class="x-btn"
          onclick={() => (isConfirmOpen = false)}
          disabled={deleting}
          aria-label="fechar">✕</button
        >
      </div>
      <div class="modal-body danger-body">
        <div class="danger-ico">✕</div>
        <p>
          O artigo <strong>{articleToRemove?.title_pt}</strong> será removido permanentemente. As avaliações
          e métricas também serão apagadas.
        </p>
      </div>
      <div class="modal-foot">
        <button class="btn-ghost" onclick={() => (isConfirmOpen = false)} disabled={deleting}>
          Cancelar
        </button>
        <button class="btn-danger" onclick={confirmRemoveArticle} disabled={deleting}>
          {deleting ? 'Removendo…' : 'Excluir definitivamente'}
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- ── Toast ── -->
{#if toastMessage}
  <div class="toast" class:error={toastType === 'error'} role="status" aria-live="polite">
    {toastMessage}
  </div>
{/if}

<style>
  /* ── Layout ── */
  .admin-content {
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  /* ── Error banner ── */
  .error-banner {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(239, 68, 68, 0.08);
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 8px;
    padding: 12px 16px;
    font-size: 13px;
    color: #ef4444;
  }
  .err-ico {
    width: 15px;
    height: 15px;
    flex-shrink: 0;
  }

  /* ── Panel ── */
  .panel {
    background: var(--bg-elev);
    border: 1px solid var(--line);
    border-radius: 10px;
    padding: 14px;
    display: flex;
    flex-direction: column;
  }

  .panel-head {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 4px;
  }

  .panel-head h3 {
    font-size: 13.5px;
    font-weight: 600;
    color: var(--text);
    margin: 0;
  }

  .grow {
    flex: 1;
  }

  /* ── Search ── */
  .admin-search {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--bg-soft);
    border: 1px solid var(--line);
    border-radius: 6px;
    padding: 6px 10px;
    width: 220px;
  }

  .admin-search input {
    background: transparent;
    border: none;
    outline: none;
    font-size: 12.5px;
    color: var(--text);
    font-family: inherit;
    width: 100%;
  }

  .search-ico {
    width: 13px;
    height: 13px;
    color: var(--text-faint);
    flex-shrink: 0;
  }

  /* ── Chips ── */
  .chip-row {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    margin-top: 10px;
    margin-bottom: 4px;
  }

  .filter-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    border-radius: 100px;
    border: 1px solid var(--line);
    background: var(--bg-soft);
    color: var(--text-muted);
    font-size: 11.5px;
    font-family: inherit;
    cursor: pointer;
    transition:
      border-color 0.15s,
      background 0.15s,
      color 0.15s;
  }

  .filter-chip.on {
    border-color: var(--purple);
    background: rgba(127, 63, 229, 0.12);
    color: var(--purple);
  }

  .filter-chip .ct {
    font-family: var(--font-mono);
    font-size: 10px;
    opacity: 0.7;
  }

  /* ── Divider ── */
  .list-divider {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 0 6px;
    font-size: 11px;
    font-weight: 600;
    color: var(--text-muted);
    font-family: var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .list-divider .ln {
    flex: 1;
    height: 1px;
    background: var(--line);
  }

  .list-divider .ct {
    font-size: 10px;
    color: var(--text-faint);
  }

  /* ── FAQ rows ── */
  .faq-row {
    display: grid;
    grid-template-columns: 24px 70px 1fr 110px 80px 36px;
    gap: 12px;
    align-items: center;
    padding: 11px 4px;
    border-bottom: 1px solid var(--line);
    transition: background 0.1s;
  }

  .faq-row:last-of-type {
    border-bottom: none;
  }

  .faq-row:hover {
    background: var(--bg-soft);
  }

  .faq-row.draft {
    opacity: 0.7;
  }

  .qmark {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--bg-soft);
    border: 1px solid var(--line);
    color: var(--text-faint);
    font-size: 11px;
    font-weight: 700;
    display: grid;
    place-items: center;
    flex-shrink: 0;
    font-family: var(--font-mono);
  }

  .cat-chip {
    font-family: var(--font-mono);
    font-size: 9.5px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    padding: 3px 7px;
    background: var(--bg-soft);
    border-radius: 4px;
    color: var(--text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .qtitle {
    font-size: 13.5px;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 500;
  }

  .status-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 500;
    padding: 2px 8px;
    border-radius: 999px;
    white-space: nowrap;
  }

  .status-pill.published {
    background: rgba(102, 223, 122, 0.12);
    color: var(--green);
  }

  .status-pill.draft {
    background: var(--bg-soft);
    color: var(--text-faint);
  }

  .status-pill .dt {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: currentColor;
    flex-shrink: 0;
  }

  .stat {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-muted);
    text-align: right;
  }

  .row-actions {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* ── Menu ── */
  .menu-btn {
    background: transparent;
    border: none;
    font-size: 16px;
    color: var(--text-muted);
    cursor: pointer;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    transition:
      background 0.15s,
      color 0.15s;
    font-family: inherit;
  }

  .menu-btn:hover {
    background: var(--bg-soft);
    color: var(--text);
  }

  .row-menu-pop {
    position: absolute;
    right: 0;
    top: 100%;
    background: var(--bg-elev);
    border: 1px solid var(--line);
    border-radius: 8px;
    padding: 4px;
    box-shadow: var(--shadow-3);
    min-width: 160px;
    z-index: 50;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .row-menu-pop button {
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
    transition: background 0.1s;
  }

  .row-menu-pop button:hover {
    background: var(--bg-soft);
  }

  .row-menu-pop button.danger {
    color: var(--pink);
  }

  .row-menu-pop button.danger:hover {
    background: rgba(231, 31, 132, 0.08);
  }

  .row-menu-pop .sep {
    height: 1px;
    background: var(--line);
    margin: 2px 6px;
  }

  .mi {
    width: 13px;
    height: 13px;
    flex-shrink: 0;
    color: currentColor;
  }

  /* ── Empty ── */
  .empty-section {
    padding: 14px 28px;
    font-size: 12.5px;
    color: var(--text-faint);
    font-style: italic;
  }

  /* ── Modal overlay ── */
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

  .admin-modal {
    background: var(--bg-elev);
    border: 1px solid var(--line);
    border-radius: 12px;
    width: 100%;
    max-width: 480px;
    display: flex;
    flex-direction: column;
    box-shadow: var(--shadow-3);
    animation: modalIn 0.2s ease-out;
  }

  .admin-modal.wide {
    max-width: 560px;
  }

  @keyframes modalIn {
    from {
      opacity: 0;
      transform: scale(0.96) translateY(10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  .modal-head {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    border-bottom: 1px solid var(--line);
  }

  .modal-head h3 {
    font-size: 15px;
    font-weight: 600;
    color: var(--text);
    margin: 0;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .modal-head .crumbs {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--text-faint);
    letter-spacing: 0.06em;
    flex-shrink: 0;
  }

  .x-btn {
    background: transparent;
    border: none;
    font-size: 18px;
    color: var(--text-muted);
    cursor: pointer;
    padding: 0;
    line-height: 1;
    flex-shrink: 0;
  }

  .x-btn:hover {
    color: var(--text);
  }

  .modal-body {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .danger-body {
    align-items: center;
    text-align: center;
    gap: 12px;
  }

  .danger-ico {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.25);
    color: #ef4444;
    font-size: 20px;
    font-weight: 700;
    display: grid;
    place-items: center;
  }

  .danger-body p {
    font-size: 13.5px;
    color: var(--text);
    line-height: 1.5;
    margin: 0;
  }

  /* ── Form fields ── */
  .fld-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .fld {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .fld label {
    font-size: 11.5px;
    font-weight: 500;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-family: var(--font-mono);
  }

  .fld input,
  .fld select {
    background: var(--bg);
    border: 1px solid var(--line);
    border-radius: 7px;
    padding: 9px 12px;
    font-size: 13.5px;
    color: var(--text);
    font-family: inherit;
    outline: none;
    transition: border-color 0.15s;
    width: 100%;
    box-sizing: border-box;
  }

  .fld input:focus,
  .fld select:focus {
    border-color: var(--purple);
  }

  /* Bilingual tabs */
  .fld-label-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .lang-tabs {
    display: flex;
    gap: 2px;
    background: var(--bg-soft);
    border: 1px solid var(--line);
    border-radius: 6px;
    padding: 2px;
  }

  .lang-tab {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 9px;
    font-size: 11px;
    font-weight: 500;
    font-family: inherit;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background: transparent;
    color: var(--text-muted);
    transition:
      background 0.12s,
      color 0.12s;
  }

  .lang-tab.on {
    background: var(--bg-elev);
    color: var(--text);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }

  .flag {
    font-size: 12px;
    line-height: 1;
  }

  /* Expandable textarea */
  .answer-area {
    background: var(--bg);
    border: 1px solid var(--line);
    border-radius: 7px;
    padding: 9px 12px;
    font-size: 13.5px;
    color: var(--text);
    font-family: inherit;
    outline: none;
    transition: border-color 0.15s;
    width: 100%;
    box-sizing: border-box;
    resize: vertical;
    min-height: 100px;
    line-height: 1.55;
  }

  .answer-area:focus {
    border-color: var(--purple);
  }

  /* ── Tip box ── */
  .tip-box {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    background: rgba(127, 63, 229, 0.06);
    border: 1px solid rgba(127, 63, 229, 0.2);
    border-radius: 10px;
    padding: 12px;
    font-size: 12.5px;
  }

  .tip-ico {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    margin-top: 2px;
    color: var(--purple);
  }

  .tip-title {
    font-weight: 500;
    color: var(--text);
    margin-bottom: 2px;
  }

  .tip-body {
    color: var(--text-muted);
  }

  /* ── Modal footer ── */
  .modal-foot {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 8px;
    padding: 14px 20px;
    border-top: 1px solid var(--line);
  }

  .foot-hint {
    font-family: var(--font-mono);
    font-size: 10.5px;
    color: var(--text-faint);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-right: auto;
  }

  .btn-ghost {
    background: transparent;
    color: var(--text-muted);
    border: 1px solid var(--line);
    border-radius: 6px;
    padding: 8px 14px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    font-family: inherit;
    transition:
      border-color 0.15s,
      color 0.15s;
  }

  .btn-ghost:hover:not(:disabled) {
    border-color: var(--line-strong);
    color: var(--text);
  }

  .btn-primary {
    background: #fff;
    color: #101010;
    border: none;
    border-radius: 6px;
    padding: 8px 16px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.15s;
  }

  .btn-primary:hover:not(:disabled) {
    background: var(--purple);
    color: #fff;
  }

  .btn-primary:disabled,
  .btn-ghost:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .btn-danger {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 6px;
    padding: 8px 16px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: background 0.15s;
  }

  .btn-danger:hover:not(:disabled) {
    background: #ef4444;
    color: #fff;
    border-color: #ef4444;
  }

  .btn-danger:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  /* ── Toast ── */
  .toast {
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: #101010;
    color: #fff;
    border: 1px solid var(--green);
    border-radius: 8px;
    padding: 12px 20px;
    font-size: 13.5px;
    font-weight: 500;
    box-shadow: var(--shadow-3);
    z-index: 200;
    animation: toastIn 0.25s ease-out;
  }

  .toast.error {
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

  /* ── Responsive ── */
  @media (max-width: 680px) {
    .faq-row {
      grid-template-columns: 24px 1fr 36px;
    }
    .cat-chip,
    .status-pill,
    .stat {
      display: none;
    }
    .admin-search {
      width: 160px;
    }
    .fld-row {
      grid-template-columns: 1fr;
    }
  }
</style>
