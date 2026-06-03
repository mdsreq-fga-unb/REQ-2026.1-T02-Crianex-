import type { NextFunction, Request, Response } from 'express';
import type { ValidatedAuthContext } from './validate-jwt.js';

export function requireRole(role: string) {
  return (_req: Request, response: Response, next: NextFunction): void => {
    const auth = (response.locals as { auth?: ValidatedAuthContext }).auth;

    if (!auth) {
      response.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (auth.user.role !== role) {
      response.status(403).json({ message: `Acesso negado — papel '${role}' necessário.` });
      return;
    }

    next();
  };
}
