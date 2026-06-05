<script lang="ts">
  let {
    searchQuery = $bindable(''),
    filterCategory = $bindable('Todos'),
    filterStatus = $bindable('Todos'),
    categories = [],
  } = $props<{
    searchQuery: string;
    filterCategory: string;
    filterStatus: 'Todos' | 'published' | 'draft';
    categories: string[];
  }>();
</script>

<section class="search-filter-section" aria-label="Filtros e Busca">
  <div class="search-box">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="search-icon"
    >
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
    <input type="text" placeholder="Buscar por título..." bind:value={searchQuery} />
  </div>

  <div class="filter-bar">
    <!-- Filtro de Categoria -->
    <div class="filter-group">
      <span class="filter-label">Categoria:</span>
      <button
        class="filter-chip"
        class:on={filterCategory === 'Todos'}
        onclick={() => (filterCategory = 'Todos')}
      >
        Todos
      </button>
      {#each categories as cat}
        <button
          class="filter-chip"
          class:on={filterCategory === cat}
          onclick={() => (filterCategory = cat)}
        >
          {cat}
        </button>
      {/each}
    </div>

    <!-- Filtro de Status -->
    <div class="filter-group">
      <span class="filter-label">Status:</span>
      <button
        class="filter-chip"
        class:on={filterStatus === 'Todos'}
        onclick={() => (filterStatus = 'Todos')}
      >
        Todos
      </button>
      <button
        class="filter-chip"
        class:on={filterStatus === 'published'}
        onclick={() => (filterStatus = 'published')}
      >
        Publicados
      </button>
      <button
        class="filter-chip"
        class:on={filterStatus === 'draft'}
        onclick={() => (filterStatus = 'draft')}
      >
        Rascunho
      </button>
    </div>
  </div>
</section>

<style>
  .search-filter-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .search-box {
    position: relative;
    width: 100%;
    max-width: 420px;
  }

  .search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 14px;
    height: 14px;
    color: var(--text-muted);
    pointer-events: none;
  }

  .search-box input {
    width: 100%;
    background-color: var(--bg-elev);
    border: 1px solid var(--line);
    border-radius: 8px;
    padding: 10px 12px 10px 36px;
    font-family: inherit;
    font-size: 13.5px;
    color: var(--text);
    outline: none;
    transition: border-color 0.2s;
  }

  .search-box input:focus {
    border-color: var(--purple);
  }

  .filter-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }

  .filter-group {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
  }

  .filter-label {
    font-size: 12px;
    color: var(--text-muted);
    font-weight: 500;
    margin-right: 4px;
  }

  .filter-chip {
    background-color: var(--bg-soft);
    color: var(--text-muted);
    border: 1px solid transparent;
    border-radius: 999px;
    padding: 4px 12px;
    font-size: 12.5px;
    font-weight: 500;
    cursor: pointer;
    transition:
      background-color 0.15s,
      color 0.15s,
      border-color 0.15s;
  }

  .filter-chip:hover {
    background-color: var(--bg-elev);
    color: var(--text);
  }

  .filter-chip.on {
    background-color: rgba(168, 85, 247, 0.1);
    color: var(--purple);
    border-color: rgba(168, 85, 247, 0.3);
  }
</style>
