<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { getInitials, filterMembers, formatLastAccess, type Member } from '$lib/utils/membros';
  import MemberModal from '$lib/components/admin/MemberModal.svelte';
  import { apiFetch } from '$lib/api/backend';
  import { topbarActions } from '$lib/stores/topbar';

  let { data } = $props<{ data: { members: Member[]; error?: string; forbidden?: boolean } }>();

  let members = $state<Member[]>([]);
  let loadError = $state<string | undefined>(undefined);
  let forbidden = $state(false);
  $effect(() => {
    members = data.members;
    loadError = data.error;
    forbidden = data.forbidden ?? false;
  });

  let searchQuery = $state('');

  let activeMenuId = $state<string | null>(null);

  let isModalOpen = $state(false);
  let modalMember = $state<Partial<Member>>({});
  let isEditing = $state(false);

  let isConfirmOpen = $state(false);
  let memberToRemove = $state<Member | null>(null);
  let deleting = $state(false);

  let toastMessage = $state('');
  let toastType = $state<'success' | 'error'>('success');
  let toastTimer: ReturnType<typeof setTimeout> | null = null;

  function showToast(message: string, type: 'success' | 'error' = 'success') {
    toastMessage = message;
    toastType = type;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastMessage = '';
    }, 3000);
  }

  let filteredMembers = $derived(filterMembers(members, 'Todos', 'Todos', searchQuery));

  let totalActive = $derived(members.filter((m) => m.status === 'active').length);
  let totalInactive = $derived(members.filter((m) => m.status === 'inactive').length);
  let totalOwners = $derived(members.filter((m) => m.role === 'owner').length);

  const now = Date.now();
  const MS_30D = 30 * 24 * 60 * 60 * 1000;
  const MS_7D = 7 * 24 * 60 * 60 * 1000;

  let recentlyJoined = $derived(
    members.filter((m) => m.created_at && now - new Date(m.created_at).getTime() < MS_30D).length
  );

  let dormant = $derived(
    members.filter(
      (m) =>
        m.status === 'active' &&
        m.last_sign_in_at &&
        now - new Date(m.last_sign_in_at).getTime() > MS_30D
    ).length
  );

  let neverLoggedIn = $derived(
    members.filter((m) => m.status === 'active' && !m.last_sign_in_at).length
  );

  let activeThisWeek = $derived(
    members.filter(
      (m) => m.last_sign_in_at && now - new Date(m.last_sign_in_at).getTime() < MS_7D
    ).length
  );

  let roleBreakdown = $derived(
    members.reduce<Record<string, number>>((acc, m) => {
      const label = m.display_role ?? m.role ?? 'Sem papel';
      acc[label] = (acc[label] ?? 0) + 1;
      return acc;
    }, {})
  );

  let roleEntries = $derived(
    Object.entries(roleBreakdown).sort((a, b) => b[1] - a[1]).slice(0, 6)
  );

  let activeRatio = $derived(members.length ? Math.round((totalActive / members.length) * 100) : 0);

  async function toggleStatus(member: Member) {
    const newStatus = member.status === 'active' ? 'inactive' : 'active';
    try {
      await apiFetch(`/admin/members/${member.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      members = members.map((m) => (m.id === member.id ? { ...m, status: newStatus } : m));
      showToast(`Membro ${newStatus === 'active' ? 'reativado' : 'inativado'} com sucesso!`);
    } catch (err: unknown) {
      showToast(
        err instanceof Error ? err.message : 'Falha ao atualizar status do membro.',
        'error'
      );
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
      await apiFetch(`/admin/members/${memberToRemove.id}`, { method: 'DELETE' });
      members = members.filter((m) => m.id !== memberToRemove!.id);
      showToast('Membro removido com sucesso!');
      isConfirmOpen = false;
      memberToRemove = null;
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Falha ao remover membro.', 'error');
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
      display_role: 'Comercial',
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

  async function handleSaveMember(updated: Partial<Member>) {
    if (isEditing && updated.id) {
      const current = members.find((m) => m.id === updated.id);

      // Update status separately if changed
      if (current?.status !== updated.status && updated.status) {
        await apiFetch(`/admin/members/${updated.id}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status: updated.status }),
        });
      }

      const res = await apiFetch<Member>(`/admin/members/${updated.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name: updated.name,
          role: updated.role,
          display_role: updated.display_role,
          permissions: updated.permissions,
        }),
      });
      members = members.map((m) =>
        m.id === updated.id ? { ...res, status: updated.status ?? res.status } : m
      );
      showToast('Membro atualizado com sucesso!');
    } else {
      const res = await apiFetch<Member>('/admin/members', {
        method: 'POST',
        body: JSON.stringify({
          name: updated.name,
          email: updated.email,
          role: updated.role,
          display_role: updated.display_role,
          permissions: updated.permissions,
        }),
      });
      members = [...members, res];
      showToast('Convite enviado com sucesso!');
    }

    isModalOpen = false;
  }

  function handleOutsideClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (activeMenuId && !target.closest('.menu-container') && !target.closest('.menu-btn')) {
      activeMenuId = null;
    }
  }

  const COL = '44px 1.4fr 1.4fr 130px 100px 80px 40px';

  onMount(() => {
    topbarActions.set([{ label: '+ Cadastrar membro', onClick: openAddModal }]);
  });
  onDestroy(() => {
    topbarActions.set([]);
  });
</script>

<svelte:window onclick={handleOutsideClick} />

<div class="membros-container">
  <!-- Dashboard -->
  <section class="dashboard" aria-label="Visão geral dos membros">
    <!-- Row 1: KPIs principais -->
    <div class="kpi-grid">
      <div class="kpi">
        <div class="kpi-icon active-icon" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        </div>
        <div class="kpi-body">
          <div class="label">Total de membros</div>
          <div class="value">{members.length}</div>
        </div>
      </div>

      <div class="kpi">
        <div class="kpi-icon active-icon" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        </div>
        <div class="kpi-body">
          <div class="label">Ativos</div>
          <div class="value green">{totalActive}</div>
          <div class="kpi-bar-wrap" title="{activeRatio}% do total">
            <div class="kpi-bar" style="width:{activeRatio}%;background:var(--green)"></div>
          </div>
        </div>
      </div>

      <div class="kpi">
        <div class="kpi-icon inactive-icon" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
        </div>
        <div class="kpi-body">
          <div class="label">Inativos</div>
          <div class="value muted">{totalInactive}</div>
        </div>
      </div>

      <div class="kpi">
        <div class="kpi-icon owner-icon" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        </div>
        <div class="kpi-body">
          <div class="label">Owners</div>
          <div class="value pink">{totalOwners}</div>
        </div>
      </div>
    </div>

    <!-- Row 2: Atividade + Papéis -->
    <div class="insight-grid">
      <!-- Atividade -->
      <div class="insight-card">
        <div class="insight-title">Atividade</div>
        <div class="insight-rows">
          <div class="insight-row">
            <span class="ir-label">Ativos esta semana</span>
            <span class="ir-val green">{activeThisWeek}</span>
          </div>
          <div class="insight-row">
            <span class="ir-label">Cadastrados nos últimos 30 dias</span>
            <span class="ir-val purple">{recentlyJoined}</span>
          </div>
          <div class="insight-row">
            <span class="ir-label">Sem login há mais de 30 dias</span>
            <span class="ir-val {dormant > 0 ? 'warn' : 'muted'}">{dormant}</span>
          </div>
          <div class="insight-row">
            <span class="ir-label">Nunca fizeram login (ativos)</span>
            <span class="ir-val {neverLoggedIn > 0 ? 'warn' : 'muted'}">{neverLoggedIn}</span>
          </div>
        </div>
      </div>

      <!-- Distribuição de papéis -->
      <div class="insight-card">
        <div class="insight-title">Distribuição por papel</div>
        {#if roleEntries.length === 0}
          <div class="insight-empty">Nenhum membro cadastrado</div>
        {:else}
          <div class="role-bars">
            {#each roleEntries as [role, count]}
              {@const pct = members.length ? Math.round((count / members.length) * 100) : 0}
              <div class="rb-row">
                <span class="rb-label">{role}</span>
                <div class="rb-bar-wrap">
                  <div class="rb-bar" style="width:{pct}%"></div>
                </div>
                <span class="rb-count">{count}</span>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </section>

  {#if forbidden}
    <div class="load-error" role="alert">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
      </svg>
      <span>Acesso negado — você não tem permissão para visualizar membros.</span>
    </div>
  {:else if loadError}
    <div class="load-error" role="alert">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        ><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line
          x1="12"
          y1="16"
          x2="12.01"
          y2="16"
        ></line></svg
      >
      <span>Erro ao carregar membros: {loadError}</span>
    </div>
  {/if}

  <!-- Content Panel -->
  <main class="panel">
    <div class="panel-head">
      <h3>{members.length} membros</h3>
      <span class="grow"></span>
      <div class="admin-search" style="width: 240px;">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          placeholder="nome, e-mail, papel…"
          bind:value={searchQuery}
          aria-label="Pesquisar membros"
        />
      </div>
    </div>

    {#if filteredMembers.length === 0}
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
        <p>Nenhum membro encontrado</p>
        {#if !searchQuery}
          <div class="empty-actions">
            <button class="btn-add" onclick={openAddModal}>Adicionar membro</button>
          </div>
        {/if}
      </div>
    {:else}
      <div class="data-table" role="table" aria-label="Tabela de membros">
        <div class="dt-row header" role="row" style="grid-template-columns: {COL}">
          <span></span>
          <span>Membro</span>
          <span>E-mail</span>
          <span>Papel</span>
          <span>Último acesso</span>
          <span>Status</span>
          <span></span>
        </div>

        {#each filteredMembers as member (member.id)}
          <div class="dt-row" role="row" style="grid-template-columns: {COL}">
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

            <!-- Papel -->
            <span class="role-cell">
              <span class="role-chip" class:owner={member.role === 'owner'}>
                {member.display_role ?? member.role}
              </span>
            </span>

            <!-- Último acesso -->
            <span class="last-cell mono">{formatLastAccess(member.last_sign_in_at)}</span>

            <!-- Status -->
            <span class="status-cell">
              <span class="status-pill {member.status}">
                <span class="dt"></span>
                {member.status === 'active' ? 'ativo' : 'inativo'}
              </span>
            </span>

            <!-- Menu -->
            <span class="actions-cell">
              <div class="action-wrapper">
                <button
                  class="menu-btn"
                  aria-label="Ações para {member.name}"
                  onclick={() => (activeMenuId = activeMenuId === member.id ? null : member.id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="5" r="1.5"></circle>
                    <circle cx="12" cy="12" r="1.5"></circle>
                    <circle cx="12" cy="19" r="1.5"></circle>
                  </svg>
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
                        <circle cx="12" cy="12" r="3"></circle>
                        <path
                          d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
                        ></path>
                      </svg>
                      Editar perfil & permissões
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
                        Inativar membro
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
                        Reativar
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
                      </svg>
                      Remover do painel
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

  <!-- Member Modal -->
  <MemberModal
    isOpen={isModalOpen}
    {isEditing}
    member={modalMember}
    onClose={() => (isModalOpen = false)}
    onSave={handleSaveMember}
  />

  <!-- Delete Confirmation Dialog -->
  {#if isConfirmOpen}
    <div class="admin-overlay" style="z-index: 110;" role="presentation">
      <div
        class="admin-modal danger-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        style="max-width: 400px;"
      >
        <header class="admin-modal-head">
          <h3 id="confirm-title">Remover membro</h3>
          <button
            class="x"
            type="button"
            onclick={() => (isConfirmOpen = false)}
            disabled={deleting}
            aria-label="Fechar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </header>
        <div class="admin-modal-body">
          <div class="danger-icon" aria-hidden="true">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="3 6 5 6 21 6"></polyline>
              <path
                d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
              ></path>
            </svg>
          </div>
          <h4>Confirmar remoção</h4>
          <p>
            Esta ação irá revogar permanentemente o acesso à plataforma e não pode ser desfeita.
          </p>
          <div class="name-confirm">
            <span class="lbl">membro</span>
            <span class="val">{memberToRemove?.name}</span>
          </div>
        </div>
        <footer class="admin-modal-foot">
          <button
            class="btn ghost sm"
            type="button"
            onclick={() => (isConfirmOpen = false)}
            disabled={deleting}
          >
            Cancelar
          </button>
          <button
            class="btn-danger"
            type="button"
            onclick={confirmRemoveMember}
            disabled={deleting}
          >
            {deleting ? 'Removendo...' : 'Remover definitivamente'}
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
  .membros-container {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  /* Dashboard */
  .dashboard {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  /* KPI Grid */
  .kpi-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 12px;
  }

  .kpi {
    background-color: var(--bg-elev);
    border: 1px solid var(--line);
    border-radius: 10px;
    padding: 14px 16px;
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }

  .kpi-icon {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    display: grid;
    place-items: center;
    flex-shrink: 0;
  }

  .active-icon { background: rgba(16, 185, 129, 0.1); color: var(--green); }
  .inactive-icon { background: var(--bg-soft); color: var(--text-muted); }
  .owner-icon { background: rgba(231, 31, 132, 0.1); color: var(--pink); }

  .kpi-body {
    flex: 1;
    min-width: 0;
  }

  .kpi .label {
    font-size: 11.5px;
    color: var(--text-muted);
    font-weight: 500;
    margin-bottom: 4px;
  }

  .kpi .value {
    font-size: 24px;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--text);
    line-height: 1;
  }

  .kpi .value.green { color: var(--green); }
  .kpi .value.pink { color: var(--pink); }
  .kpi .value.muted { color: var(--text-faint); }

  .kpi-bar-wrap {
    height: 3px;
    background: var(--line);
    border-radius: 2px;
    margin-top: 6px;
    overflow: hidden;
  }

  .kpi-bar {
    height: 100%;
    border-radius: 2px;
    transition: width 0.4s ease;
  }

  /* Insight grid */
  .insight-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  @media (max-width: 680px) {
    .insight-grid { grid-template-columns: 1fr; }
  }

  .insight-card {
    background: var(--bg-elev);
    border: 1px solid var(--line);
    border-radius: 10px;
    padding: 16px;
  }

  .insight-title {
    font-family: var(--font-mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text-faint);
    font-weight: 600;
    margin-bottom: 14px;
  }

  .insight-rows {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .insight-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .ir-label {
    font-size: 12.5px;
    color: var(--text-muted);
  }

  .ir-val {
    font-family: var(--font-mono);
    font-size: 14px;
    font-weight: 700;
    flex-shrink: 0;
  }

  .ir-val.green { color: var(--green); }
  .ir-val.purple { color: var(--purple); }
  .ir-val.warn { color: #f59e0b; }
  .ir-val.muted { color: var(--text-faint); }

  .role-bars {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .rb-row {
    display: grid;
    grid-template-columns: 100px 1fr 28px;
    align-items: center;
    gap: 8px;
  }

  .rb-label {
    font-size: 12px;
    color: var(--text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .rb-bar-wrap {
    height: 6px;
    background: var(--line);
    border-radius: 3px;
    overflow: hidden;
  }

  .rb-bar {
    height: 100%;
    background: linear-gradient(90deg, var(--purple), var(--pink));
    border-radius: 3px;
    transition: width 0.4s ease;
    min-width: 4px;
  }

  .rb-count {
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 600;
    color: var(--text-muted);
    text-align: right;
  }

  .insight-empty {
    font-size: 12.5px;
    color: var(--text-faint);
    padding: 8px 0;
  }

  .load-error {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(239, 68, 68, 0.08);
    border: 1px solid rgba(239, 68, 68, 0.25);
    border-radius: 8px;
    padding: 10px 14px;
    color: #ef4444;
    font-size: 13px;
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
    flex-shrink: 0;
  }

  .name-cell {
    font-size: 13px;
    font-weight: 500;
    color: var(--text);
  }

  .email-cell {
    font-size: 11.5px;
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
    font-size: 11px;
    color: var(--text-faint);
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
    min-width: 180px;
    z-index: 50;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: 10px;
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
    flex-shrink: 0;
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

  /* Disabled states */
  :global(.btn-danger:disabled) {
    opacity: 0.5;
    cursor: not-allowed;
  }

  :global(.btn.ghost.sm:disabled),
  :global(.btn.sm:disabled) {
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

  @media (max-width: 768px) {
    .data-table {
      overflow-x: auto;
    }
  }
</style>
