import { Router } from 'express';
import { validateJWT } from '../middleware/validate-jwt.js';
import { requireRole } from '../middleware/require-role.js';
import {
  listCrmAdminClients,
  createCrmAdminClient,
  patchCrmAdminClient,
  CrmAdminClientError,
} from './crm-admin-clients.service.js';

const crmAdminClientsRouter = Router();
const ownerGuard = [validateJWT, requireRole('owner')];

// GET /api/admin/crm/clients — lista clientes ativos com dados do card (RF35, RF36)
crmAdminClientsRouter.get('/', ...ownerGuard, async (_req, res) => {
  try {
    const clients = await listCrmAdminClients();
    res.status(200).json(clients);
  } catch (err) {
    console.error('[crm-admin-clients] list error:', err);
    res.status(500).json({ message: 'Falha ao listar clientes.' });
  }
});

// POST /api/admin/crm/clients — cria cliente + card no CRM (RF37)
crmAdminClientsRouter.post('/', ...ownerGuard, async (req, res) => {
  const name = typeof req.body?.['name'] === 'string' ? req.body['name'] : '';
  const email = typeof req.body?.['email'] === 'string' ? req.body['email'] : '';
  const column_id = typeof req.body?.['column_id'] === 'string' ? req.body['column_id'] : undefined;
  const responsible_name =
    typeof req.body?.['responsible_name'] === 'string' ? req.body['responsible_name'] : undefined;
  const product_name =
    typeof req.body?.['product_name'] === 'string' ? req.body['product_name'] : undefined;

  try {
    const client = await createCrmAdminClient({
      name,
      email,
      column_id,
      responsible_name,
      product_name,
    });
    res.status(201).json(client);
  } catch (err) {
    if (err instanceof CrmAdminClientError) {
      if (err.code === 'EMAIL_TAKEN') {
        res.status(409).json({ message: err.message, code: err.code });
        return;
      }
      if (err.code === 'INVALID_NAME' || err.code === 'INVALID_EMAIL') {
        res.status(400).json({ message: err.message, code: err.code });
        return;
      }
    }
    console.error('[crm-admin-clients] create error:', err);
    res.status(500).json({ message: 'Falha ao criar cliente.' });
  }
});

// PATCH /api/admin/crm/clients/:id — atualiza cliente e card (RF39)
crmAdminClientsRouter.patch('/:id', ...ownerGuard, async (req, res) => {
  const id = typeof req.params?.['id'] === 'string' ? req.params['id'].trim() : '';
  if (!id) {
    res.status(400).json({ message: 'ID do cliente é obrigatório.' });
    return;
  }

  const patch: {
    name?: string;
    email?: string;
    column_id?: string;
    responsible_name?: string;
    product_name?: string;
  } = {};

  if (typeof req.body?.['name'] === 'string') patch.name = req.body['name'];
  if (typeof req.body?.['email'] === 'string') patch.email = req.body['email'];
  if (typeof req.body?.['column_id'] === 'string') patch.column_id = req.body['column_id'];
  if ('responsible_name' in (req.body ?? {}))
    patch.responsible_name = req.body['responsible_name'] ?? '';
  if ('product_name' in (req.body ?? {}))
    patch.product_name = req.body['product_name'] ?? '';

  try {
    const updated = await patchCrmAdminClient(id, patch);
    res.status(200).json(updated);
  } catch (err) {
    if (err instanceof CrmAdminClientError) {
      if (err.code === 'NOT_FOUND') {
        res.status(404).json({ message: err.message });
        return;
      }
      if (err.code === 'EMAIL_TAKEN') {
        res.status(409).json({ message: err.message, code: err.code });
        return;
      }
      if (err.code === 'INVALID_NAME' || err.code === 'INVALID_EMAIL') {
        res.status(400).json({ message: err.message, code: err.code });
        return;
      }
    }
    console.error('[crm-admin-clients] patch error:', err);
    res.status(500).json({ message: 'Falha ao atualizar cliente.' });
  }
});

export { crmAdminClientsRouter };
