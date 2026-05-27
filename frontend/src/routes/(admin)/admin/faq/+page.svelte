<script lang="ts">
  type Faq = {
    id: number;
    title: string;
    category: string;
    status: 'Publicado' | 'Rascunho';
    positive: number;
    negative: number;
    publishedAt: string;
  };

  const faqs: Faq[] = [
    {
      id: 1,
      title: 'Como cadastrar uma criança?',
      category: 'Cadastro',
      status: 'Publicado',
      positive: 22,
      negative: 2,
      publishedAt: '10/05/2026',
    },
    {
      id: 2,
      title: 'Como redefinir senha?',
      category: 'Conta',
      status: 'Rascunho',
      positive: 8,
      negative: 1,
      publishedAt: '08/05/2026',
    },
    {
      id: 3,
      title: 'Como funciona a assinatura?',
      category: 'Pagamentos',
      status: 'Publicado',
      positive: 15,
      negative: 0,
      publishedAt: '05/05/2026',
    },
  ];

  const categories = ['Todos', ...new Set(faqs.map((f) => f.category))];
  const statuses = ['Todos', 'Publicado', 'Rascunho'];

  let selectedCategory = 'Todos';
  let selectedStatus = 'Todos';
  let search = '';

  $: filteredFaqs = faqs.filter((faq) => {
    const matchesCategory =
      selectedCategory === 'Todos' || faq.category === selectedCategory;

    const matchesStatus =
      selectedStatus === 'Todos' || faq.status === selectedStatus;

    const matchesSearch = faq.title
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesCategory && matchesStatus && matchesSearch;
  });

  $: publishedFaqs = filteredFaqs.filter(
    (faq) => faq.status === 'Publicado'
  );

  $: draftFaqs = filteredFaqs.filter(
    (faq) => faq.status === 'Rascunho'
  );
</script>

<svelte:head>
  <title>FAQ Admin</title>
</svelte:head>

