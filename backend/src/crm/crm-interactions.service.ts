import { getSupabaseClient } from '../config/supabase.js';

export type CrmInteraction = {
  id: string;
  client_id: string;
  autor_id: string;
  tipo: string;
  conteudo: string;
  data: string;
  removed: boolean;
};

export class CrmInteractionError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message);
    this.name = 'CrmInteractionError';
  }
}

const SELECT = 'id, client_id, autor_id, tipo, conteudo, data, removed';
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function createClientInteraction(input: {
  clientId: string;
  authorId: string;
  tipo: string;
  conteudo: string;
}): Promise<CrmInteraction> {
  const clientId = input.clientId.trim();
  const authorId = input.authorId.trim();
  const tipo = input.tipo.trim();
  const conteudo = input.conteudo.trim();

  if (!UUID_RE.test(clientId)) {
    throw new CrmInteractionError('ID do cliente é inválido.', 'INVALID_CLIENT_ID');
  }
  if (!UUID_RE.test(authorId)) {
    throw new CrmInteractionError('Autor autenticado inválido.', 'INVALID_AUTHOR_ID');
  }
  if (!tipo) {
    throw new CrmInteractionError('Tipo da interação é obrigatório.', 'INVALID_TIPO');
  }
  if (!conteudo) {
    throw new CrmInteractionError('Conteúdo da interação é obrigatório.', 'INVALID_CONTEUDO');
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('interactions')
    .insert({
      client_id: clientId,
      autor_id: authorId,
      tipo,
      conteudo,
    })
    .select(SELECT)
    .single();

  if (error) {
    if (error.code === '23503') {
      throw new CrmInteractionError('Cliente ou autor não encontrado.', 'NOT_FOUND');
    }
    throw error;
  }

  return data as CrmInteraction;
}
