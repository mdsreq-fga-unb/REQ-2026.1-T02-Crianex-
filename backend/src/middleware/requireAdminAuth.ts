import type { NextFunction, Request, Response } from 'express';
import { getAdminSupabase } from '../lib/adminSupabase.js';

export async function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Autenticação necessária.' });
    }

    const accessToken = authHeader.slice('Bearer '.length);
    const supabase = getAdminSupabase();
    const { data, error } = await supabase.auth.getUser(accessToken);

    if (error || !data.user) {
      return res.status(401).json({ error: 'Sessão inválida ou expirada.' });
    }

    return next();
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao validar autenticação.' });
  }
}