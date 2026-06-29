import { getSupabaseClient } from '../config/supabase.js';

export type CrmColumn = {
  id: string;
  title: string;
  color: string;
  position: number;
  is_default: boolean;
  entry_hint: string | null;
  exit_hint: string | null;
  created_at: string;
  updated_at: string;
};

export class CrmColumnError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message);
    this.name = 'CrmColumnError';
  }
}

const SELECT =
  'id, title, color, position, is_default, entry_hint, exit_hint, created_at, updated_at';

const COLOR_RE = /^#[0-9a-fA-F]{6}$/;

export async function listColumns(): Promise<CrmColumn[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('crm_columns')
    .select(SELECT)
    .order('position', { ascending: true });

  if (error) throw error;
  return (data ?? []) as CrmColumn[];
}

export async function createColumn(input: {
  title: string;
  color?: string | undefined;
  position?: number | undefined;
  entry_hint?: string | undefined;
  exit_hint?: string | undefined;
}): Promise<CrmColumn> {
  const title = input.title.trim();
  if (!title) throw new CrmColumnError('Título da coluna é obrigatório.', 'INVALID_TITLE');

  const color = input.color ?? '#7f3fe5';
  if (!COLOR_RE.test(color))
    throw new CrmColumnError('Cor inválida. Use formato hex #RRGGBB.', 'INVALID_COLOR');

  const supabase = getSupabaseClient();

  const { data: maxRow } = await supabase
    .from('crm_columns')
    .select('position')
    .order('position', { ascending: false })
    .limit(1)
    .maybeSingle();

  const position = input.position ?? (maxRow?.position ?? -1) + 1;

  const { data, error } = await supabase
    .from('crm_columns')
    .insert({
      title,
      color,
      position,
      is_default: false,
      entry_hint: input.entry_hint?.trim() || null,
      exit_hint: input.exit_hint?.trim() || null,
    })
    .select(SELECT)
    .single();

  if (error) throw error;
  return data as CrmColumn;
}

export async function updateColumn(
  id: string,
  patch: {
    title?: string;
    color?: string;
    position?: number;
    entry_hint?: string | null;
    exit_hint?: string | null;
  }
): Promise<CrmColumn> {
  if (!id) throw new CrmColumnError('ID da coluna é obrigatório.', 'MISSING_ID');

  const updates: Record<string, unknown> = {};

  if (patch.title !== undefined) {
    const t = patch.title.trim();
    if (!t) throw new CrmColumnError('Título não pode ser vazio.', 'INVALID_TITLE');
    updates['title'] = t;
  }
  if (patch.color !== undefined) {
    if (!COLOR_RE.test(patch.color)) throw new CrmColumnError('Cor inválida.', 'INVALID_COLOR');
    updates['color'] = patch.color;
  }
  if (patch.position !== undefined) updates['position'] = patch.position;
  if (patch.entry_hint !== undefined) updates['entry_hint'] = patch.entry_hint?.trim() || null;
  if (patch.exit_hint !== undefined) updates['exit_hint'] = patch.exit_hint?.trim() || null;

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('crm_columns')
    .update(updates)
    .eq('id', id)
    .select(SELECT)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new CrmColumnError('Coluna não encontrada.', 'NOT_FOUND');
  return data as CrmColumn;
}

export async function reorderColumns(order: { id: string; position: number }[]): Promise<void> {
  if (!order.length) return;
  const supabase = getSupabaseClient();
  await Promise.all(
    order.map(({ id, position }) => supabase.from('crm_columns').update({ position }).eq('id', id))
  );
}

export async function deleteColumn(id: string): Promise<void> {
  if (!id) throw new CrmColumnError('ID da coluna é obrigatório.', 'MISSING_ID');

  const supabase = getSupabaseClient();

  // Fetch column metadata in a single query
  const { data: col } = await supabase
    .from('crm_columns')
    .select('id, is_default')
    .eq('id', id)
    .maybeSingle();

  if (!col) throw new CrmColumnError('Coluna não encontrada.', 'NOT_FOUND');
  if (col.is_default) {
    throw new CrmColumnError(
      'Não é possível remover a coluna padrão. Defina outra como padrão antes de removê-la.',
      'IS_DEFAULT'
    );
  }

  // Enforce ≥1 column invariant
  const { count } = await supabase.from('crm_columns').select('*', { count: 'exact', head: true });

  if ((count ?? 0) <= 1) {
    throw new CrmColumnError('O funil precisa ter ao menos uma coluna.', 'LAST_COLUMN');
  }

  // Verify no cards remain in this column before deleting.
  // PostgREST error 42P01 ("relation does not exist") means F19 hasn't shipped the
  // crm_client_cards table yet — only that specific case is safe to skip. Any other
  // error must not be swallowed, or the HAS_CARDS guard would silently no-op.
  const { count: cardCount, error: cardErr } = await supabase
    .from('crm_client_cards')
    .select('*', { count: 'exact', head: true })
    .eq('column_id', id);

  if (cardErr && cardErr.code !== '42P01') throw cardErr;

  if (!cardErr && (cardCount ?? 0) > 0) {
    throw new CrmColumnError(
      'A coluna contém leads vinculados. Mova-os para outra coluna antes de remover.',
      'HAS_CARDS'
    );
  }

  const { error } = await supabase.from('crm_columns').delete().eq('id', id);
  if (error) throw error;
}
