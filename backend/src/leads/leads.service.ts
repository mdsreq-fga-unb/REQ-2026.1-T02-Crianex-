import { createHash } from 'crypto';
import sanitizeHtml from 'sanitize-html';
import { supabase } from '../lib/supabase.js';

export type ContactInput = {
  name: string;
  email: string;
  message: string;
  company?: string | undefined;
  product_interest?: string | undefined;
};

export type ValidationError = { field: string; message: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME = 100;
const MAX_MESSAGE = 2000;
const MAX_COMPANY = 150;

export function hashIp(ip: string): string {
  return createHash('sha256')
    .update(ip || 'unknown')
    .digest('hex');
}

function sanitize(value: string): string {
  return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }).trim();
}

export function validate(input: ContactInput): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!input.name) {
    errors.push({ field: 'name', message: 'Nome é obrigatório.' });
  } else if (input.name.length > MAX_NAME) {
    errors.push({ field: 'name', message: `Nome deve ter no máximo ${MAX_NAME} caracteres.` });
  }

  if (!EMAIL_RE.test(input.email)) {
    errors.push({ field: 'email', message: 'E-mail inválido.' });
  }

  if (!input.message) {
    errors.push({ field: 'message', message: 'Mensagem é obrigatória.' });
  } else if (input.message.length > MAX_MESSAGE) {
    errors.push({
      field: 'message',
      message: `Mensagem deve ter no máximo ${MAX_MESSAGE} caracteres.`,
    });
  }

  if (input.company && input.company.length > MAX_COMPANY) {
    errors.push({
      field: 'company',
      message: `Empresa deve ter no máximo ${MAX_COMPANY} caracteres.`,
    });
  }

  return errors;
}

export function sanitizeInput(body: Record<string, unknown>): ContactInput {
  return {
    name: sanitize(String(body['name'])),
    email: sanitize(String(body['email'])).toLowerCase(),
    message: sanitize(String(body['message'])),
    company:
      body['company'] && typeof body['company'] === 'string'
        ? sanitize(body['company']) || undefined
        : undefined,
    product_interest:
      body['product_interest'] && typeof body['product_interest'] === 'string'
        ? sanitize(body['product_interest']) || undefined
        : undefined,
  };
}

// Monta o conteúdo da notificação do novo lead. clients/client_cards não têm
// colunas para mensagem/empresa/interesse, então esses dados ficam registrados
// no histórico da notificação (RNF11 — minimização: nada além do necessário).
export function buildNotificationContent(input: ContactInput): string {
  const partes = [`Novo lead via formulário público: ${input.name} <${input.email}>`];
  if (input.company) partes.push(`Empresa: ${input.company}`);
  if (input.product_interest) partes.push(`Interesse: ${input.product_interest}`);
  partes.push(`Mensagem: ${input.message}`);
  return partes.join(' — ');
}

// Captação pública de lead em transação ACID: client + client_card (coluna
// default) + notification são criados de uma vez via a RPC capture_lead. O corpo
// PL/pgSQL roda em uma única transação, então qualquer falha desfaz tudo (RF37).
export async function captureLead(input: ContactInput): Promise<void> {
  const { error } = await supabase.rpc('capture_lead', {
    p_nome: input.name,
    p_email: input.email,
    p_conteudo: buildNotificationContent(input),
  } as never);

  if (error) {
    throw new Error(`capture_lead transaction failed: ${error.message}`);
  }
}
