import { Router } from 'express';
import { validateJWT } from '../middleware/validate-jwt.js';
import { requireRole } from '../middleware/require-role.js';
import { updateCard, CrmServiceError } from './crm.service.js';

const crmRouter = Router();
const ownerGuard = [validateJWT, requireRole('owner')];

crmRouter.patch('/cards/:id', ...ownerGuard, async (req, res) => {
  const id = typeof req.params?.['id'] === 'string' ? req.params['id'].trim() : '';

  if (!id) {
    res.status(400).json({ message: 'ID do card é obrigatório.' });
    return;
  }

  // At least one updatable field must be present
  const hasColumnId = typeof req.body?.['column_id'] === 'string';
  const hasResponsavel = 'responsavel' in (req.body ?? {});
  const hasProduto = 'produto_vinculado' in (req.body ?? {});

  if (!hasColumnId && !hasResponsavel && !hasProduto) {
    res.status(400).json({ message: 'Nenhum campo para atualizar foi enviado.' });
    return;
  }

  const updates: {
    column_id?: string;
    responsavel?: string | null;
    produto_vinculado?: string | null;
  } = {};

  if (hasColumnId) updates.column_id = (req.body['column_id'] as string).trim();
  if (hasResponsavel) updates.responsavel = req.body['responsavel'] ?? null;
  if (hasProduto) updates.produto_vinculado = req.body['produto_vinculado'] ?? null;

  try {
    const card = await updateCard(id, updates);
    res.status(200).json(card);
  } catch (err) {
    if (err instanceof CrmServiceError) {
      if (err.code === 'NOT_FOUND') {
        res.status(404).json({ message: err.message });
        return;
      }
      if (err.code === 'INVALID_COLUMN') {
        res.status(400).json({ message: err.message });
        return;
      }
    }
    console.error('[crm] update card error:', err);
    res.status(500).json({ message: 'Falha ao atualizar card.' });
  }
});

export { crmRouter };
