import { Router } from 'express';
import { validateJWT } from '../middleware/validate-jwt.js';
import { requireRole } from '../middleware/require-role.js';
import { updateClient, ClientError, type ClientPatch } from './clients.service.js';

const clientsRouter = Router();
const ownerGuard = [validateJWT, requireRole('owner')];

clientsRouter.patch('/:id', ...ownerGuard, async (req, res) => {
  const id = typeof req.params?.['id'] === 'string' ? req.params['id'].trim() : '';
  if (!id) {
    res.status(400).json({ message: 'ID do cliente é obrigatório.' });
    return;
  }

  const patch: ClientPatch = {};
  if (typeof req.body?.['nome'] === 'string') patch.nome = req.body['nome'];
  if (typeof req.body?.['email'] === 'string') patch.email = req.body['email'];
  if ('telefone' in (req.body ?? {})) patch.telefone = req.body['telefone'] ?? null;
  // Cast cru: o valor real é validado em runtime por updateClient (INVALID_STATUS).
  if (typeof req.body?.['status'] === 'string')
    patch.status = req.body['status'] as 'ativo' | 'inativo';

  try {
    const client = await updateClient(id, patch);
    res.status(200).json(client);
  } catch (err) {
    if (err instanceof ClientError) {
      if (err.code === 'NOT_FOUND') {
        res.status(404).json({ message: err.message });
        return;
      }
      if (err.code === 'EMAIL_TAKEN') {
        res.status(409).json({ message: err.message, code: err.code });
        return;
      }
      if (
        err.code === 'INVALID_NOME' ||
        err.code === 'INVALID_EMAIL' ||
        err.code === 'INVALID_STATUS' ||
        err.code === 'EMPTY_PATCH'
      ) {
        res.status(400).json({ message: err.message });
        return;
      }
    }
    console.error('[clients] update error:', err);
    res.status(500).json({ message: 'Falha ao atualizar cliente.' });
  }
});

export { clientsRouter };
