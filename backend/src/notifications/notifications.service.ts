import { getSupabaseClient } from '../config/supabase.js';

export type NotificationStatus = 'unread' | 'read';

export type NotificationRecord = {
  id: string;
  tipo: string;
  conteudo: string;
  status: NotificationStatus;
  member_id: string | null;
  created_at: string;
};

const SELECT = 'id, tipo, conteudo, status, member_id, created_at';

export function isNotificationStatus(value: unknown): value is NotificationStatus {
  return value === 'unread' || value === 'read';
}

// Visibilidade: 'owner' vê tudo (painel central); um 'member' só vê notificações
// globais (member_id nulo, ex. novo_lead) e as endereçadas a ele mesmo (ex.
// responsavel_atribuido). Aplicado tanto na listagem quanto no contador.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyVisibility(query: any, viewer: { id: string; role: string }) {
  if (viewer.role === 'owner') return query;
  return query.or(`member_id.is.null,member_id.eq.${viewer.id}`);
}

// Lista notificações ordenadas por created_at DESC; filtra por status quando informado.
// O índice composto (status, created_at DESC) de #186 garante a listagem em ≤ 2s (RNF03).
export async function listNotifications(
  viewer: { id: string; role: string },
  status?: NotificationStatus
): Promise<NotificationRecord[]> {
  const supabase = getSupabaseClient();
  let query = supabase
    .from('notifications')
    .select(SELECT)
    .order('created_at', { ascending: false });

  if (status) query = query.eq('status', status);
  query = applyVisibility(query, viewer);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as NotificationRecord[];
}

// Contador de não lidas via COUNT agregado (head: true → não traz linhas).
export async function countUnread(viewer: { id: string; role: string }): Promise<number> {
  const supabase = getSupabaseClient();
  let query = supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'unread');
  query = applyVisibility(query, viewer);

  const { count, error } = await query;
  if (error) throw error;
  return count ?? 0;
}

// Cria uma notificação (RN13 — sempre por evento-chave do sistema, nunca manual).
// memberId nulo = notificação global; informado = endereçada a um membro
// específico (ex.: responsável atribuído a um card do CRM).
export async function createNotification(input: {
  tipo: string;
  conteudo: string;
  memberId?: string | null;
}): Promise<NotificationRecord> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('notifications')
    .insert({ tipo: input.tipo, conteudo: input.conteudo, member_id: input.memberId ?? null })
    .select(SELECT)
    .single();

  if (error) throw error;
  return data as NotificationRecord;
}

// Atualiza o status de uma notificação (ex.: marcar como lida). Idempotente:
// o UPDATE filtra apenas por id, então reaplicar o mesmo status retorna o
// registro sem erro. Retorna null quando o id não existe OU quando pertence a
// outro membro (visibilidade de updateNotificationStatus espelha a de listNotifications,
// para que um member não consiga marcar como lida notificação alheia).
export async function updateNotificationStatus(
  id: string,
  status: NotificationStatus,
  viewer: { id: string; role: string }
): Promise<NotificationRecord | null> {
  const supabase = getSupabaseClient();
  let query = supabase.from('notifications').update({ status }).eq('id', id);
  query = applyVisibility(query, viewer);

  const { data, error } = await query.select(SELECT).maybeSingle();

  if (error) throw error;
  return (data as NotificationRecord) ?? null;
}
