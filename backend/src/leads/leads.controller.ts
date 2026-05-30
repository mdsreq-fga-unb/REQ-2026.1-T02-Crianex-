import type { Request, Response } from 'express';
import { hashIp, validate, sanitizeInput, persistLead } from './leads.service.js';
import { extractIp } from '../lib/extract-ip.js';

export async function contactController(req: Request, res: Response): Promise<Response> {
  const body = req.body as Record<string, unknown>;

  if (body['website']) {
    return res.status(200).json({ success: true });
  }

  const input = sanitizeInput(body);
  const errors = validate(input);
  if (errors.length > 0) {
    return res.status(422).json({ errors });
  }

  const ipHash = hashIp(extractIp(req));

  try {
    await persistLead(input, ipHash);
    return res.status(201).json({ success: true });
  } catch (err) {
    console.error('[contact] insert failed:', err);
    return res.status(500).json({ error: 'Erro interno. Tente novamente mais tarde.' });
  }
}
