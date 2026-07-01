// Helpers puros da central de notificações (F07 · #189).
// Mantidos fora do componente para permitir testes unitários (Vitest, node env).

export type NotificationStatus = 'unread' | 'read';

export type Notification = {
  id: string;
  tipo: string;
  conteudo: string;
  status: NotificationStatus;
  created_at: string;
};

export type DayGroup = {
  key: string; // YYYY-MM-DD (data local)
  label: string; // "Hoje" / "Ontem" / "12 de jun. de 2026"
  items: Notification[];
};

// Chave de dia local (YYYY-MM-DD) a partir de um ISO.
function dayKey(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// Agrupa notificações por dia: dias em ordem decrescente (mais recente primeiro)
// e itens de cada dia também decrescentes por created_at.
export function groupByDay(items: Notification[]): DayGroup[] {
  const map = new Map<string, Notification[]>();
  for (const n of items) {
    const key = dayKey(n.created_at);
    const bucket = map.get(key);
    if (bucket) bucket.push(n);
    else map.set(key, [n]);
  }

  return [...map.entries()]
    .sort(([a], [b]) => (a < b ? 1 : a > b ? -1 : 0))
    .map(([key, group]) => ({
      key,
      label: formatDayLabel(group[0]!.created_at),
      items: group.sort((a, b) =>
        a.created_at < b.created_at ? 1 : a.created_at > b.created_at ? -1 : 0
      ),
    }));
}

// Rótulo do dia: "Hoje", "Ontem" ou data formatada em pt-BR.
export function formatDayLabel(iso: string, now: Date = new Date()): string {
  const target = dayKey(iso);
  const todayKey = dayKey(now.toISOString());

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const yesterdayKey = dayKey(yesterday.toISOString());

  if (target === todayKey) return 'Hoje';
  if (target === yesterdayKey) return 'Ontem';

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso));
}

// Tempo relativo curto no estilo do protótipo: "agora", "14m", "2h", "3d".
export function relativeTime(iso: string, now: Date = new Date()): string {
  const diffMs = now.getTime() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return 'agora';
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

// Mapeia o tipo da notificação para um ícone (chave lucide) e cor de destaque.
// Chaves de ícone são resolvidas para componentes no +page.svelte.
export type NotifVisual = { icon: 'users' | 'check' | 'bell'; color: string };

export function iconForTipo(tipo: string): NotifVisual {
  switch (tipo) {
    case 'novo_lead':
      return { icon: 'users', color: '#7f3fe5' };
    default:
      return { icon: 'bell', color: '#7f3fe5' };
  }
}
