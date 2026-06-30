import { Router } from 'express';
import { validateJWT } from '../middleware/validate-jwt.js';
import { requireRole } from '../middleware/require-role.js';
import {
  listColumns,
  createColumn,
  updateColumn,
  reorderColumns,
  deleteColumn,
  CrmColumnError,
} from './crm-columns.service.js';

const crmColumnsRouter = Router();
const ownerGuard = [validateJWT, requireRole('owner')];

// GET /api/admin/crm/columns — lista todas as colunas do funil (RF38, RF40)
crmColumnsRouter.get('/', ...ownerGuard, async (_req, res) => {
  try {
    const columns = await listColumns();
    res.status(200).json(columns);
  } catch (err) {
    console.error('[crm-columns] list error:', err);
    res.status(500).json({ message: 'Falha ao listar colunas.' });
  }
});

// POST /api/admin/crm/columns — cria nova coluna no funil (RF38)
crmColumnsRouter.post('/', ...ownerGuard, async (req, res) => {
  const title = typeof req.body?.['title'] === 'string' ? req.body['title'] : '';
  const color = typeof req.body?.['color'] === 'string' ? req.body['color'] : undefined;
  const position = typeof req.body?.['position'] === 'number' ? req.body['position'] : undefined;
  const entry_hint = typeof req.body?.['entry_hint'] === 'string' ? req.body['entry_hint'] : undefined;
  const exit_hint = typeof req.body?.['exit_hint'] === 'string' ? req.body['exit_hint'] : undefined;

  try {
    const column = await createColumn({
      title,
      ...(color !== undefined && { color }),
      ...(position !== undefined && { position }),
      ...(entry_hint !== undefined && { entry_hint }),
      ...(exit_hint !== undefined && { exit_hint }),
    });
    res.status(201).json(column);
  } catch (err) {
    if (err instanceof CrmColumnError) {
      if (err.code === 'INVALID_TITLE' || err.code === 'INVALID_COLOR') {
        res.status(400).json({ message: err.message });
        return;
      }
    }
    console.error('[crm-columns] create error:', err);
    res.status(500).json({ message: 'Falha ao criar coluna.' });
  }
});

// PATCH /api/admin/crm/columns/reorder — reordena múltiplas colunas (RF40 · RNF22)
crmColumnsRouter.patch('/reorder', ...ownerGuard, async (req, res) => {
  const order = req.body?.['order'];
  if (!Array.isArray(order) || order.some((o) => typeof o.id !== 'string' || typeof o.position !== 'number')) {
    res.status(400).json({ message: 'Body deve ser { order: [{id, position}] }.' });
    return;
  }

  try {
    await reorderColumns(order as { id: string; position: number }[]);
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[crm-columns] reorder error:', err);
    res.status(500).json({ message: 'Falha ao reordenar colunas.' });
  }
});

// PATCH /api/admin/crm/columns/:id — renomeia/recolore/reposiciona coluna (RF38, RF40)
crmColumnsRouter.patch('/:id', ...ownerGuard, async (req, res) => {
  const id = typeof req.params?.['id'] === 'string' ? req.params['id'].trim() : '';
  if (!id) {
    res.status(400).json({ message: 'ID da coluna é obrigatório.' });
    return;
  }

  const patch: {
    title?: string;
    color?: string;
    position?: number;
    entry_hint?: string | null;
    exit_hint?: string | null;
  } = {};

  if (typeof req.body?.['title'] === 'string') patch.title = req.body['title'];
  if (typeof req.body?.['color'] === 'string') patch.color = req.body['color'];
  if (typeof req.body?.['position'] === 'number') patch.position = req.body['position'];
  if ('entry_hint' in (req.body ?? {})) patch.entry_hint = req.body['entry_hint'] ?? null;
  if ('exit_hint' in (req.body ?? {})) patch.exit_hint = req.body['exit_hint'] ?? null;

  try {
    const column = await updateColumn(id, patch);
    res.status(200).json(column);
  } catch (err) {
    if (err instanceof CrmColumnError) {
      if (err.code === 'NOT_FOUND') {
        res.status(404).json({ message: err.message });
        return;
      }
      if (err.code === 'INVALID_TITLE' || err.code === 'INVALID_COLOR') {
        res.status(400).json({ message: err.message });
        return;
      }
    }
    console.error('[crm-columns] update error:', err);
    res.status(500).json({ message: 'Falha ao atualizar coluna.' });
  }
});

// DELETE /api/admin/crm/columns/:id — remoção protegida (RF39)
// Retorna 409 se a coluna tem cards vinculados ou é a default
crmColumnsRouter.delete('/:id', ...ownerGuard, async (req, res) => {
  const id = typeof req.params?.['id'] === 'string' ? req.params['id'].trim() : '';
  if (!id) {
    res.status(400).json({ message: 'ID da coluna é obrigatório.' });
    return;
  }

  try {
    await deleteColumn(id);
    res.status(204).send();
  } catch (err) {
    if (err instanceof CrmColumnError) {
      if (err.code === 'NOT_FOUND') {
        res.status(404).json({ message: err.message });
        return;
      }
      if (err.code === 'IS_DEFAULT' || err.code === 'HAS_CARDS' || err.code === 'LAST_COLUMN') {
        res.status(409).json({ message: err.message, code: err.code });
        return;
      }
    }
    console.error('[crm-columns] delete error:', err);
    res.status(500).json({ message: 'Falha ao remover coluna.' });
  }
});

export { crmColumnsRouter };
