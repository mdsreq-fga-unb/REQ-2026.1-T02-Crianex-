<script lang="ts">
  import { onMount } from 'svelte';
  import { getInitials, filterMembers, type Member } from '$lib/utils/membros';

  // Dados mockados iniciais
  const INITIAL_MEMBERS: Member[] = [
    {
      id: '1',
      name: 'Marina Pereira',
      email: 'marina@crianex.com.br',
      initials: 'MP',
      role: 'owner',
      status: 'active',
      last: 'Agora',
    },
    {
      id: '2',
      name: 'Ricardo Lopes',
      email: 'ricardo@crianex.com.br',
      initials: 'RL',
      role: 'member',
      status: 'active',
      last: '12m atrás',
    },
    {
      id: '3',
      name: 'Joana Velasco',
      email: 'joana@crianex.com.br',
      initials: 'JV',
      role: 'member',
      status: 'active',
      last: '2h atrás',
    },
    {
      id: '4',
      name: 'Tiago Albuquerque',
      email: 'tiago@crianex.com.br',
      initials: 'TA',
      role: 'member',
      status: 'inactive',
      last: '5d atrás',
    },
  ];

  // Svelte 5 Runes para Estado Reativo
  let members = $state<Member[]>([...INITIAL_MEMBERS]);
  let filterStatus = $state<'Todos' | 'active' | 'inactive'>('Todos');
  let filterRole = $state<'Todos' | 'owner' | 'member'>('Todos');
  let searchQuery = $state<string>('');

  // Controle de Menus de Linha e Modais
  let activeMenuId = $state<string | null>(null);
  let isModalOpen = $state<boolean>(false);
  let modalMember = $state<Partial<Member>>({});
  let isEditing = $state<boolean>(false);

  // Lista filtrada reativa via $derived
  let filteredMembers = $derived(filterMembers(members, filterStatus, filterRole, searchQuery));

  // KPI calculados dinamicamente
  let totalActive = $derived(members.filter((m) => m.status === 'active').length);
  let totalInactive = $derived(members.filter((m) => m.status === 'inactive').length);
  let totalOwners = $derived(members.filter((m) => m.role === 'owner').length);

  // Ações de gerenciamento de membros
  function toggleStatus(id: string) {
    members = members.map((m) =>
      m.id === id ? { ...m, status: m.status === 'active' ? 'inactive' : 'active' } : m
    );
    activeMenuId = null;
  }

  function removeMember(id: string) {
    if (confirm('Tem certeza que deseja remover este membro?')) {
      members = members.filter((m) => m.id !== id);
    }
    activeMenuId = null;
  }

  function openAddModal() {
    isEditing = false;
    modalMember = {
      name: '',
      email: '',
      role: 'member',
      status: 'active',
    };
    isModalOpen = true;
  }

  function openEditModal(member: Member) {
    isEditing = true;
    modalMember = { ...member };
    isModalOpen = true;
    activeMenuId = null;
  }

  function saveMember() {
    if (!modalMember.name || !modalMember.email) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (!modalMember.email.includes('@')) {
      alert('Por favor, insira um e-mail válido.');
      return;
    }

    if (isEditing && modalMember.id) {
      // Editar existente
      members = members.map((m) =>
        m.id === modalMember.id
          ? {
              ...(modalMember as Member),
              initials: getInitials(modalMember.name || ''),
            }
          : m
      );
    } else {
      // Cadastrar novo
      const newMember: Member = {
        id: Date.now().toString(),
        name: modalMember.name || '',
        email: modalMember.email || '',
        initials: getInitials(modalMember.name || ''),
        role: modalMember.role || 'member',
        status: modalMember.status || 'active',
        last: 'Nunca acessou',
      };
      members = [...members, newMember];
    }

    isModalOpen = false;
  }

  function restoreDefaultMembers() {
    members = [...INITIAL_MEMBERS];
  }

  // Fechar o menu de contexto ao clicar fora
  function handleOutsideClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (activeMenuId && !target.closest('.menu-container') && !target.closest('.menu-btn')) {
      activeMenuId = null;
    }
  }
</script>

