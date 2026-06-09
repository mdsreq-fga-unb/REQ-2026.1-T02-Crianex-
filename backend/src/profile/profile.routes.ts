import { Router } from 'express';
import { validateJWT, type ValidatedAuthContext } from '../middleware/validate-jwt.js';
import { getMyProfile, updateMyProfile } from './profile.service.js';
import { getSupabaseClient } from '../config/supabase.js';

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

profileRouter.patch('/me/password', validateJWT, async (req, res) => {
  const auth = (res.locals as { auth: ValidatedAuthContext }).auth;
  const newPassword =
    typeof req.body?.['new_password'] === 'string' ? req.body['new_password'] : '';

  if (!newPassword || newPassword.length < 8) {
    res.status(400).json({ message: 'A nova senha deve ter no mínimo 8 caracteres.' });
    return;
  }

  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.admin.updateUserById(auth.user.id, {
      password: newPassword,
    });
    if (error) throw error;
    res.json({ message: 'Senha atualizada com sucesso.' });
  } catch (err) {
    console.error('[profile] password update error:', err);
    res.status(500).json({ message: 'Falha ao atualizar senha.' });
  }
});

export { profileRouter };
