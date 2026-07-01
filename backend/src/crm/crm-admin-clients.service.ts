import { getSupabaseClient } from '../config/supabase.js';
import { createNotification } from '../notifications/notifications.service.js';

export type CrmAdminClient = {
  id: string;
  card_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  status: 'ativo' | 'inativo';
  column_id: string | null;
  responsible_name: string | null;
  product_name: string | null;
  product_color: string | null;
  interaction_count: number;
  last_interaction: string | null;
};

export type CrmAdminClientCreate = {
  name: string;
  email: string;
  phone?: string;
  column_id?: string;
  responsible_name?: string;
  product_name?: string;
};

export type CrmAdminClientPatch = {
  name?: string;
  email?: string;
  phone?: string;
  column_id?: string;
  responsible_name?: string;
  product_name?: string;
};

export class CrmAdminClientError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message);
    this.name = 'CrmAdminClientError';
  }
}

const NAME_RE = /\S/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function resolveProductId(productName: string): Promise<string | null> {
  if (!productName.trim()) return null;
  const supabase = getSupabaseClient();
  const { data } = await supabase
    .from('products')
    .select('id')
    .eq('name_pt', productName.trim())
    .maybeSingle();
  return data?.id ?? null;
}

// Resolve o id do membro ativo com este nome de exibição — usado para endereçar
// a notificação de "responsável atribuído" (RF41/RNF24). Só membros ativos podem
// ser selecionados no seletor do frontend, então um nome sem match aqui indica
// dado legado (texto livre digitado antes deste seletor existir): a atribuição
// segue normalmente, apenas sem disparo de notificação.
async function resolveActiveMemberIdByName(name: string): Promise<string | null> {
  const trimmed = name.trim();
  if (!trimmed) return null;
  const supabase = getSupabaseClient();
  const { data } = await supabase
    .from('profiles')
    .select('id')
    .eq('name', trimmed)
    .eq('status', 'active')
    .maybeSingle();
  return data?.id ?? null;
}

async function notifyResponsibleAssigned(responsibleName: string, leadName: string): Promise<void> {
  const memberId = await resolveActiveMemberIdByName(responsibleName);
  if (!memberId) return;
  await createNotification({
    tipo: 'responsavel_atribuido',
    conteudo: `Você foi definido(a) como responsável pelo lead ${leadName} no CRM.`,
    memberId,
  });
}

async function buildClientView(clientId: string): Promise<CrmAdminClient | null> {
  const supabase = getSupabaseClient();

  const { data: client, error: cErr } = await supabase
    .from('clients')
    .select('id, nome, email, telefone, status')
    .eq('id', clientId)
    .maybeSingle();

  if (cErr) throw cErr;
  if (!client) return null;

  const { data: card } = await supabase
    .from('client_cards')
    .select('id, column_id, responsavel, produto_vinculado')
    .eq('client_id', clientId)
    .maybeSingle();

  let product_name: string | null = null;
  let product_color: string | null = null;
  if (card?.produto_vinculado) {
    const { data: prod } = await supabase
      .from('products')
      .select('name_pt, color')
      .eq('id', card.produto_vinculado)
      .maybeSingle();
    product_name = prod?.name_pt ?? null;
    product_color = prod?.color ?? null;
  }

  const { count } = await supabase
    .from('interactions')
    .select('id', { count: 'exact', head: true })
    .eq('client_id', clientId)
    .eq('removed', false);

  const { data: lastInter } = await supabase
    .from('interactions')
    .select('data')
    .eq('client_id', clientId)
    .eq('removed', false)
    .order('data', { ascending: false })
    .limit(1)
    .maybeSingle();

  return {
    id: client.id,
    card_id: card?.id ?? null,
    name: client.nome,
    email: client.email,
    phone: client.telefone ?? null,
    status: client.status as 'ativo' | 'inativo',
    column_id: card?.column_id ?? null,
    responsible_name: card?.responsavel ?? null,
    product_name,
    product_color,
    interaction_count: count ?? 0,
    last_interaction: lastInter?.data ?? null,
  };
}

