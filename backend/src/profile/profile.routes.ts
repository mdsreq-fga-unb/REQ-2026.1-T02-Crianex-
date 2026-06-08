import { Router } from 'express';
import { validateJWT, type ValidatedAuthContext } from '../middleware/validate-jwt.js';
import { getMyProfile, updateMyProfile } from './profile.service.js';

const profileRouter = Router();

profileRouter.get('/me', validateJWT, async (_req, res) => {
  const auth = (res.locals as { auth: ValidatedAuthContext }).auth;
  try {
    const profile = await getMyProfile(auth.user.id);
    res.json(profile);
  } catch (err) {
    console.error('[profile] get error:', err);
    res.status(500).json({ message: 'Falha ao carregar perfil.' });
  }
});

profileRouter.patch('/me', validateJWT, async (req, res) => {
  const auth = (res.locals as { auth: ValidatedAuthContext }).auth;

  const updates: { name?: string; phone?: string | null; bio?: string | null } = {};
  if (typeof req.body?.['name'] === 'string') {
    const trimmed = req.body['name'].trim();
    if (trimmed) updates.name = trimmed;
  }
  if ('phone' in (req.body ?? {})) {
    updates.phone = typeof req.body['phone'] === 'string' ? req.body['phone'].trim() || null : null;
  }
  if ('bio' in (req.body ?? {})) {
    updates.bio = typeof req.body['bio'] === 'string' ? req.body['bio'].trim() || null : null;
  }

  if (Object.keys(updates).length === 0) {
    res.status(400).json({ message: 'Nenhum campo a atualizar.' });
    return;
  }

  try {
    const profile = await updateMyProfile(auth.user.id, updates);
    res.json(profile);
  } catch (err) {
    console.error('[profile] update error:', err);
    res.status(500).json({ message: 'Falha ao salvar perfil.' });
  }
});

export { profileRouter };
