import { getSupabaseClient } from '../config/supabase.js';

export type ClientCard = {
  id: string;
  client_id: string;
  column_id: string;
  produto_vinculado: string | null;
  responsavel: string | null;
  created_at: string;
};

export type CardUpdateInput = {
  column_id?: string;
  produto_vinculado?: string | null;
  responsavel?: string | null;
};

export class CrmServiceError extends Error {
  constructor(
    message: string,
    public readonly code: 'NOT_FOUND' | 'INVALID_COLUMN'
  ) {
    super(message);
    this.name = 'CrmServiceError';
  }
}

export async function updateCard(id: string, input: CardUpdateInput): Promise<ClientCard> {
  const supabase = getSupabaseClient();

  // Validate column_id exists before updating
  if (input.column_id) {
    const { data: col, error: colError } = await supabase
      .from('crm_columns')
      .select('id')
      .eq('id', input.column_id)
      .maybeSingle();

    if (colError) throw colError;
    if (!col) throw new CrmServiceError('Coluna não encontrada.', 'INVALID_COLUMN');
  }

  const { data, error } = await supabase
    .from('client_cards')
    .update(input)
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new CrmServiceError('Card não encontrado.', 'NOT_FOUND');

  return data as ClientCard;
}