export async function listCrmAdminClients(): Promise<CrmAdminClient[]> {
  const supabase = getSupabaseClient();

  const { data: clients, error } = await supabase
    .from('clients')
    .select('id, nome, email, telefone, status')
    .eq('status', 'ativo')
    .order('created_at', { ascending: false });

  if (error) throw error;
  if (!clients?.length) return [];

  const clientIds = clients.map((c) => c.id);

  const { data: cards } = await supabase
    .from('client_cards')
    .select('id, client_id, column_id, responsavel, produto_vinculado')
    .in('client_id', clientIds);

  const productIds = [...new Set((cards ?? []).map((c) => c.produto_vinculado).filter(Boolean))];
  const productMap = new Map<string, { name: string; color: string | null }>();
  if (productIds.length) {
    const { data: products } = await supabase
      .from('products')
      .select('id, name_pt, color')
      .in('id', productIds);
    for (const p of products ?? []) productMap.set(p.id, { name: p.name_pt, color: p.color });
  }

  const { data: interactions } = await supabase
    .from('interactions')
    .select('client_id, data')
    .in('client_id', clientIds)
    .eq('removed', false)
    .order('data', { ascending: false });

  const countMap = new Map<string, number>();
  const lastInteractionMap = new Map<string, string>();
  for (const i of interactions ?? []) {
    countMap.set(i.client_id, (countMap.get(i.client_id) ?? 0) + 1);
    // Ordenado por data DESC — a primeira ocorrência de cada client_id já é a mais recente.
    if (!lastInteractionMap.has(i.client_id)) lastInteractionMap.set(i.client_id, i.data);
  }

  const cardMap = new Map((cards ?? []).map((c) => [c.client_id, c]));

  return clients.map((client) => {
    const card = cardMap.get(client.id);
    const product = card?.produto_vinculado ? productMap.get(card.produto_vinculado) : undefined;
    return {
      id: client.id,
      card_id: card?.id ?? null,
      name: client.nome,
      email: client.email,
      phone: client.telefone ?? null,
      status: client.status as 'ativo' | 'inativo',
      column_id: card?.column_id ?? null,
      responsible_name: card?.responsavel ?? null,
      product_name: product?.name ?? null,
      product_color: product?.color ?? null,
      interaction_count: countMap.get(client.id) ?? 0,
      last_interaction: lastInteractionMap.get(client.id) ?? null,
    };
  });
}

export async function createCrmAdminClient(input: CrmAdminClientCreate): Promise<CrmAdminClient> {
  const name = input.name?.trim() ?? '';
  const email = input.email?.trim().toLowerCase() ?? '';

  if (!NAME_RE.test(name)) throw new CrmAdminClientError('Nome é obrigatório.', 'INVALID_NAME');
  if (email && !EMAIL_RE.test(email))
    throw new CrmAdminClientError('E-mail inválido.', 'INVALID_EMAIL');

  const supabase = getSupabaseClient();

  const { data: client, error: cErr } = await supabase
    .from('clients')
    .insert({
      nome: name,
      email: email || `sem-email-${Date.now()}@placeholder.local`,
      telefone: input.phone?.trim() || null,
    })
    .select('id')
    .single();

  if (cErr) {
    if (cErr.code === '23505')
      throw new CrmAdminClientError('E-mail já cadastrado.', 'EMAIL_TAKEN');
    throw cErr;
  }

  const productId = input.product_name ? await resolveProductId(input.product_name) : null;

  const { error: cardErr } = await supabase.from('client_cards').insert({
    client_id: client.id,
    column_id: input.column_id || null,
    responsavel: input.responsible_name || null,
    produto_vinculado: productId,
  });

  if (cardErr) throw cardErr;

  if (input.responsible_name) {
    await notifyResponsibleAssigned(input.responsible_name, name);
  }

  const result = await buildClientView(client.id);
  if (!result) throw new CrmAdminClientError('Falha ao recuperar cliente criado.', 'NOT_FOUND');
  return result;
}

