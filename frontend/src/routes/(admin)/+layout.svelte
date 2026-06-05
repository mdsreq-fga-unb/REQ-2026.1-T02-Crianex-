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

  export let data: LayoutData;

  const NAO_IMPL = '/nao-implementado';

  const navGroups = [
    {
      label: 'Geral',
      items: [
        { href: NAO_IMPL, label: 'Dashboard', icon: LayoutDashboard },
        { href: NAO_IMPL, label: 'CRM · Leads', icon: Users },
        { href: NAO_IMPL, label: 'Financeiro', icon: ChartBar },
      ],
    },
    {
      label: 'Vitrine',
      items: [
        { href: '/admin/products', label: 'Produtos', icon: Package },
        { href: '/admin/gestao-faq', label: 'Gestão FAQ', icon: CircleQuestionMark },
      ],
    },
    {
      label: 'Operações',
      items: [
        { href: NAO_IMPL, label: 'Tickets', icon: Ticket },
        { href: NAO_IMPL, label: 'Logs de Produtos', icon: FileText },
        { href: NAO_IMPL, label: 'Notificações', icon: Bell },
        { href: '/admin/membros', label: 'Membros', icon: Users },
        { href: NAO_IMPL, label: 'Auditoria', icon: ShieldCheck },
      ],
    },
  ];

  let sidebarOpen = false;

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

  $: userInitials = (data.adminUser.name ?? 'A')
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
        <div class="nav-group">
          <span class="sec-label">{group.label}</span>
          {#each group.items as item}
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
      {/each}
    </nav>

    <div class="footer">
      <div class="avatar" aria-hidden="true">{userInitials}</div>
      <div>
        <div class="name">{data.adminUser.name ?? 'Admin'}</div>
        <div class="role">{data.adminUser.role ?? 'admin'} · perfil</div>
      </div>
    </div>
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
</style>