<svelte:window onclick={handleOutsideClick} />

<div class="membros-container">
  <!-- Topbar -->
  <header class="admin-topbar">
    <div class="crumbs" aria-label="Navegação de contexto">
      <span>/ operações</span>
      <span class="active-crumb">/ membros</span>
    </div>
    <div class="header-action-group">
      {#if members.length > 0}
        <button class="btn-restore" onclick={restoreDefaultMembers}> Restaurar Originais </button>
      {/if}
      <button class="btn-add" onclick={openAddModal}>
        <span>+</span> Cadastrar membro
      </button>
    </div>
  </header>

  <!-- KPIs -->
  <section class="kpis-grid" aria-label="Indicadores chave dos membros">
    <div class="kpi-card">
      <span class="kpi-label">Membros Ativos</span>
      <span class="kpi-value">{totalActive}</span>
    </div>
    <div class="kpi-card">
      <span class="kpi-label">Inativos</span>
      <span class="kpi-value inactive">{totalInactive}</span>
    </div>
    <div class="kpi-card">
      <span class="kpi-label">Owners</span>
      <span class="kpi-value">{totalOwners}</span>
    </div>
    <div class="kpi-card">
      <span class="kpi-label">Total Cadastrado</span>
      <span class="kpi-value">{members.length}</span>
    </div>
  </section>

  <!-- Search and Filter Bar -->
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
        ><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"
        ></line></svg
      >
      <input type="text" placeholder="Buscar por nome ou e-mail..." bind:value={searchQuery} />
    </div>

    <div class="filter-bar">
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
          class:on={filterStatus === 'active'}
          onclick={() => (filterStatus = 'active')}
        >
          Ativos
        </button>
        <button
          class="filter-chip"
          class:on={filterStatus === 'inactive'}
          onclick={() => (filterStatus = 'inactive')}
        >
          Inativos
        </button>
      </div>

      <!-- Filtro de Papel -->
      <div class="filter-group">
        <span class="filter-label">Papel:</span>
        <button
          class="filter-chip"
          class:on={filterRole === 'Todos'}
          onclick={() => (filterRole = 'Todos')}
        >
          Todos
        </button>
        <button
          class="filter-chip"
          class:on={filterRole === 'owner'}
          onclick={() => (filterRole = 'owner')}
        >
          Owner
        </button>
        <button
          class="filter-chip"
          class:on={filterRole === 'member'}
          onclick={() => (filterRole = 'member')}
        >
          Member
        </button>
      </div>
    </div>
  </section>

  <!-- Content Panel / Table -->
  <main class="panel">
    {#if filteredMembers.length === 0}
      <!-- Empty State -->
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
          ><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"
          ></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"
          ></path></svg
        >
        <p>Nenhum membro cadastrado</p>
        <div class="empty-actions">
          <button class="btn-add" onclick={openAddModal}> Adicionar membro </button>
          {#if members.length === 0}
            <button class="btn-restore" onclick={restoreDefaultMembers}>
              Restaurar Lista Padrão
            </button>
          {/if}
        </div>
      </div>
    {:else}
      <!-- Data Table -->
      <div class="data-table" role="table" aria-label="Tabela de membros">
        <div class="dt-row header" role="row">
          <span></span>
          <span>Membro</span>
          <span>E-mail</span>
          <span>Papel</span>
          <span>Último Acesso</span>
          <span>Status</span>
          <span>Ações</span>
        </div>

        {#each filteredMembers as member (member.id)}
          <div class="dt-row" role="row">
            <!-- Avatar -->
            <span class="avatar-cell">
              <span
                class="avatar"
                style="background: {member.status === 'active'
                  ? 'linear-gradient(135deg, var(--purple), var(--pink))'
                  : 'var(--bg-soft)'}; color: {member.status === 'active'
                  ? '#ffffff'
                  : 'var(--text-muted)'};"
              >
                {member.initials}
              </span>
            </span>

            <!-- Nome -->
            <span class="name-cell">{member.name}</span>

            <!-- E-mail -->
            <span class="email-cell mono">{member.email}</span>

            <!-- Role Chip -->
            <span class="role-cell">
              <span class="role-chip" class:owner={member.role === 'owner'}>
                {member.role}
              </span>
            </span>

            <!-- Última Atividade -->
            <span class="last-cell">{member.last}</span>

            <!-- Status Pill -->
            <span class="status-cell">
              <span class="status-pill {member.status}">
                <span class="dt"></span>
                {member.status === 'active' ? 'ativo' : 'inativo'}
              </span>
            </span>

            <!-- Menu de Ações -->
            <span class="actions-cell">
              <div class="action-wrapper">
                <button
                  class="menu-btn"
                  aria-label="Ações para {member.name}"
                  onclick={() => (activeMenuId = activeMenuId === member.id ? null : member.id)}
                >
                  ⋯
                </button>

                {#if activeMenuId === member.id}
                  <div class="menu-container" role="menu">
                    <button class="menu-item" role="menuitem" onclick={() => openEditModal(member)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="menu-ico"
                        ><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                        ></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                        ></path></svg
                      >
                      Editar
                    </button>
                    <button
                      class="menu-item"
                      role="menuitem"
                      onclick={() => toggleStatus(member.id)}
                    >
                      {#if member.status === 'active'}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="menu-ico"
                          ><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line
                            x1="9"
                            y1="9"
                            x2="15"
                            y2="15"
                          ></line><line x1="15" y1="9" x2="9" y2="15"></line></svg
                        >
                        Inativar
                      {:else}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="menu-ico"><polyline points="20 6 9 17 4 12"></polyline></svg
                        >
                        Ativar
                      {/if}
                    </button>
                    <button
                      class="menu-item danger"
                      role="menuitem"
                      onclick={() => removeMember(member.id)}
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
                        ><polyline points="3 6 5 6 21 6"></polyline><path
                          d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                        ></path><line x1="10" y1="11" x2="10" y2="17"></line><line
                          x1="14"
                          y1="11"
                          x2="14"
                          y2="17"
                        ></line></svg
                      >
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

  <!-- Modal Editor (Add/Edit) -->
  {#if isModalOpen}
    <div class="modal-overlay">
      <div class="modal" role="dialog" aria-labelledby="modal-title">
        <header class="modal-header">
          <h3 id="modal-title">{isEditing ? 'Editar Membro' : 'Cadastrar Membro'}</h3>
          <button class="modal-close-btn" onclick={() => (isModalOpen = false)}>&times;</button>
        </header>

        <form
          class="modal-body"
          onsubmit={(e) => {
            e.preventDefault();
            saveMember();
          }}
        >
          <div class="fld">
            <label for="name">Nome Completo *</label>
            <input
              type="text"
              id="name"
              placeholder="ex. Marina Pereira"
              bind:value={modalMember.name}
              required
            />
          </div>

          <div class="fld">
            <label for="email">E-mail Corporativo *</label>
            <input
              type="email"
              id="email"
              placeholder="nome@crianex.com.br"
              bind:value={modalMember.email}
              required
            />
          </div>

          <div class="fld-row">
            <div class="fld">
              <label for="role">Papel de Acesso *</label>
              <select id="role" bind:value={modalMember.role}>
                <option value="member">Member</option>
                <option value="owner">Owner</option>
              </select>
            </div>

            <div class="fld">
              <label for="status">Status *</label>
              <select id="status" bind:value={modalMember.status}>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>
          </div>

          <footer class="modal-footer">
            <button type="button" class="btn-cancel" onclick={() => (isModalOpen = false)}>
              Cancelar
            </button>
            <button type="submit" class="btn-submit">
              {isEditing ? 'Salvar Alterações' : 'Cadastrar e Enviar Convite'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  {/if}
</div>

<style>
  .membros-container {
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
    display: flex;
    align-items: center;
    gap: 6px;
    transition:
      background-color 0.2s,
      transform 0.15s;
  }

  .btn-add:hover {
    background-color: var(--purple);
    color: #ffffff;
  }

  .btn-restore {
    background-color: transparent;
    color: var(--text-muted);
    border: 1px solid var(--line);
    border-radius: 999px;
    padding: 8px 16px;
    font-size: 13.5px;
    font-weight: 500;
    cursor: pointer;
    transition:
      border-color 0.2s,
      color 0.2s;
  }

  .btn-restore:hover {
    border-color: var(--line-strong);
    color: var(--text);
  }

  /* KPIs Grid */
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
    font-family: var(--font-sans);
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

  .kpi-value.inactive {
    color: var(--text-faint);
  }

  /* Search & Filter section */
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

  .filter-group {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .filter-label {
    font-size: 12px;
    color: var(--text-muted);
    font-weight: 500;
    margin-right: 4px;
  }

  /* Panel */
  .panel {
    background-color: var(--bg-elev);
    border: 1px solid var(--line);
    border-radius: 10px;
    padding: 16px;
    overflow-x: auto;
  }

  /* Table styling overrides & specifics */
  .data-table .dt-row {
    grid-template-columns: 44px 1.4fr 1.6fr 110px 120px 80px 48px;
  }

  .avatar-cell {
    display: flex;
    align-items: center;
  }

  .avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 600;
  }

  .name-cell {
    font-weight: 500;
    color: var(--text);
  }

  .email-cell {
    color: var(--text-muted);
  }

  .role-cell {
    display: flex;
    align-items: center;
  }

  .role-chip {
    font-family: var(--font-mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 2px 6px;
    background-color: var(--bg-soft);
    color: var(--text-muted);
    border-radius: 4px;
  }

  .role-chip.owner {
    background-color: rgba(231, 31, 132, 0.12);
    color: var(--pink);
  }

  .last-cell {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-faint);
  }

  .status-cell {
    display: flex;
    align-items: center;
  }

  .actions-cell {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .action-wrapper {
    position: relative;
  }

  /* Actions Context Menu */
  .menu-container {
    position: absolute;
    right: 0;
    top: 100%;
    background-color: var(--bg-elev);
    border: 1px solid var(--line);
    border-radius: 8px;
    padding: 4px;
    box-shadow: var(--shadow-3);
    min-width: 140px;
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
    color: currentColor;
  }

  /* Empty state details */
  .empty-icon {
    width: 48px;
    height: 48px;
    color: var(--text-faint);
  }

  .empty-actions {
    display: flex;
    gap: 10px;
    margin-top: 6px;
  }

  /* Modals */
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
    max-width: 520px;
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
    gap: 16px;
  }

  .fld {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .fld label {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    text-transform: uppercase;
    font-weight: 600;
  }

  .fld input,
  .fld select {
    background-color: var(--bg);
    border: 1px solid var(--line);
    border-radius: 6px;
    padding: 10px 12px;
    font-family: inherit;
    font-size: 13.5px;
    color: var(--text);
    outline: none;
    transition: border-color 0.2s;
  }

  .fld input:focus,
  .fld select:focus {
    border-color: var(--purple);
  }

  .fld-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding-top: 8px;
    border-top: 1px solid var(--line);
    margin-top: 12px;
  }

  .btn-cancel {
    background: transparent;
    color: var(--text-muted);
    border: 1px solid var(--line);
    border-radius: 6px;
    padding: 10px 16px;
    font-size: 13.5px;
    font-weight: 500;
    cursor: pointer;
    transition:
      border-color 0.2s,
      color 0.2s;
  }

  .btn-cancel:hover {
    border-color: var(--line-strong);
    color: var(--text);
  }

  .btn-submit {
    background-color: #ffffff;
    color: #101010;
    border: none;
    border-radius: 6px;
    padding: 10px 16px;
    font-size: 13.5px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .btn-submit:hover {
    background-color: var(--purple);
    color: #ffffff;
  }

  /* Responsive styling */
  @media (max-width: 768px) {
    .data-table .dt-row {
      grid-template-columns: 44px 1fr 1fr 40px;
      font-size: 12.5px;
    }

    .email-cell,
    .last-cell,
    .status-cell {
      display: none;
    }

    .modal-overlay {
      padding: 12px;
    }

    .fld-row {
      grid-template-columns: 1fr;
    }
  }
</style>
