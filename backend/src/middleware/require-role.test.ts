import { describe, it, expect, vi } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { requireRole } from './require-role.js';
import type { ValidatedAuthContext } from './validate-jwt.js';

function makeRes(authContext?: ValidatedAuthContext) {
  const res = {
    locals: authContext ? { auth: authContext } : {},
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;
  return res;
}

const makeNext = () => vi.fn() as unknown as NextFunction;

describe('requireRole middleware', () => {
  describe('Dado que auth context está presente e role bate', () => {
    it('Quando role === owner, deve chamar next()', () => {
      const res = makeRes({ accessToken: 'tok', user: { id: '1', name: 'Admin', role: 'owner' } });
      const next = makeNext();

      requireRole('owner')({} as Request, res, next);

      expect(next).toHaveBeenCalledOnce();
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('Dado que auth context está presente mas role não corresponde', () => {
    it('Quando role === member e requer owner, deve retornar 403 { error: Forbidden }', () => {
      const res = makeRes({ accessToken: 'tok', user: { id: '1', name: 'User', role: 'member' } });
      const next = makeNext();

      requireRole('owner')({} as Request, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Forbidden' });
    });

    it('Não deve expor qual role é esperado no body', () => {
      const res = makeRes({ accessToken: 'tok', user: { id: '1', name: 'User', role: 'member' } });
      const next = makeNext();

      requireRole('owner')({} as Request, res, next);

      const body = (res.json as ReturnType<typeof vi.fn>).mock.calls[0]?.[0];
      expect(JSON.stringify(body)).not.toContain('owner');
    });
  });

  describe('Dado que validateJWT não populou o auth context', () => {
    it('Quando auth está ausente em locals, deve retornar 401 { error: Unauthorized }', () => {
      const res = makeRes();
      const next = makeNext();

      requireRole('owner')({} as Request, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });
  });

  describe('Extensibilidade de roles', () => {
    it('Deve aceitar qualquer string como role alvo', () => {
      const res = makeRes({
        accessToken: 'tok',
        user: { id: '1', name: 'Viewer', role: 'viewer' },
      });
      const next = makeNext();

      requireRole('viewer')({} as Request, res, next);

      expect(next).toHaveBeenCalledOnce();
    });
  });
});
