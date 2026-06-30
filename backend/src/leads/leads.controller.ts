import type { Request, Response } from 'express';
import { validate, sanitizeInput, captureLead } from './leads.service.js';

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

  try {
    await captureLead(input);
    return res.status(201).json({ success: true });
  } catch (err) {
    console.error('[contact] capture_lead failed:', err);
    return res.status(500).json({ error: 'Erro interno. Tente novamente mais tarde.' });
  }
}
