import { Router } from 'express';
import { validateJWT } from '../middleware/validate-jwt.js';
import { requireRole } from '../middleware/require-role.js';
import {
  updateClient,
  ClientError,
  type ClientPatch,
  type ClientStatus,
} from './clients.service.js';

const clientsRouter = Router();
const ownerGuard = [validateJWT, requireRole('owner')];

const BAD_REQUEST_CODES = new Set([
  'MISSING_ID',
  'INVALID_NOME',
  'INVALID_EMAIL',
  'INVALID_STATUS',
  'EMPTY_PATCH',
]);

// PATCH /api/admin/crm/clients/:id — edita dados do cliente e inativação (RF35, RF36)
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
  if (typeof req.body?.['status'] === 'string') patch.status = req.body['status'] as ClientStatus;

  try {
    const client = await updateClient(id, patch);
    res.status(200).json(client);
  } catch (err) {
    if (err instanceof ClientError) {
      if (err.code === 'NOT_FOUND') {
        res.status(404).json({ message: err.message });
        return;
      }
      if (err.code === 'DUPLICATE_EMAIL') {
        res.status(409).json({ message: err.message });
        return;
      }
      if (BAD_REQUEST_CODES.has(err.code)) {
        res.status(400).json({ message: err.message });
        return;
      }
    }
    console.error('[crm-clients] update error:', err);
    res.status(500).json({ message: 'Falha ao atualizar cliente.' });
  }
});

export { clientsRouter };
