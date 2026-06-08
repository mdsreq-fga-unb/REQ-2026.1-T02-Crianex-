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
  } from 'lucide-svelte';
  import type { LayoutData } from './$types';
  import { topbarActions } from '$lib/stores/topbar';
  import ProfileModal from '$lib/components/admin/ProfileModal.svelte';

  export let data: LayoutData;

  const NAO_IMPL = '/nao-implementado';

  const navGroups = [
    {
      label: 'Geral',
      items: [
        { href: NAO_IMPL, label: 'Dashboard', icon: LayoutDashboard, module: null },
        { href: NAO_IMPL, label: 'CRM · Leads', icon: Users, module: null },
        { href: NAO_IMPL, label: 'Financeiro', icon: ChartBar, module: null },
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
        { href: NAO_IMPL, label: 'Tickets', icon: Ticket, module: null },
        { href: NAO_IMPL, label: 'Logs de Produtos', icon: FileText, module: null },
        { href: NAO_IMPL, label: 'Notificações', icon: Bell, module: null },
        { href: '/admin/membros', label: 'Membros', icon: Users, module: 'members' },
        { href: NAO_IMPL, label: 'Auditoria', icon: ShieldCheck, module: null },
      ],
    },
  ];

  let sidebarOpen = false;
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

  function canView(module: string | null): boolean {
    if (!module) return true;
    if (currentProfile.role === 'owner') return true;
    const perms = currentProfile.permissions;
    return Array.isArray(perms?.[module]) && perms[module].includes('v');
  }

  $: pathname = $page.url.pathname;

  $: activeLabel = (() => {
    if (pathname === NAO_IMPL) return 'Em Desenvolvimento';
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
</script>

<div class="admin-root admin-shell" class:sidebar-open={sidebarOpen}>
  <button
    class="admin-sidebar-backdrop"
    on:click={closeSidebar}
    on:keydown={(e) => e.key === 'Escape' && closeSidebar()}
    aria-label="Fechar menu"
    tabindex="-1"
  ></button>

  <aside class="admin-sidebar" aria-label="Menu de navegação">
    <a href="/admin" class="brand" on:click={closeSidebar}>
      <div class="brand-mark"><span>Cx</span></div>
      Crianex
    </a>

    <nav>
      {#each navGroups as group}
        {@const visibleItems = group.items.filter((item) => canView(item.module))}
        {#if visibleItems.length > 0}
          <div class="nav-group">
            <span class="sec-label">{group.label}</span>
            {#each visibleItems as item}
              <a
                href={item.href}
                class="nav-item"
                class:on={isActive(item.href)}
                aria-current={isActive(item.href) ? 'page' : undefined}
                on:click={closeSidebar}
              >
                <span class="ico"><svelte:component this={item.icon} size={15} /></span>
                {item.label}
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
    >
      <div class="avatar" aria-hidden="true">
        {#if currentProfile.avatar_url}
          <img src={currentProfile.avatar_url} alt="" />
        {:else}
          {userInitials}
        {/if}
      </div>
      <div class="footer-text">
        <div class="name">{currentProfile.name}</div>
        <div class="role">{currentProfile.display_role ?? currentProfile.role} · perfil</div>
      </div>
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
</style>
