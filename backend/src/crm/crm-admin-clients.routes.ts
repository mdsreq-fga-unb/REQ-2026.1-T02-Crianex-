import { Router } from 'express';
import { validateJWT } from '../middleware/validate-jwt.js';
import { requirePermission } from '../middleware/require-permission.js';
import {
  listCrmAdminClients,
  createCrmAdminClient,
  patchCrmAdminClient,
  removeCrmAdminClient,
  reactivateCrmAdminClient,
  CrmAdminClientError,
} from './crm-admin-clients.service.js';

const crmAdminClientsRouter = Router();
// RN03: member precisa de 'v' para ver, 'e' para editar/criar, 'a' para excluir.
const viewGuard = [validateJWT, requirePermission('crm', 'v')];
const editGuard = [validateJWT, requirePermission('crm', 'e')];
const deleteGuard = [validateJWT, requirePermission('crm', 'a')];

// GET /api/admin/crm/clients — lista clientes ativos com dados do card (RF35, RF36)
crmAdminClientsRouter.get('/', ...viewGuard, async (_req, res) => {
  try {
    const clients = await listCrmAdminClients();
    res.status(200).json(clients);
  } catch (err) {
    console.error('[crm-admin-clients] list error:', err);
    res.status(500).json({ message: 'Falha ao listar clientes.' });
  }
});

// GET /api/admin/crm/clients/inactive — lista leads inativados, para permitir reativação (RF36)
crmAdminClientsRouter.get('/inactive', ...viewGuard, async (_req, res) => {
  try {
    const clients = await listCrmAdminClients('inativo');
    res.status(200).json(clients);
  } catch (err) {
    console.error('[crm-admin-clients] list inactive error:', err);
    res.status(500).json({ message: 'Falha ao listar clientes inativos.' });
  }
});

// POST /api/admin/crm/clients — cria cliente + card no CRM (RF37)
crmAdminClientsRouter.post('/', ...editGuard, async (req, res) => {
  const name = typeof req.body?.['name'] === 'string' ? req.body['name'] : '';
  const email = typeof req.body?.['email'] === 'string' ? req.body['email'] : '';
  const phone = typeof req.body?.['phone'] === 'string' ? req.body['phone'] : undefined;
  const column_id = typeof req.body?.['column_id'] === 'string' ? req.body['column_id'] : undefined;
  const responsible_name =
    typeof req.body?.['responsible_name'] === 'string' ? req.body['responsible_name'] : undefined;
  const product_name =
    typeof req.body?.['product_name'] === 'string' ? req.body['product_name'] : undefined;

  try {
    const createInput: {
      name: string;
      email: string;
      phone?: string;
      column_id?: string;
      responsible_name?: string;
      product_name?: string;
    } = { name, email };
    if (phone !== undefined) createInput.phone = phone;
    if (column_id !== undefined) createInput.column_id = column_id;
    if (responsible_name !== undefined) createInput.responsible_name = responsible_name;
    if (product_name !== undefined) createInput.product_name = product_name;
    const client = await createCrmAdminClient(createInput);
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
crmAdminClientsRouter.patch('/:id', ...editGuard, async (req, res) => {
  const id = typeof req.params?.['id'] === 'string' ? req.params['id'].trim() : '';
  if (!id) {
    res.status(400).json({ message: 'ID do cliente é obrigatório.' });
    return;
  }

  const patch: {
    name?: string;
    email?: string;
    phone?: string;
    column_id?: string;
    responsible_name?: string;
    product_name?: string;
  } = {};

  if (typeof req.body?.['name'] === 'string') patch.name = req.body['name'];
  if (typeof req.body?.['email'] === 'string') patch.email = req.body['email'];
  if ('phone' in (req.body ?? {})) patch.phone = req.body['phone'] ?? '';
  if (typeof req.body?.['column_id'] === 'string') patch.column_id = req.body['column_id'];
  if ('responsible_name' in (req.body ?? {}))
    patch.responsible_name = req.body['responsible_name'] ?? '';
  if ('product_name' in (req.body ?? {})) patch.product_name = req.body['product_name'] ?? '';

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

// DELETE /api/admin/crm/clients/:id — remove o lead do board (soft-delete: status=inativo)
crmAdminClientsRouter.delete('/:id', ...deleteGuard, async (req, res) => {
  const id = typeof req.params?.['id'] === 'string' ? req.params['id'].trim() : '';
  if (!id) {
    res.status(400).json({ message: 'ID do cliente é obrigatório.' });
    return;
  }

  try {
    await removeCrmAdminClient(id);
    res.status(204).send();
  } catch (err) {
    if (err instanceof CrmAdminClientError && err.code === 'NOT_FOUND') {
      res.status(404).json({ message: err.message });
      return;
    }
    console.error('[crm-admin-clients] remove error:', err);
    res.status(500).json({ message: 'Falha ao remover cliente.' });
  }
});

// POST /api/admin/crm/clients/:id/reactivate — volta o lead inativado ao board (RF36)
crmAdminClientsRouter.post('/:id/reactivate', ...editGuard, async (req, res) => {
  const id = typeof req.params?.['id'] === 'string' ? req.params['id'].trim() : '';
  if (!id) {
    res.status(400).json({ message: 'ID do cliente é obrigatório.' });
    return;
  }

  try {
    const client = await reactivateCrmAdminClient(id);
    res.status(200).json(client);
  } catch (err) {
    if (err instanceof CrmAdminClientError && err.code === 'NOT_FOUND') {
      res.status(404).json({ message: err.message });
      return;
    }
    console.error('[crm-admin-clients] reactivate error:', err);
    res.status(500).json({ message: 'Falha ao reativar cliente.' });
  }
});

export { crmAdminClientsRouter };
