import { Router, type Response } from 'express';
import { validateJWT, type ValidatedAuthContext } from '../middleware/validate-jwt.js';
import { requireRole } from '../middleware/require-role.js';
import {
  createClientInteraction,
  CrmInteractionError,
  softDeleteClientInteraction,
  updateClientInteraction,
} from './crm-interactions.service.js';

const crmClientsRouter = Router();
const ownerGuard = [validateJWT, requireRole('owner')];

function handleInteractionError(err: unknown, res: Response): boolean {
  if (err instanceof CrmInteractionError) {
    if (
      err.code === 'INVALID_CLIENT_ID' ||
      err.code === 'INVALID_INTERACTION_ID' ||
      err.code === 'INVALID_AUTHOR_ID' ||
      err.code === 'INVALID_TIPO' ||
      err.code === 'INVALID_CONTEUDO' ||
      err.code === 'EMPTY_PATCH'
    ) {
      res.status(400).json({ message: err.message, code: err.code });
      return true;
    }

    if (err.code === 'NOT_FOUND') {
      res.status(404).json({ message: err.message, code: err.code });
      return true;
    }
  }

  return false;
}

// POST /api/crm/clients/:id/interactions - registra interação comercial (RF42)
crmClientsRouter.post('/:id/interactions', ...ownerGuard, async (req, res) => {
  const clientId = typeof req.params?.['id'] === 'string' ? req.params['id'] : '';
  const tipo = typeof req.body?.['tipo'] === 'string' ? req.body['tipo'] : '';
  const conteudo = typeof req.body?.['conteudo'] === 'string' ? req.body['conteudo'] : '';
  const auth = (res.locals as { auth?: ValidatedAuthContext }).auth;

  if (!auth) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const interaction = await createClientInteraction({
      clientId,
      authorId: auth.user.id,
      tipo,
      conteudo,
    });

    res.status(201).json(interaction);
  } catch (err) {
    if (handleInteractionError(err, res)) {
      return;
    }

    console.error('[crm-clients] create interaction error:', err);
    res.status(500).json({ message: 'Falha ao registrar interação.' });
  }
});

// PATCH /api/crm/clients/:id/interactions/:iid - edita interação preservando auditoria (RF59)
crmClientsRouter.patch('/:id/interactions/:iid', ...ownerGuard, async (req, res) => {
  const clientId = typeof req.params?.['id'] === 'string' ? req.params['id'] : '';
  const interactionId = typeof req.params?.['iid'] === 'string' ? req.params['iid'] : '';
  const patch: { tipo?: string; conteudo?: string } = {};

  if (typeof req.body?.['tipo'] === 'string') {
    patch.tipo = req.body['tipo'];
  }
  if (typeof req.body?.['conteudo'] === 'string') {
    patch.conteudo = req.body['conteudo'];
  }

  try {
    const interaction = await updateClientInteraction(clientId, interactionId, patch);
    res.status(200).json(interaction);
  } catch (err) {
    if (handleInteractionError(err, res)) {
      return;
    }

    console.error('[crm-clients] update interaction error:', err);
    res.status(500).json({ message: 'Falha ao atualizar interação.' });
  }
});

// DELETE /api/crm/clients/:id/interactions/:iid - remoção lógica da interação (RF53)
crmClientsRouter.delete('/:id/interactions/:iid', ...ownerGuard, async (req, res) => {
  const clientId = typeof req.params?.['id'] === 'string' ? req.params['id'] : '';
  const interactionId = typeof req.params?.['iid'] === 'string' ? req.params['iid'] : '';

  try {
    const interaction = await softDeleteClientInteraction(clientId, interactionId);
    res.status(200).json(interaction);
  } catch (err) {
    if (handleInteractionError(err, res)) {
      return;
    }

    console.error('[crm-clients] delete interaction error:', err);
    res.status(500).json({ message: 'Falha ao remover interação.' });
  }
});

export { crmClientsRouter };
