import { Router } from 'express';
import { validateJWT } from '../middleware/validate-jwt.js';
import { requireRole } from '../middleware/require-role.js';
import {
  listActiveTemplates,
  createTemplate,
  updateTemplate,
  inactivateTemplate,
  validateTemplateInput,
  NotificationTemplateServiceError,
} from './notification-templates.service.js';
import { NOTIFICATION_EVENT_TYPES } from './notification-event-types.js';

const notificationTemplatesRouter = Router();
const ownerGuard = [validateJWT, requireRole('owner')];

// GET /api/admin/notification-templates/event-types — catálogo fixo de tipos de
// evento (label, grupo, cor sugerida, se já está implementado), usado pelo select
// de tipo no formulário de template. Rota fixa antes de '/:id' para não colidir.
notificationTemplatesRouter.get('/event-types', ...ownerGuard, (_req, res) => {
  res.status(200).json({ eventTypes: NOTIFICATION_EVENT_TYPES });
});

// GET /api/admin/notification-templates — lista templates ativos (F08 · #204).
notificationTemplatesRouter.get('/', ...ownerGuard, async (_req, res) => {
  try {
    const templates = await listActiveTemplates();
    res.status(200).json({ templates });
  } catch (err) {
    console.error('[notification-templates] list error:', err);
    res.status(500).json({ message: 'Falha ao listar templates de notificação.' });
  }
});

// POST /api/admin/notification-templates — cria template (RF15 · #202).
notificationTemplatesRouter.post('/', ...ownerGuard, async (req, res) => {
  const { tipo_evento, nome, conteudo, color } = req.body ?? {};

  const validationError = validateTemplateInput({ tipo_evento, nome, conteudo, color });
  if (validationError || !tipo_evento || !nome || !conteudo) {
    res.status(400).json({ message: validationError ?? 'Campos obrigatórios ausentes.' });
    return;
  }

  try {
    const template = await createTemplate({ tipo_evento, nome, conteudo, color });
    res.status(201).json(template);
  } catch (err) {
    if (err instanceof NotificationTemplateServiceError && err.code === 'DUPLICATE_EVENT') {
      res.status(409).json({ message: err.message });
      return;
    }
    console.error('[notification-templates] create error:', err);
    res.status(500).json({ message: 'Falha ao criar template de notificação.' });
  }
});

// PATCH /api/admin/notification-templates/:id — edita template (RF56 · #202).
notificationTemplatesRouter.patch('/:id', ...ownerGuard, async (req, res) => {
  const id = typeof req.params['id'] === 'string' ? req.params['id'].trim() : '';
  const { tipo_evento, nome, conteudo, color } = req.body ?? {};

  if (!id) {
    res.status(400).json({ message: 'ID do template é obrigatório.' });
    return;
  }

  const validationError = validateTemplateInput({ tipo_evento, nome, conteudo, color });
  if (validationError) {
    res.status(400).json({ message: validationError });
    return;
  }

  try {
    const template = await updateTemplate(id, { tipo_evento, nome, conteudo, color });
    res.status(200).json(template);
  } catch (err) {
    if (err instanceof NotificationTemplateServiceError) {
      if (err.code === 'NOT_FOUND') {
        res.status(404).json({ message: err.message });
        return;
      }
      if (err.code === 'DUPLICATE_EVENT') {
        res.status(409).json({ message: err.message });
        return;
      }
    }
    console.error('[notification-templates] update error:', err);
    res.status(500).json({ message: 'Falha ao atualizar template de notificação.' });
  }
});

// DELETE /api/admin/notification-templates/:id — inativação lógica (RF57 · #203).
// Idempotente: id inexistente ou já inativo retorna 404.
notificationTemplatesRouter.delete('/:id', ...ownerGuard, async (req, res) => {
  const id = typeof req.params['id'] === 'string' ? req.params['id'].trim() : '';

  if (!id) {
    res.status(400).json({ message: 'ID do template é obrigatório.' });
    return;
  }

  try {
    const updated = await inactivateTemplate(id);
    if (!updated) {
      res.status(404).json({ message: 'Template não encontrado.' });
      return;
    }
    res.status(200).json(updated);
  } catch (err) {
    if (err instanceof NotificationTemplateServiceError && err.code === 'PROTECTED') {
      res.status(409).json({ message: err.message });
      return;
    }
    console.error('[notification-templates] delete error:', err);
    res.status(500).json({ message: 'Falha ao remover template de notificação.' });
  }
});

export { notificationTemplatesRouter };
