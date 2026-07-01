import { Router } from 'express';
import { validateJWT } from '../middleware/validate-jwt.js';
import { requireRole } from '../middleware/require-role.js';
import {
  listNotifications,
  countUnread,
  isNotificationStatus,
  updateNotificationStatus,
} from './notifications.service.js';

const notificationsRouter = Router();
const ownerGuard = [validateJWT, requireRole('owner')];

// GET /api/admin/notifications?status=unread|read — lista notificações ordenadas por
// created_at DESC + contador de não lidas. (F07 · CP9 · RNF03)
notificationsRouter.get('/', ...ownerGuard, async (req, res) => {
  const rawStatus = req.query['status'];

  if (rawStatus !== undefined && !isNotificationStatus(rawStatus)) {
    res.status(400).json({ message: "Parâmetro 'status' deve ser 'unread' ou 'read'." });
    return;
  }

  try {
    const [notifications, unreadCount] = await Promise.all([
      listNotifications(isNotificationStatus(rawStatus) ? rawStatus : undefined),
      countUnread(),
    ]);
    res.status(200).json({ notifications, unreadCount });
  } catch (err) {
    console.error('[notifications] list error:', err);
    res.status(500).json({ message: 'Falha ao listar notificações.' });
  }
});

// PATCH /api/admin/notifications/:id — marca uma notificação como lida (status).
// Idempotente: reenviar o mesmo status numa notificação já lida retorna 200. (F07 · #188)
notificationsRouter.patch('/:id', ...ownerGuard, async (req, res) => {
  const id = typeof req.params['id'] === 'string' ? req.params['id'].trim() : '';
  const status = req.body?.['status'];

  if (!id) {
    res.status(400).json({ message: 'ID da notificação é obrigatório.' });
    return;
  }
  if (!isNotificationStatus(status)) {
    res.status(400).json({ message: "Campo 'status' deve ser 'unread' ou 'read'." });
    return;
  }

  try {
    const updated = await updateNotificationStatus(id, status);
    if (!updated) {
      res.status(404).json({ message: 'Notificação não encontrada.' });
      return;
    }
    res.status(200).json(updated);
  } catch (err) {
    console.error('[notifications] update status error:', err);
    res.status(500).json({ message: 'Falha ao atualizar notificação.' });
  }
});

export { notificationsRouter };
