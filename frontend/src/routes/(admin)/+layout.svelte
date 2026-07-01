<script lang="ts">
  import '../../app.css';
  import { page } from '$app/stores';
  import {
    Users,
    Package,
    CircleQuestionMark,
    FileText,
    ChartBar,
    Ticket,
    Bell,
    Search,
    Menu,
    X,
    LayoutDashboard,
    ShieldCheck,
    Shield,
    Check,
    SidebarClose,
    SidebarOpen,
    House,
  } from 'lucide-svelte';
  import type { LayoutData } from './$types';
  import { topbarActions } from '$lib/stores/topbar';
  import { unreadCount } from '$lib/stores/notifications';
  import ProfileModal from '$lib/components/admin/ProfileModal.svelte';
  import { apiFetch } from '$lib/api/backend';
  import {
    groupByDay,
    relativeTime,
    iconForTipo,
    setStatus,
    type Notification,
  } from '$lib/utils/notifications';

  const NOTIF_ICONS = { users: Users, shield: Shield, check: Check, bell: Bell } as const;

  export let data: LayoutData;

  // Mantém o badge global (topbar + sidebar) em sincronia com o contador do backend.
  $: unreadCount.set(data.unreadCount ?? 0);

  const NAO_IMPL = '/nao-implementado';

  const navGroups = [
    {
      label: 'Geral',
      items: [
        { href: NAO_IMPL, label: 'Dashboard', icon: LayoutDashboard, module: 'dashboard' },
        { href: '/admin/crm', label: 'CRM · Leads', icon: Users, module: 'crm' },
        { href: NAO_IMPL, label: 'Financeiro', icon: ChartBar, module: 'finance' },
      ],
    },
    {
      label: 'Vitrine',
      items: [
        { href: '/admin/products', label: 'Produtos', icon: Package, module: 'products' },
        { href: '/admin/gestao-faq', label: 'Gestão FAQ', icon: CircleQuestionMark, module: 'faq' },
      ],
    },
    {
      label: 'Operações',
      items: [
        { href: NAO_IMPL, label: 'Tickets', icon: Ticket, module: 'tickets' },
        { href: NAO_IMPL, label: 'Logs de Produtos', icon: FileText, module: 'productLogs' },
        { href: '/admin/notificacoes', label: 'Notificações', icon: Bell, module: 'notifications' },
        {
          href: '/admin/notification-templates',
          label: 'Templates de Notificações',
          icon: FileText,
          module: 'notifications',
        },
        { href: '/admin/membros', label: 'Membros', icon: Users, module: 'members' },
        { href: NAO_IMPL, label: 'Auditoria', icon: ShieldCheck, module: 'auditLogs' },
      ],
    },
  ];

  let sidebarOpen = false;
  let sidebarCollapsed = false;
  let profileModalOpen = false;

  // local reactive copy so sidebar updates after save without page reload
  let currentProfile = {
    id: data.adminUser.id ?? '',
    name: data.adminUser.name ?? 'Admin',
    email: data.adminUser.email ?? '',
    role: data.adminUser.role ?? 'member',
    display_role: data.adminUser.display_role ?? null,
    status: data.adminUser.status ?? 'active',
    phone: data.adminUser.phone ?? null,
    bio: data.adminUser.bio ?? null,
    avatar_url: data.adminUser.avatar_url ?? null,
    permissions: data.adminUser.permissions ?? (null as Record<string, string[]> | null),
  };

  function canView(module: string): boolean {
    if (currentProfile.role === 'owner') return true;
    const perms = currentProfile.permissions;
    return Array.isArray(perms?.[module]) && perms[module].includes('v');
  }

  $: pathname = $page.url.pathname;

  $: activeLabel = (() => {
    if (pathname === NAO_IMPL) return 'Em Desenvolvimento';
    if (pathname.startsWith('/admin/painel')) return 'Início';
    for (const group of navGroups) {
      for (const item of group.items) {
        if (item.href !== NAO_IMPL && pathname.startsWith(item.href)) return item.label;
      }
    }
    return 'Painel';
  })();

  $: activeCrumb = `admin / ${activeLabel.toLowerCase()}`;

  $: userInitials = (currentProfile.name || 'A')
    .split(' ')
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  function isActive(href: string): boolean {
    if (href === NAO_IMPL) return false;
    return pathname === href || pathname.startsWith(href + '/');
  }

  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }
  function closeSidebar() {
    sidebarOpen = false;
  }

  function openProfile() {
    profileModalOpen = true;
  }

  function handleProfileSave(updated: typeof currentProfile) {
    currentProfile = { ...currentProfile, ...updated };
  }

  // ── Popup de notificações (sino do topbar) ──────────────────────────────
  // Abre uma lista das notificações mais recentes em um popover, em vez de
  // redirecionar para a página /admin/notificacoes (que continua existindo
  // para o histórico completo, acessível pelo link "Ver todas" no rodapé).
  let notifOpen = false;
  let notifLoaded = false;
  let notifLoading = false;
  let notifError = '';
  let notifItems: Notification[] = [];
  let notifPending = new Set<string>();

  const NOTIF_PREVIEW_LIMIT = 8;
  $: notifGroups = groupByDay(notifItems.slice(0, NOTIF_PREVIEW_LIMIT));

  async function toggleNotifPopover() {
    notifOpen = !notifOpen;
    if (notifOpen && !notifLoaded) {
      notifLoading = true;
      notifError = '';
      try {
        const res = await apiFetch<{ notifications: Notification[] }>('/admin/notifications');
        notifItems = res.notifications ?? [];
        notifLoaded = true;
      } catch {
        notifError = 'Não foi possível carregar as notificações.';
      } finally {
        notifLoading = false;
      }
    }
  }

  function closeNotifPopover() {
    notifOpen = false;
  }

  async function markNotifRead(n: Notification) {
    if (n.status === 'read' || notifPending.has(n.id)) return;

    notifPending = new Set(notifPending).add(n.id);
    notifItems = setStatus(notifItems, n.id, 'read');
    unreadCount.update((c) => Math.max(0, c - 1));

    try {
      await apiFetch(`/admin/notifications/${n.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'read' }),
      });
    } catch {
      notifItems = setStatus(notifItems, n.id, 'unread');
      unreadCount.update((c) => c + 1);
    } finally {
      const next = new Set(notifPending);
      next.delete(n.id);
      notifPending = next;
    }
  }

  function humanizeTipo(tipo: string): string {
    const s = tipo.replace(/_/g, ' ').trim();
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
</script>

<div
  class="admin-root admin-shell"
  class:sidebar-open={sidebarOpen}
  class:sidebar-collapsed={sidebarCollapsed}
>
  <button
    class="admin-sidebar-backdrop"
    on:click={closeSidebar}
    on:keydown={(e) => e.key === 'Escape' && closeSidebar()}
    aria-label="Fechar menu"
    tabindex="-1"
  ></button>

  <aside class="admin-sidebar" aria-label="Menu de navegação">
    <div class="sidebar-brand-row">
      {#if !sidebarCollapsed}
        <a href="/admin" class="brand" on:click={closeSidebar}>
          <svg viewBox="0 0 90 80" width="22" height="20" aria-hidden="true" class="brand-svg">
            <polygon fill="#E71F84" points="5,5 33,5 45,37 17,37" />
            <polygon fill="#66DF7A" points="57,5 85,5 73,37 45,37" />
            <polygon fill="#FCFCFC" points="17,43 45,43 33,75 5,75" />
            <polygon fill="#7F3FE5" points="45,43 73,43 85,75 57,75" />
          </svg>
          <span class="brand-label">Crianex</span>
        </a>
      {/if}
      <button
        class="collapse-btn desktop-only"
        class:collapse-btn-solo={sidebarCollapsed}
        type="button"
        title={sidebarCollapsed ? 'Expandir menu' : 'Retrair menu'}
        aria-label={sidebarCollapsed ? 'Expandir menu' : 'Retrair menu'}
        on:click={() => (sidebarCollapsed = !sidebarCollapsed)}
      >
        {#if sidebarCollapsed}
          <SidebarOpen size={14} />
        {:else}
          <SidebarClose size={14} />
        {/if}
      </button>
    </div>

    <nav>
      <!-- Início — always visible, no module gate -->
      <a
        href="/admin/painel"
        class="nav-item"
        class:on={pathname.startsWith('/admin/painel')}
        aria-current={pathname.startsWith('/admin/painel') ? 'page' : undefined}
        title={sidebarCollapsed ? 'Início' : undefined}
        on:click={closeSidebar}
      >
        <span class="ico"><House size={15} /></span>
        {#if !sidebarCollapsed}<span>Início</span>{/if}
      </a>

      {#each navGroups as group}
        {@const visibleItems = group.items.filter((item) => canView(item.module))}
        {#if visibleItems.length > 0}
          <div class="nav-group">
            {#if !sidebarCollapsed}
              <span class="sec-label">{group.label}</span>
            {:else}
              <span class="sec-label-dot" aria-hidden="true"></span>
            {/if}
            {#each visibleItems as item}
              <a
                href={item.href}
                class="nav-item"
                class:on={isActive(item.href)}
                aria-current={isActive(item.href) ? 'page' : undefined}
                title={sidebarCollapsed ? item.label : undefined}
                on:click={closeSidebar}
              >
                <span class="ico"><svelte:component this={item.icon} size={15} /></span>
                {#if !sidebarCollapsed}<span>{item.label}</span>{/if}
                {#if item.href === '/admin/notificacoes' && $unreadCount > 0}
                  {#if sidebarCollapsed}
                    <span class="nav-badge-dot" aria-hidden="true"></span>
                  {:else}
                    <span class="nav-count" aria-label="{$unreadCount} não lidas"
                      >{$unreadCount}</span
                    >
                  {/if}
                {/if}
              </a>
            {/each}
          </div>
        {/if}
      {/each}
    </nav>

    <button
      class="footer profile-btn"
      type="button"
      on:click={openProfile}
      aria-label="Abrir meu perfil"
      title={sidebarCollapsed ? currentProfile.name : undefined}
    >
      <div class="avatar" aria-hidden="true">
        {#if currentProfile.avatar_url}
          <img src={currentProfile.avatar_url} alt="" />
        {:else}
          {userInitials}
        {/if}
      </div>
      {#if !sidebarCollapsed}
        <div class="footer-text">
          <div class="name">{currentProfile.name}</div>
          <div class="role">{currentProfile.display_role ?? currentProfile.role} · perfil</div>
        </div>
      {/if}
    </button>
  </aside>

  <div class="admin-main">
    <header class="admin-topbar">
      <button
        class="sidebar-toggle"
        on:click={toggleSidebar}
        aria-label={sidebarOpen ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={sidebarOpen}
      >
        {#if sidebarOpen}<X size={18} />{:else}<Menu size={18} />{/if}
      </button>

      <h2>{activeLabel}</h2>
      <span class="crumbs">{activeCrumb}</span>
      <div class="grow"></div>

      <div class="admin-search">
        <Search size={14} />
        <input type="text" placeholder="Buscar..." aria-label="Busca global" />
      </div>

      <div class="notif-bell-container">
        <button
          type="button"
          class="bell-wrap topbar-bell"
          aria-label={$unreadCount > 0
            ? `Notificações — ${$unreadCount} não lidas`
            : 'Notificações'}
          aria-expanded={notifOpen}
          aria-haspopup="true"
          title="Notificações"
          on:click={toggleNotifPopover}
        >
          <Bell size={18} />
          {#if $unreadCount > 0}
            <span class="bell-count">{$unreadCount > 99 ? '99+' : $unreadCount}</span>
          {/if}
        </button>

        {#if notifOpen}
          <button
            class="notif-popover-backdrop"
            aria-label="Fechar notificações"
            tabindex="-1"
            on:click={closeNotifPopover}
            on:keydown={(e) => e.key === 'Escape' && closeNotifPopover()}
          ></button>

          <div class="notif-popover" role="dialog" aria-label="Notificações recentes">
            <header class="notif-popover-head">
              <span>Notificações</span>
              {#if $unreadCount > 0}
                <span class="notif-popover-count">{$unreadCount} não lidas</span>
              {/if}
            </header>

            <div class="notif-popover-body">
              {#if notifLoading}
                <p class="notif-popover-empty">Carregando…</p>
              {:else if notifError}
                <p class="notif-popover-empty">{notifError}</p>
              {:else if notifGroups.length === 0}
                <p class="notif-popover-empty">Tudo em dia. Nada novo para revisar.</p>
              {:else}
                {#each notifGroups as group (group.key)}
                  <div class="notif-popover-day">
                    <span class="notif-popover-day-label">{group.label}</span>
                    {#each group.items as n (n.id)}
                      {@const vis = iconForTipo(n.tipo)}
                      {@const Cmp = NOTIF_ICONS[vis.icon]}
                      <div class="notif-popover-row" class:unread={n.status === 'unread'}>
                        <span class="notif-popover-ico" style="background:{n.color ?? vis.color}">
                          <Cmp size={13} />
                        </span>
                        <div class="notif-popover-content">
                          <div class="notif-popover-title">{humanizeTipo(n.tipo)}</div>
                          <div class="notif-popover-desc">{n.conteudo}</div>
                          <div class="notif-popover-time">{relativeTime(n.created_at)}</div>
                        </div>
                        {#if n.status === 'unread'}
                          <button
                            class="notif-popover-mark"
                            title="Marcar como lida"
                            aria-label="Marcar como lida"
                            disabled={notifPending.has(n.id)}
                            on:click={() => markNotifRead(n)}
                          >
                            <Check size={12} />
                          </button>
                        {/if}
                      </div>
                    {/each}
                  </div>
                {/each}
              {/if}
            </div>

            <a href="/admin/notificacoes" class="notif-popover-footer" on:click={closeNotifPopover}>
              Ver todas as notificações
            </a>
          </div>
        {/if}
      </div>

      {#each $topbarActions as action}
        <button class="topbar-action-btn" type="button" on:click={action.onClick}>
          {action.label}
        </button>
      {/each}
    </header>

    <slot />
  </div>

  <ProfileModal
    isOpen={profileModalOpen}
    profile={currentProfile}
    onClose={() => (profileModalOpen = false)}
    onSave={handleProfileSave}
  />
</div>

<style>
  .sidebar-brand-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    margin-bottom: 6px;
    border-bottom: 1px solid var(--line);
    padding-bottom: 12px;
    min-height: 34px;
  }

  .brand-svg {
    flex-shrink: 0;
  }

  /* when solo (no brand link beside it), center the button */
  .collapse-btn-solo {
    margin: 0 auto;
  }

  .nav-group {
    display: flex;
    flex-direction: column;
    gap: 1px;
    margin-bottom: 4px;
  }

  .sec-label {
    font-family: var(--font-mono);
    font-size: 9.5px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-faint);
    padding: 8px 10px 4px;
  }

  .sec-label-dot {
    display: block;
    width: 16px;
    height: 1px;
    background: var(--line);
    margin: 8px auto 4px;
  }

  .collapse-btn {
    display: none;
    background: transparent;
    border: 1px solid var(--line);
    border-radius: 6px;
    color: var(--text-faint);
    cursor: pointer;
    width: 26px;
    height: 26px;
    place-items: center;
    flex-shrink: 0;
    padding: 0;
    transition:
      background 0.15s,
      color 0.15s;
  }

  .collapse-btn:hover {
    background: var(--bg-soft);
    color: var(--text);
  }

  /* Show collapse button only on desktop (>820px) */
  @media (min-width: 821px) {
    .collapse-btn {
      display: grid;
    }
  }

  .topbar-action-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 32px;
    padding: 0 14px;
    background: var(--text);
    color: var(--bg);
    border: none;
    border-radius: 6px;
    font-size: 12.5px;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    flex-shrink: 0;
    transition: opacity 0.15s;
  }
  .topbar-action-btn:hover {
    opacity: 0.85;
  }

  /* Topbar bell (badge global de não lidas) */
  .notif-bell-container {
    position: relative;
    flex-shrink: 0;
  }
  .topbar-bell {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border-radius: 8px;
    color: var(--text-muted);
    flex-shrink: 0;
    border: none;
    background: transparent;
    cursor: pointer;
    font: inherit;
    transition:
      background 0.15s,
      color 0.15s;
  }
  .topbar-bell:hover {
    background: var(--bg-soft);
    color: var(--text);
  }
  .topbar-bell .bell-count {
    position: absolute;
    top: -3px;
    right: -3px;
    min-width: 16px;
    height: 16px;
    padding: 0 4px;
    border-radius: 100px;
    background: var(--pink);
    color: #fff;
    font-family: var(--font-mono);
    font-size: 9.5px;
    font-weight: 600;
    display: grid;
    place-items: center;
    border: 1.5px solid var(--bg);
  }

  /* Popover de notificações */
  .notif-popover-backdrop {
    position: fixed;
    inset: 0;
    background: transparent;
    border: none;
    z-index: 900;
    cursor: default;
  }
  .notif-popover {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    width: 360px;
    max-width: 90vw;
    max-height: 70vh;
    display: flex;
    flex-direction: column;
    background: var(--bg-elev);
    border: 1px solid var(--line);
    border-radius: 12px;
    box-shadow: 0 14px 40px rgba(0, 0, 0, 0.28);
    z-index: 901;
    overflow: hidden;
  }
  .notif-popover-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 12px 14px;
    border-bottom: 1px solid var(--line);
    font-size: 13px;
    font-weight: 600;
    color: var(--text);
    flex-shrink: 0;
  }
  .notif-popover-count {
    font-family: var(--font-mono);
    font-size: 10px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 100px;
    background: rgba(231, 31, 132, 0.18);
    color: var(--pink);
  }
  .notif-popover-body {
    overflow-y: auto;
    flex: 1 1 auto;
  }
  .notif-popover-empty {
    padding: 28px 16px;
    text-align: center;
    font-size: 12.5px;
    color: var(--text-muted);
    margin: 0;
  }
  .notif-popover-day {
    padding: 8px 0;
  }
  .notif-popover-day-label {
    display: block;
    padding: 4px 14px;
    font-family: var(--font-mono);
    font-size: 9.5px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-faint);
  }
  .notif-popover-row {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 8px 14px;
    position: relative;
  }
  .notif-popover-row:hover {
    background: var(--bg-soft);
  }
  .notif-popover-row.unread::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--purple);
  }
  .notif-popover-ico {
    width: 26px;
    height: 26px;
    border-radius: 7px;
    display: grid;
    place-items: center;
    color: #fff;
    flex-shrink: 0;
  }
  .notif-popover-content {
    flex: 1;
    min-width: 0;
  }
  .notif-popover-title {
    font-size: 12px;
    font-weight: 600;
    color: var(--text);
  }
  .notif-popover-desc {
    font-size: 11px;
    color: var(--text-muted);
    margin-top: 1px;
    line-height: 1.35;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .notif-popover-time {
    font-family: var(--font-mono);
    font-size: 9.5px;
    color: var(--text-faint);
    margin-top: 3px;
  }
  .notif-popover-mark {
    flex-shrink: 0;
    width: 22px;
    height: 22px;
    border-radius: 6px;
    border: 1px solid var(--line);
    background: transparent;
    color: var(--text-muted);
    cursor: pointer;
    display: grid;
    place-items: center;
  }
  .notif-popover-mark:hover:not(:disabled) {
    background: var(--pos-soft, rgba(102, 223, 122, 0.18));
    color: var(--green);
    border-color: transparent;
  }
  .notif-popover-mark:disabled {
    opacity: 0.5;
    cursor: default;
  }
  .notif-popover-footer {
    display: block;
    text-align: center;
    padding: 10px;
    font-size: 12px;
    font-weight: 500;
    color: var(--purple);
    border-top: 1px solid var(--line);
    flex-shrink: 0;
    text-decoration: none;
  }
  .notif-popover-footer:hover {
    background: var(--bg-soft);
  }

  /* Contador no item da sidebar */
  .nav-count {
    margin-left: auto;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: 100px;
    background: var(--pink);
    color: #fff;
    font-family: var(--font-mono);
    font-size: 10px;
    font-weight: 600;
    display: inline-grid;
    place-items: center;
  }
  .nav-badge-dot {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--pink);
  }

  .profile-btn {
    all: unset;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    border-radius: 8px;
    padding: 6px 8px;
    margin: -6px -8px;
    transition: background 0.15s;
    text-align: left;
    width: calc(100% + 16px);
    box-sizing: border-box;
  }

  .profile-btn:hover {
    background: rgba(255, 255, 255, 0.06);
  }

  .footer-text {
    min-width: 0;
    flex: 1;
  }

  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }

  /* Hide on mobile (handled by hamburger) */
  .desktop-only {
    display: none;
  }
  @media (min-width: 821px) {
    .desktop-only {
      display: grid;
    }
  }
</style>
