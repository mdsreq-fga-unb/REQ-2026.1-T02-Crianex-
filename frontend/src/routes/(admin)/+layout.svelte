<script lang="ts">
  import '../../app.css';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import {
    Users,
    Package,
    HelpCircle,
    FileText,
    BarChart2,
    Ticket,
    Bell,
    Search,
    Menu,
    X,
  } from 'lucide-svelte';
  import type { LayoutData } from './$types';

  export let data: LayoutData;

  const navItems = [
    { href: '/crm', label: 'CRM', icon: Users },
    { href: '/products', label: 'Produtos', icon: Package },
    { href: '/faq', label: 'FAQ', icon: HelpCircle },
    { href: '/logs', label: 'Logs', icon: FileText },
    { href: '/metricas', label: 'Métricas', icon: BarChart2 },
    { href: '/tickets', label: 'Tickets', icon: Ticket },
    { href: '/notificacoes', label: 'Notificações', icon: Bell },
  ];

  let sidebarOpen = false;

  $: activeItem =
    navItems.find(
      (item) => $page.url.pathname === item.href || $page.url.pathname.startsWith(item.href + '/')
    ) ?? null;
  $: activeTitle = activeItem?.label ?? 'Painel';
  $: activeCrumb = `admin / ${activeItem?.label.toLowerCase() ?? 'dashboard'}`;

  $: userInitials = (data.adminUser.name ?? 'A')
    .split(' ')
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }

  function closeSidebar() {
    sidebarOpen = false;
  }

  onMount(() => {
    let subscription: { unsubscribe: () => void } | null = null;

    import('$lib/api/supabase')
      .then(({ supabase }) => {
        const { data: authData } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session) {
            document.cookie = `access_token=${session.access_token}; path=/; max-age=${session.expires_in || 3600}; SameSite=Lax;`;
          } else {
            document.cookie = 'access_token=; path=/; max-age=0; SameSite=Lax;';
          }
        });
        subscription = authData.subscription;
      })
      .catch((err) => {
        console.error('[admin layout] Failed to set auth listener:', err);
      });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  });
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
      {#each navItems as item}
        {@const isActive = $page.url.pathname.startsWith(item.href)}
        <a
          href={item.href}
          class="nav-item"
          class:on={isActive}
          aria-current={isActive ? 'page' : undefined}
          on:click={closeSidebar}
        >
          <span class="ico"><svelte:component this={item.icon} size={16} /></span>
          {item.label}
        </a>
      {/each}
    </nav>

    <div class="footer">
      <div class="avatar" aria-hidden="true">{userInitials}</div>
      <div>
        <div class="name">{data.adminUser.name ?? 'Admin'}</div>
        <div class="role">{data.adminUser.role ?? 'admin'}</div>
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
        {#if sidebarOpen}
          <X size={18} />
        {:else}
          <Menu size={18} />
        {/if}
      </button>

      <h2>{activeTitle}</h2>
      <span class="crumbs">{activeCrumb}</span>
      <div class="grow"></div>

      <div class="admin-search">
        <Search size={14} />
        <input type="text" placeholder="Buscar..." aria-label="Busca global" />
      </div>
    </header>

    <slot />
  </div>
</div>
