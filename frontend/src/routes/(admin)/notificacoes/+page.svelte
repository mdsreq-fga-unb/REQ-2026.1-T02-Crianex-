<script lang="ts">
  import { Bell, Users, Check, ShieldAlert } from 'lucide-svelte';
  import { unreadCount } from '$lib/stores/notifications';
  import {
    groupByDay,
    relativeTime,
    iconForTipo,
    type Notification,
  } from '$lib/utils/notifications';

  let { data } = $props<{
    data: {
      notifications: Notification[];
      unreadCount: number;
      forbidden?: boolean;
      error?: string;
    };
  }>();

  let tab = $state<'all' | 'unread'>('all');

  const unreadOnly = (list: Notification[]) => list.filter((n) => n.status === 'unread');
  let filtered = $derived(tab === 'unread' ? unreadOnly(data.notifications) : data.notifications);
  let groups = $derived(groupByDay(filtered));
  let unreadTotal = $derived(unreadOnly(data.notifications).length);

  // Mantém o badge global do shell em sincronia com o que a central conhece.
  $effect(() => {
    unreadCount.set(data.unreadCount);
  });

  const ICONS = { users: Users, check: Check, bell: Bell } as const;

  function humanize(tipo: string): string {
    const s = tipo.replace(/_/g, ' ').trim();
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
</script>

<div class="notif-center">
  {#if data.forbidden}
    <div class="notif-state">
      <span class="ico"><ShieldAlert size={22} /></span>
      <div class="t">Acesso restrito</div>
      <div class="s">Você não tem permissão para ver as notificações.</div>
    </div>
  {:else if data.error}
    <div class="notif-err-banner">{data.error}</div>
  {:else}
    <header class="notif-head">
      <h1>Notificações</h1>
      {#if unreadTotal > 0}
        <span class="notif-count-pill">{unreadTotal} não lidas</span>
      {/if}
    </header>

    <div class="notif-tabs">
      <button class="tab {tab === 'all' ? 'on' : ''}" onclick={() => (tab = 'all')}>
        Tudo <span class="badge">{data.notifications.length}</span>
      </button>
      <button class="tab {tab === 'unread' ? 'on' : ''}" onclick={() => (tab = 'unread')}>
        Não lidas <span class="badge">{unreadTotal}</span>
      </button>
    </div>

    {#if groups.length === 0}
      <div class="notif-state">
        <span class="ico ok"><Check size={24} /></span>
        <div class="t">Tudo em dia.</div>
        <div class="s">Nada novo para revisar agora.</div>
      </div>
    {:else}
      {#each groups as group (group.key)}
        <section class="notif-day">
          <h2 class="notif-day-label">{group.label}</h2>
          <ul class="notif-feed">
            {#each group.items as n (n.id)}
              {@const vis = iconForTipo(n.tipo)}
              {@const Cmp = ICONS[vis.icon]}
              <li class="notif-feed-row {n.status === 'unread' ? 'unread' : ''}">
                <span class="ico-cell" style="background:{vis.color}">
                  <Cmp size={15} />
                </span>
                <div class="body">
                  <div class="title">{humanize(n.tipo)}</div>
                  <div class="desc">{n.conteudo}</div>
                </div>
                <span class="t">{relativeTime(n.created_at)}</span>
              </li>
            {/each}
          </ul>
        </section>
      {/each}
    {/if}
  {/if}
</div>

<style>
  .notif-center {
    max-width: 760px;
    margin: 0 auto;
    padding: 8px 4px 40px;
  }

  .notif-head {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 14px;
  }
  .notif-head h1 {
    font-size: 20px;
    font-weight: 600;
    margin: 0;
  }
  .notif-count-pill {
    font-family: var(--font-mono);
    font-size: 10px;
    padding: 2px 8px;
    border-radius: 100px;
    background: rgba(231, 31, 132, 0.18);
    color: var(--pink);
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .notif-tabs {
    display: flex;
    gap: 4px;
    border-bottom: 1px solid var(--line);
    margin-bottom: 8px;
  }
  .notif-tabs .tab {
    background: transparent;
    border: 0;
    padding: 10px 14px;
    font-family: inherit;
    font-size: 13px;
    color: var(--text-muted);
    cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .notif-tabs .tab:hover {
    color: var(--text);
  }
  .notif-tabs .tab.on {
    color: var(--text);
    border-bottom-color: var(--purple);
  }
  .notif-tabs .tab .badge {
    font-family: var(--font-mono);
    font-size: 10px;
    background: var(--bg-soft);
    padding: 1px 6px;
    border-radius: 4px;
    color: var(--text-muted);
  }

  .notif-day {
    margin-top: 18px;
  }
  .notif-day-label {
    font-family: var(--font-mono);
    font-size: 10.5px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-faint);
    margin: 0 0 6px;
    font-weight: 500;
  }
  .notif-feed {
    list-style: none;
    margin: 0;
    padding: 0;
    border: 1px solid var(--line);
    border-radius: 12px;
    overflow: hidden;
    background: var(--bg-elev);
  }
  .notif-feed-row {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    padding: 12px 16px;
    border-bottom: 1px solid var(--line);
    position: relative;
  }
  .notif-feed-row:last-child {
    border-bottom: 0;
  }
  .notif-feed-row.unread::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--purple);
  }
  .notif-feed-row .ico-cell {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: grid;
    place-items: center;
    color: white;
    flex-shrink: 0;
  }
  .notif-feed-row .body {
    flex: 1;
    min-width: 0;
  }
  .notif-feed-row .body .title {
    font-size: 13px;
    font-weight: 500;
  }
  .notif-feed-row .body .desc {
    font-size: 11.5px;
    color: var(--text-muted);
    margin-top: 2px;
    line-height: 1.4;
  }
  .notif-feed-row .t {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--text-faint);
    flex-shrink: 0;
    padding-top: 2px;
  }

  .notif-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 72px 20px;
    color: var(--text-muted);
  }
  .notif-state .ico {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: grid;
    place-items: center;
    background: var(--bg-soft);
    border: 1px solid var(--line);
    color: var(--text-faint);
    margin-bottom: 12px;
  }
  .notif-state .ico.ok {
    color: var(--green);
  }
  .notif-state .t {
    font-size: 14px;
    color: var(--text);
  }
  .notif-state .s {
    font-size: 12px;
    margin-top: 4px;
  }

  .notif-err-banner {
    padding: 12px 16px;
    border: 1px solid var(--line);
    border-radius: 10px;
    background: var(--hot-soft, rgba(231, 31, 132, 0.08));
    color: var(--text);
    font-size: 13px;
  }
</style>