export async function patchCrmAdminClient(
  id: string,
  patch: CrmAdminClientPatch
): Promise<CrmAdminClient> {
  const supabase = getSupabaseClient();

  const { data: existing } = await supabase
    .from('clients')
    .select('id, nome')
    .eq('id', id)
    .maybeSingle();
  if (!existing) throw new CrmAdminClientError('Cliente não encontrado.', 'NOT_FOUND');

  let previousResponsible: string | null = null;
  if (patch.responsible_name !== undefined) {
    const { data: existingCard } = await supabase
      .from('client_cards')
      .select('responsavel')
      .eq('client_id', id)
      .maybeSingle();
    previousResponsible = existingCard?.responsavel ?? null;
  }

  const clientUpdates: Record<string, unknown> = {};
  if (patch.name !== undefined) {
    const name = patch.name.trim();
    if (!NAME_RE.test(name))
      throw new CrmAdminClientError('Nome não pode ser vazio.', 'INVALID_NAME');
    clientUpdates['nome'] = name;
  }
  if (patch.email !== undefined) {
    const email = patch.email.trim().toLowerCase();
    if (email && !EMAIL_RE.test(email))
      throw new CrmAdminClientError('E-mail inválido.', 'INVALID_EMAIL');
    clientUpdates['email'] = email;
  }
  if (patch.phone !== undefined) {
    clientUpdates['telefone'] = patch.phone.trim() || null;
  }

  if (Object.keys(clientUpdates).length) {
    const { error } = await supabase.from('clients').update(clientUpdates).eq('id', id);
    if (error) {
      if (error.code === '23505')
        throw new CrmAdminClientError('E-mail já cadastrado.', 'EMAIL_TAKEN');
      throw error;
    }
  }

  const cardUpdates: Record<string, unknown> = {};
  if (patch.column_id !== undefined) cardUpdates['column_id'] = patch.column_id;
  if (patch.responsible_name !== undefined)
    cardUpdates['responsavel'] = patch.responsible_name || null;
  if (patch.product_name !== undefined) {
    cardUpdates['produto_vinculado'] = patch.product_name
      ? await resolveProductId(patch.product_name)
      : null;
  }

  if (Object.keys(cardUpdates).length) {
    const { data: card } = await supabase
      .from('client_cards')
      .select('id')
      .eq('client_id', id)
      .maybeSingle();

    if (card) {
      const { error } = await supabase.from('client_cards').update(cardUpdates).eq('client_id', id);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('client_cards')
        .insert({ client_id: id, ...cardUpdates });
      if (error) throw error;
    }
  }

  if (patch.responsible_name && patch.responsible_name !== previousResponsible) {
    const leadName = (clientUpdates['nome'] as string | undefined) ?? existing.nome;
    await notifyResponsibleAssigned(patch.responsible_name, leadName);
  }

  const result = await buildClientView(id);
  if (!result) throw new CrmAdminClientError('Falha ao recuperar cliente atualizado.', 'NOT_FOUND');
  return result;
}

// Remove um lead do board sem apagar o histórico (soft-delete): marca clients.status
// como 'inativo', que já é filtrado por listCrmAdminClients/buildClientView-callers.
// Preserva client_cards e interactions para auditoria, consistente com o padrão de
// remoção lógica usado no resto do CRM (interações, colunas).
export async function removeCrmAdminClient(id: string): Promise<void> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('clients')
    .update({ status: 'inativo' })
    .eq('id', id)
    .eq('status', 'ativo')
    .select('id')
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new CrmAdminClientError('Cliente não encontrado.', 'NOT_FOUND');
}