<div class="page">
  <div class="page-header">
    <div>
      <h1>FAQ · artigos</h1>
      <p>Gerencie os artigos da base de conhecimento</p>
    </div>

    <button class="new-button">
      + Novo artigo
    </button>
  </div>

  <div class="panel">
    <div class="panel-top">
      <div>
        <h2>{faqs.length} artigos</h2>
        <span>{publishedFaqs.length} publicados</span>
      </div>

      <input
        type="text"
        bind:value={search}
        placeholder="Buscar pergunta..."
        class="search-input"
      />
    </div>

    <div class="filter-bar">
      {#each categories as category}
        <button
          class:selected={selectedCategory === category}
          class="filter-chip"
          on:click={() => (selectedCategory = category)}
        >
          {category}
        </button>
      {/each}
    </div>

    <div class="filter-bar status">
      {#each statuses as status}
        <button
          class:selected={selectedStatus === status}
          class="filter-chip"
          on:click={() => (selectedStatus = status)}
        >
          {status}
        </button>
      {/each}
    </div>

    {#if filteredFaqs.length === 0}
      <div class="empty-state">
        <h3>Nenhum artigo criado</h3>
        <button class="new-button">
          Criar primeiro artigo
        </button>
      </div>
    {:else}

      <div class="section-title">
        ✓ Publicados
      </div>

      {#if publishedFaqs.length === 0}
        <div class="empty-small">
          Nenhum artigo publicado.
        </div>
      {/if}

      {#each publishedFaqs as faq}
        <div class="faq-row">
          <div class="qmark">?</div>

          <div class="category-tag">
            {faq.category}
          </div>

          <div class="faq-content">
            <div class="faq-title">
              {faq.title}
            </div>

            <div class="faq-date">
              Publicado em {faq.publishedAt}
            </div>
          </div>

          <div>
            <span class="status-pill published">
              {faq.status}
            </span>
          </div>

          <div class="rating">
            👍 {faq.positive}
          </div>

          <div class="rating negative">
            👎 {faq.negative}
          </div>

          <div class="actions">
            <button>Editar</button>
            <button>Ocultar</button>
            <button class="danger">Remover</button>
          </div>
        </div>
      {/each}

      <div class="section-title draft">
        ○ Rascunhos
      </div>

      {#if draftFaqs.length === 0}
        <div class="empty-small">
          Nenhum rascunho.
        </div>
      {/if}

      {#each draftFaqs as faq}
        <div class="faq-row draft-row">
          <div class="qmark">?</div>

          <div class="category-tag">
            {faq.category}
          </div>

          <div class="faq-content">
            <div class="faq-title">
              {faq.title}
            </div>

            <div class="faq-date">
              Salvo em {faq.publishedAt}
            </div>
          </div>

          <div>
            <span class="status-pill draft">
              {faq.status}
            </span>
          </div>

          <div class="rating">
            👍 {faq.positive}
          </div>

          <div class="rating negative">
            👎 {faq.negative}
          </div>

          <div class="actions">
            <button>Editar</button>
            <button>Publicar</button>
            <button class="danger">Remover</button>
          </div>
        </div>
      {/each}

    {/if}
  </div>
</div>

<style>
  :global(body) {
    background: #f5f6fb;
    font-family: Inter, sans-serif;
  }

  .page {
    padding: 32px;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  h1 {
    margin: 0;
    font-size: 28px;
  }

  .page-header p {
    color: #6b7280;
    margin-top: 6px;
  }

  .panel {
    background: white;
    border-radius: 16px;
    padding: 24px;
    border: 1px solid #e5e7eb;
  }

  .panel-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .panel-top h2 {
    margin: 0;
    font-size: 18px;
  }

  .panel-top span {
    color: #6b7280;
    font-size: 14px;
  }

  .search-input {
    padding: 10px 14px;
    border-radius: 10px;
    border: 1px solid #d1d5db;
    width: 240px;
  }

  .filter-bar {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 14px;
  }

  .filter-chip {
    border: none;
    padding: 8px 14px;
    border-radius: 999px;
    background: #f3f4f6;
    cursor: pointer;
    transition: 0.2s;
    font-size: 14px;
  }

  .filter-chip.selected {
    background: #ede9fe;
    color: #6d28d9;
    font-weight: 600;
  }

  .section-title {
    margin-top: 28px;
    margin-bottom: 12px;
    font-weight: 700;
    color: #374151;
  }

  .faq-row {
    display: grid;
    grid-template-columns: 40px 120px 1fr 120px 80px 80px 220px;
    gap: 14px;
    align-items: center;
    background: #fafafa;
    border: 1px solid #e5e7eb;
    border-radius: 14px;
    padding: 16px;
    margin-bottom: 10px;
  }

  .draft-row {
    opacity: 0.75;
  }

  .qmark {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: #6b7280;
  }

  .category-tag {
    background: #f3f4f6;
    padding: 6px 10px;
    border-radius: 8px;
    font-size: 12px;
    text-transform: uppercase;
    color: #6b7280;
    width: fit-content;
  }

  .faq-title {
    font-weight: 600;
    margin-bottom: 4px;
  }

  .faq-date {
    color: #6b7280;
    font-size: 13px;
  }

  .status-pill {
    padding: 6px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
  }

  .status-pill.published {
    background: #dcfce7;
    color: #166534;
  }

  .status-pill.draft {
    background: #f3f4f6;
    color: #4b5563;
  }

  .rating {
    font-size: 14px;
  }

  .negative {
    color: #ef4444;
  }

  .actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .actions button {
    border: none;
    background: #f3f4f6;
    padding: 8px 10px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 12px;
  }

  .actions button:hover {
    background: #e5e7eb;
  }

  .actions .danger {
    background: #fee2e2;
    color: #b91c1c;
  }

  .empty-state {
    text-align: center;
    padding: 60px 20px;
  }

  .empty-small {
    color: #6b7280;
    margin-bottom: 14px;
  }

  .new-button {
    background: #7c3aed;
    color: white;
    border: none;
    padding: 12px 18px;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 600;
  }

  .new-button:hover {
    opacity: 0.9;
  }
</style>