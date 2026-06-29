import { getSupabaseClient } from '../config/supabase.js';

export type ClientStatus = 'ativo' | 'inativo';

export type Client = {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  status: ClientStatus;
  created_at: string;
};

export class ClientError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message);
    this.name = 'ClientError';
  }
}

const SELECT = 'id, nome, email, telefone, status, created_at';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ClientPatch = {
  nome?: string;
  email?: string;
  telefone?: string | null;
  status?: ClientStatus;
};

// Edits client data and handles inactivation (RF35, RF36). Inactivation is a
// soft status change ('inativo'), never a delete — the row stays in the history.
export async function updateClient(id: string, patch: ClientPatch): Promise<Client> {
  if (!id) throw new ClientError('ID do cliente é obrigatório.', 'MISSING_ID');

  const updates: Record<string, unknown> = {};

  if (patch.nome !== undefined) {
    const nome = patch.nome.trim();
    if (!nome) throw new ClientError('Nome não pode ser vazio.', 'INVALID_NOME');
    updates['nome'] = nome;
  }
  if (patch.email !== undefined) {
    const email = patch.email.trim().toLowerCase();
    if (!EMAIL_RE.test(email)) throw new ClientError('E-mail inválido.', 'INVALID_EMAIL');
    updates['email'] = email;
  }
  if (patch.telefone !== undefined) {
    updates['telefone'] = patch.telefone?.trim() || null;
  }
  if (patch.status !== undefined) {
    if (patch.status !== 'ativo' && patch.status !== 'inativo') {
      throw new ClientError('Status inválido. Use "ativo" ou "inativo".', 'INVALID_STATUS');
    }
    updates['status'] = patch.status;
  }

  if (Object.keys(updates).length === 0) {
    throw new ClientError('Nenhum campo válido para atualizar.', 'EMPTY_PATCH');
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('clients')
    .update(updates)
    .eq('id', id)
    .select(SELECT)
    .maybeSingle();

  if (error) {
    if (error.code === '23505') {
      throw new ClientError('E-mail já cadastrado para outro cliente.', 'DUPLICATE_EMAIL');
    }
    throw error;
  }
  if (!data) throw new ClientError('Cliente não encontrado.', 'NOT_FOUND');
  return data as Client;
}
