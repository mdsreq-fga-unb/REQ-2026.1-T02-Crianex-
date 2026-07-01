import { getSupabaseClient } from '../config/supabase.js';
import { getNotificationEventType, HEX_COLOR_RE } from './notification-event-types.js';

export type NotificationTemplateRecord = {
  id: string;
  tipo_evento: string;
  nome: string;
  conteudo: string;
  color: string;
  is_default: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type NotificationTemplateInput = {
  tipo_evento: string;
  nome: string;
  conteudo: string;
  color?: string;
};

export type NotificationTemplateUpdateInput = Partial<NotificationTemplateInput>;

// Tipo de evento reservado para o template padrão de fallback (seed #205) —
// nunca pode ser usado por um template comum, para não colidir com o fallback.
export const DEFAULT_TEMPLATE_TIPO_EVENTO = '__default__';

const SELECT = 'id, tipo_evento, nome, conteudo, color, is_default, active, created_at, updated_at';

export class NotificationTemplateServiceError extends Error {
  constructor(
    message: string,
    public readonly code: 'NOT_FOUND' | 'DUPLICATE_EVENT' | 'PROTECTED' | 'INVALID'
  ) {
    super(message);
    this.name = 'NotificationTemplateServiceError';
  }
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function handleSupabaseError(err: unknown): never {
  const e = err as { code?: string };
  if (e.code === '23505') {
    throw new NotificationTemplateServiceError(
      'Já existe um template ativo para este tipo de evento.',
      'DUPLICATE_EVENT'
    );
  }
  throw err;
}

export function validateTemplateInput(input: {
  tipo_evento?: unknown;
  nome?: unknown;
  conteudo?: unknown;
  color?: unknown;
}): string | null {
  if (input.tipo_evento !== undefined && !isNonEmptyString(input.tipo_evento)) {
    return "Campo 'tipo_evento' é obrigatório.";
  }
  if (input.nome !== undefined && !isNonEmptyString(input.nome)) {
    return "Campo 'nome' é obrigatório.";
  }
  if (input.conteudo !== undefined && !isNonEmptyString(input.conteudo)) {
    return "Campo 'conteudo' é obrigatório.";
  }
  if (input.tipo_evento === DEFAULT_TEMPLATE_TIPO_EVENTO) {
    return 'Tipo de evento reservado para o template padrão do sistema.';
  }
  if (input.tipo_evento !== undefined && isNonEmptyString(input.tipo_evento)) {
    const eventType = getNotificationEventType(input.tipo_evento.trim());
    if (!eventType) {
      return "Campo 'tipo_evento' inválido. Escolha um dos tipos disponíveis.";
    }
    if (!eventType.implemented) {
      return `O tipo '${eventType.label}' ainda não está implementado e não pode ser usado em templates.`;
    }
  }
  if (
    input.color !== undefined &&
    (!isNonEmptyString(input.color) || !HEX_COLOR_RE.test(input.color))
  ) {
    return "Campo 'color' deve ser uma cor hexadecimal válida (ex.: #7f3fe5).";
  }
  return null;
}

// Lista templates ativos, agrupáveis por tipo de evento no cliente (F08 · #204).
export async function listActiveTemplates(): Promise<NotificationTemplateRecord[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('notification_templates')
    .select(SELECT)
    .eq('active', true)
    .order('tipo_evento', { ascending: true });

  if (error) throw error;
  return (data ?? []) as NotificationTemplateRecord[];
}

// Desativa (soft) qualquer template ativo do tipo informado, exceto o próprio
// registro sendo editado (excludeId). Usado para que escolher um tipo em
// create/update ative aquele template automaticamente, substituindo qualquer
// template anterior do mesmo tipo em vez de bloquear com duplicidade — o índice
// único parcial da migration continua como rede de segurança contra corrida.
async function deactivatePreviousActiveForType(
  tipoEvento: string,
  excludeId?: string
): Promise<void> {
  const supabase = getSupabaseClient();
  let query = supabase
    .from('notification_templates')
    .update({ active: false })
    .eq('tipo_evento', tipoEvento)
    .eq('active', true)
    .eq('is_default', false);

  if (excludeId) query = query.neq('id', excludeId);

  const { error } = await query;
  if (error) throw error;
}

// Cria um template associado a um tipo de evento (RF15). O tipo escolhido é ativado
// automaticamente ao salvar: qualquer template ativo anterior do mesmo tipo_evento é
// desativado antes do insert, então só existe 1 template ativo por tipo por vez.
export async function createTemplate(
  input: NotificationTemplateInput
): Promise<NotificationTemplateRecord> {
  const supabase = getSupabaseClient();
  const tipoEvento = input.tipo_evento.trim();
  const color = input.color?.trim() || getNotificationEventType(tipoEvento)?.color || '#7f3fe5';

  await deactivatePreviousActiveForType(tipoEvento);

  const { data, error } = await supabase
    .from('notification_templates')
    .insert([
      {
        tipo_evento: tipoEvento,
        nome: input.nome.trim(),
        conteudo: input.conteudo,
        color,
      },
    ])
    .select(SELECT)
    .single();

  if (error) handleSupabaseError(error);
  return data as NotificationTemplateRecord;
}

// Edita um template existente sem duplicar o registro (RF56). Se o tipo_evento for
// alterado, o mesmo comportamento de ativação automática do create se aplica:
// qualquer outro template ativo do novo tipo é desativado antes do update.
export async function updateTemplate(
  id: string,
  input: NotificationTemplateUpdateInput
): Promise<NotificationTemplateRecord> {
  const supabase = getSupabaseClient();

  const payload: Record<string, unknown> = {};
  if (input.tipo_evento !== undefined) {
    const tipoEvento = input.tipo_evento.trim();
    payload['tipo_evento'] = tipoEvento;
    await deactivatePreviousActiveForType(tipoEvento, id);
  }
  if (input.nome !== undefined) payload['nome'] = input.nome.trim();
  if (input.conteudo !== undefined) payload['conteudo'] = input.conteudo;
  if (input.color !== undefined) payload['color'] = input.color.trim();

  const { data, error } = await supabase
    .from('notification_templates')
    .update(payload)
    .eq('id', id)
    .select(SELECT)
    .maybeSingle();

  if (error) handleSupabaseError(error);
  if (!data) throw new NotificationTemplateServiceError('Template não encontrado.', 'NOT_FOUND');
  return data as NotificationTemplateRecord;
}

// Remove logicamente um template (active=false), nunca DELETE físico, para não
// quebrar o histórico de notificações já enviadas com este template (RF57).
// Idempotente: reaplicar em um template já inativo (ou inexistente) retorna null (404).
// O template padrão de fallback nunca pode ser inativado (PROTECTED).
export async function inactivateTemplate(id: string): Promise<NotificationTemplateRecord | null> {
  const supabase = getSupabaseClient();

  const { data: existing, error: fetchError } = await supabase
    .from('notification_templates')
    .select('is_default')
    .eq('id', id)
    .eq('active', true)
    .maybeSingle();

  if (fetchError) throw fetchError;
  if (!existing) return null;
  if (existing.is_default) {
    throw new NotificationTemplateServiceError(
      'O template padrão de fallback não pode ser removido.',
      'PROTECTED'
    );
  }

  const { data, error } = await supabase
    .from('notification_templates')
    .update({ active: false })
    .eq('id', id)
    .select(SELECT)
    .maybeSingle();

  if (error) throw error;
  return (data as NotificationTemplateRecord) ?? null;
}

// Resolve o template ativo para um tipo de evento; cai para o template padrão de
// fallback (seed #205) quando não há template específico configurado (RF57 · #203).
export async function getTemplateForEvent(
  tipoEvento: string
): Promise<NotificationTemplateRecord | null> {
  const supabase = getSupabaseClient();

  const { data: specific, error: specificError } = await supabase
    .from('notification_templates')
    .select(SELECT)
    .eq('tipo_evento', tipoEvento)
    .eq('active', true)
    .maybeSingle();

  if (specificError) throw specificError;
  if (specific) return specific as NotificationTemplateRecord;

  const { data: fallback, error: fallbackError } = await supabase
    .from('notification_templates')
    .select(SELECT)
    .eq('is_default', true)
    .eq('active', true)
    .maybeSingle();

  if (fallbackError) throw fallbackError;
  return (fallback as NotificationTemplateRecord) ?? null;
}
