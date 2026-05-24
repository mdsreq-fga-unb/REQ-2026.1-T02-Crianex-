import type { Request, Response } from 'express';
import { hashIp, validate, sanitizeInput, persistLead } from './leads.service.js';

function extractIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  const raw = Array.isArray(forwarded)
    ? (forwarded[0] ?? '')
    : (forwarded?.split(',')[0] ?? req.ip ?? '');
  return raw.trim();
}

export async function contactController(req: Request, res: Response): Promise<Response> {
  const body = req.body as Record<string, unknown>;

  if (body['website']) {
    return res.status(200).json({ success: true });
  }

  const errors = validate(body);
  if (errors.length > 0) {
    return res.status(422).json({ errors });
  }

  const input = sanitizeInput(body);
  const ipHash = hashIp(extractIp(req));

  try {
    await persistLead(input, ipHash);
    return res.status(201).json({ success: true });
  } catch (err) {
    console.error('[contact] insert failed:', err);
    return res.status(500).json({ error: 'Erro interno. Tente novamente mais tarde.' });
  }
}
