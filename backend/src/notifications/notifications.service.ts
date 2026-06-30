import { getSupabaseClient } from '../config/supabase.js';

export type NotificationStatus = 'unread' | 'read';

export type NotificationRecord = {
  id: string;
  tipo: string;
  conteudo: string;
  status: NotificationStatus;
  created_at: string;
};

const SELECT = 'id, tipo, conteudo, status, created_at';

export function isNotificationStatus(value: unknown): value is NotificationStatus {
  return value === 'unread' || value === 'read';
}

// Lista notificações ordenadas por created_at DESC; filtra por status quando informado.
// O índice composto (status, created_at DESC) de #186 garante a listagem em ≤ 2s (RNF03).
export async function listNotifications(
  status?: NotificationStatus
): Promise<NotificationRecord[]> {
  const supabase = getSupabaseClient();
  let query = supabase
    .from('notifications')
    .select(SELECT)
    .order('created_at', { ascending: false });

  if (status) query = query.eq('status', status);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as NotificationRecord[];
}

// Contador de não lidas via COUNT agregado (head: true → não traz linhas).
export async function countUnread(): Promise<number> {
  const supabase = getSupabaseClient();
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'unread');

  if (error) throw error;
  return count ?? 0;
}
