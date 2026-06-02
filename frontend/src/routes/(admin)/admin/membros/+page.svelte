<script lang="ts">
  import { getInitials, filterMembers, type Member } from '$lib/utils/membros';
  import MemberFilters from '$lib/components/admin/MemberFilters.svelte';
  import MemberModal from '$lib/components/admin/MemberModal.svelte';
  import { apiFetch } from '$lib/api/backend';
  import { supabase } from '$lib/api/supabase';

  let { data } = $props<{ data: { members: Member[] } }>();

  // Synchronize state with data loaded from server
  let members = $state<Member[]>([]);
  $effect(() => {
    members = data.members;
  });

  // Reactive state for filters
  let filterStatus = $state<'Todos' | 'active' | 'inactive'>('Todos');
  let filterRole = $state<'Todos' | 'owner' | 'member'>('Todos');
  let searchQuery = $state<string>('');

  // Dropdown context menu state
  let activeMenuId = $state<string | null>(null);

  // Member Modal (Add/Edit) state
  let isModalOpen = $state<boolean>(false);
  let modalMember = $state<Partial<Member>>({});
  let isEditing = $state<boolean>(false);

  // Custom Delete Confirmation state
  let isConfirmOpen = $state<boolean>(false);
  let memberToRemove = $state<Member | null>(null);
  let deleting = $state<boolean>(false);

  // Toast Notifications state
  let toastMessage = $state<string>('');
  let toastType = $state<'success' | 'error'>('success');
  let toastTimer: any = null;

  function showToast(message: string, type: 'success' | 'error' = 'success') {
    toastMessage = message;
    toastType = type;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastMessage = '';
    }, 4000);
  }

  // Filtered members list using $derived
  let filteredMembers = $derived(filterMembers(members, filterStatus, filterRole, searchQuery));

  // KPIs dynamically computed from the members array
  let totalActive = $derived(members.filter((m) => m.status === 'active').length);
  let totalInactive = $derived(members.filter((m) => m.status === 'inactive').length);
  let totalOwners = $derived(members.filter((m) => m.role === 'owner').length);

  // Actions
  async function toggleStatus(member: Member) {
    const newStatus = member.status === 'active' ? 'inactive' : 'active';
    try {
      const session = (await supabase.auth.getSession()).data.session;
      if (!session) throw new Error('Sessão expirada. Faça login novamente.');

      await apiFetch(`/api/admin/members/${member.id}/status`, {
        method: 'PATCH',
        token: session.access_token,
        body: JSON.stringify({ status: newStatus }),
      });

      members = members.map((m) => (m.id === member.id ? { ...m, status: newStatus } : m));
      showToast(`Membro ${newStatus === 'active' ? 'ativado' : 'inativado'} com sucesso!`);
    } catch (err: any) {
      showToast(err.message || 'Falha ao atualizar status do membro.', 'error');
    } finally {
      activeMenuId = null;
    }
  }

  function startRemoveMember(member: Member) {
    memberToRemove = member;
    isConfirmOpen = true;
    activeMenuId = null;
  }

  async function confirmRemoveMember() {
    if (!memberToRemove) return;
    deleting = true;
    try {
      const session = (await supabase.auth.getSession()).data.session;
      if (!session) throw new Error('Sessão expirada. Faça login novamente.');

      await apiFetch(`/api/admin/members/${memberToRemove.id}`, {
        method: 'DELETE',
        token: session.access_token,
      });

      members = members.filter((m) => m.id !== memberToRemove!.id);
      showToast('Membro removido com sucesso!');
      isConfirmOpen = false;
      memberToRemove = null;
    } catch (err: any) {
      showToast(err.message || 'Falha ao remover membro.', 'error');
    } finally {
      deleting = false;
    }
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

  async function handleSaveMember(updatedMember: Partial<Member>) {
    const session = (await supabase.auth.getSession()).data.session;
    if (!session) throw new Error('Sessão expirada. Faça login novamente.');

    if (isEditing && updatedMember.id) {
      // Edit Member
      const res = await apiFetch<Member>(`/api/admin/members/${updatedMember.id}`, {
        method: 'PATCH',
        token: session.access_token,
        body: JSON.stringify({
          name: updatedMember.name,
          role: updatedMember.role,
          avatar_url: updatedMember.avatar_url || null,
        }),
      });
      members = members.map((m) => (m.id === updatedMember.id ? res : m));
      showToast('Membro atualizado com sucesso!');
    } else {
      // Create/Invite Member
      const res = await apiFetch<Member>('/api/admin/members', {
        method: 'POST',
        token: session.access_token,
        body: JSON.stringify({
          name: updatedMember.name,
          email: updatedMember.email,
          role: updatedMember.role,
        }),
      });
      members = [...members, res];
      showToast('Membro convidado com sucesso!');
    }

    isModalOpen = false;
  }

  // Close context menus when clicking outside
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

  <!-- Filters Component -->
  <MemberFilters bind:searchQuery bind:filterStatus bind:filterRole />

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
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
        <p>Nenhum membro cadastrado</p>
        <div class="empty-actions">
          <button class="btn-add" onclick={openAddModal}> Adicionar membro </button>
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
                {getInitials(member.name || '')}
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
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                      Editar
                    </button>
                    <button class="menu-item" role="menuitem" onclick={() => toggleStatus(member)}>
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
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="9" y1="9" x2="15" y2="15"></line>
                          <line x1="15" y1="9" x2="9" y2="15"></line>
                        </svg>
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
                          class="menu-ico"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Ativar
                      {/if}
                    </button>
                    <button
                      class="menu-item danger"
                      role="menuitem"
                      onclick={() => startRemoveMember(member)}
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

  <!-- Modal Component -->
  <MemberModal
    isOpen={isModalOpen}
    {isEditing}
    member={modalMember}
    onClose={() => (isModalOpen = false)}
    onSave={handleSaveMember}
  />

  <!-- Delete Confirmation Modal Dialog -->
  {#if isConfirmOpen}
    <div class="modal-overlay">
      <div class="modal confirm-modal" role="dialog" aria-labelledby="confirm-title">
        <header class="modal-header">
          <h3 id="confirm-title">Confirmar Remoção</h3>
          <button
            class="modal-close-btn"
            onclick={() => (isConfirmOpen = false)}
            disabled={deleting}>&times;</button
          >
        </header>
        <div class="modal-body">
          <p>Tem certeza que deseja remover o membro <strong>{memberToRemove?.name}</strong>?</p>
          <p class="warning-text">
            Esta ação irá revogar permanentemente o acesso dele à plataforma.
          </p>
        </div>
        <footer class="modal-footer">
          <button class="btn-cancel" onclick={() => (isConfirmOpen = false)} disabled={deleting}>
            Cancelar
          </button>
          <button class="btn-submit danger-btn" onclick={confirmRemoveMember} disabled={deleting}>
            {deleting ? 'Removendo...' : 'Remover Membro'}
          </button>
        </footer>
      </div>
    </div>
  {/if}

  <!-- Toast Notification -->
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

  /* Panel */
  .panel {
    background-color: var(--bg-elev);
    border: 1px solid var(--line);
    border-radius: 10px;
    padding: 16px;
    overflow-x: auto;
  }

  /* Table styling */
  .data-table {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-width: 600px;
  }

  .data-table .dt-row {
    display: grid;
    grid-template-columns: 44px 1.6fr 2fr 120px 100px 48px;
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

  .status-cell {
    display: flex;
    align-items: center;
  }

  .status-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-sans);
    font-size: 11.5px;
    font-weight: 500;
    text-transform: lowercase;
    padding: 2px 8px;
    border-radius: 999px;
  }

  .status-pill.active {
    background-color: rgba(16, 185, 129, 0.1);
    color: var(--green);
  }

  .status-pill.inactive {
    background-color: var(--bg-soft);
    color: var(--text-faint);
  }

  .status-pill .dt {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: currentColor;
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

  /* Empty state */
  .empty {
    padding: 40px 24px;
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

  /* Modals Overlay (Confirm Modal Specifics) */
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

  /* Toast Notification */
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

  /* Responsive styling */
  @media (max-width: 768px) {
    .data-table .dt-row {
      grid-template-columns: 44px 1.4fr 1.6fr 40px;
      font-size: 12.5px;
    }

    .email-cell,
    .status-cell {
      display: none;
    }

    .modal-overlay {
      padding: 12px;
    }
  }
</style>
