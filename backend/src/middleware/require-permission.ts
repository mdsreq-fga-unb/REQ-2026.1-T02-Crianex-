import type { NextFunction, Request, Response } from 'express';
import type { ValidatedAuthContext } from './validate-jwt.js';
import { getSupabaseClient } from '../config/supabase.js';

export function requirePermission(module: string, action: 'v' | 'e' | 'a') {
  return async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    const auth = (res.locals as { auth?: ValidatedAuthContext }).auth;

    if (!auth) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (auth.user.role === 'owner') {
      next();
      return;
    }

    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('profiles')
        .select('permissions')
        .eq('id', auth.user.id)
        .single();

      if (error || !data) {
        res.status(403).json({ error: 'Forbidden' });
        return;
      }

      const perms = data.permissions as Record<string, string[]> | null;
      const allowed = Array.isArray(perms?.[module]) && perms[module].includes(action);

      if (!allowed) {
        res.status(403).json({ error: 'Forbidden', module, action });
        return;
      }

      next();
    } catch {
      res.status(403).json({ error: 'Forbidden' });
    }
  };
}
