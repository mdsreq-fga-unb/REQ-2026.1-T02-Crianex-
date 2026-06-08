import { Router } from 'express';
import { validateJWT, type ValidatedAuthContext } from '../middleware/validate-jwt.js';
import { requireRole } from '../middleware/require-role.js';
import { requirePermission } from '../middleware/require-permission.js';
import {
  listMembers,
  createMember,
  updateMember,
  updateMemberStatus,
  deleteMember,
  MemberServiceError,
} from './members.service.js';

const membersRouter = Router();
const ownerGuard = [validateJWT, requireRole('owner')];
const viewGuard = [validateJWT, requirePermission('members', 'v')];

membersRouter.get('/', ...viewGuard, async (_req, res) => {
  try {
    const members = await listMembers();
    res.status(200).json(members);
  } catch (err) {
    console.error('[members] list error:', err);
    res.status(500).json({ message: 'Falha ao listar membros.' });
  }
});

membersRouter.post('/', ...ownerGuard, async (req, res) => {
  const name = typeof req.body?.['name'] === 'string' ? req.body['name'].trim() : '';
  const email =
    typeof req.body?.['email'] === 'string' ? req.body['email'].trim().toLowerCase() : '';
  const roleRaw = req.body?.['role'];
  const displayRoleRaw = req.body?.['display_role'];

  const display_role = typeof displayRoleRaw === 'string' ? displayRoleRaw.trim() : undefined;
  const permissions =
    req.body?.['permissions'] && typeof req.body['permissions'] === 'object'
      ? (req.body['permissions'] as Record<string, string[]>)
      : undefined;

  // Derive auth role: display_role takes precedence over role field
  const role: 'owner' | 'member' =
    display_role === 'Owner' || display_role === 'Administrador'
      ? 'owner'
      : roleRaw === 'owner'
        ? 'owner'
        : 'member';

  if (!name || !email) {
    res.status(400).json({ message: 'Nome e e-mail são obrigatórios.' });
    return;
  }

  try {
    const member = await createMember(name, email, role, display_role, permissions);
    res.status(201).json(member);
  } catch (err) {
    if (err instanceof MemberServiceError && err.code === 'DUPLICATE_EMAIL') {
      res.status(409).json({ message: err.message });
      return;
    }
    const errMsg = (err instanceof Error ? err.message : String(err)).toLowerCase();
    if (errMsg.includes('permission denied') && errMsg.includes('role or status')) {
      res.status(500).json({
        message:
          'Migration pendente no banco de dados. Execute "supabase migration up" e reinicie o backend.',
      });
      return;
    }
    console.error('[members] create error:', err);
    res.status(500).json({ message: 'Falha ao criar membro.' });
  }
});

membersRouter.patch('/:id/status', ...ownerGuard, async (req, res) => {
  const id = typeof req.params?.['id'] === 'string' ? req.params['id'].trim() : '';
  const auth = (res.locals as { auth: ValidatedAuthContext }).auth;
  const statusRaw = req.body?.['status'];

  if (!id) {
    res.status(400).json({ message: 'ID do membro é obrigatório.' });
    return;
  }

  if (statusRaw !== 'active' && statusRaw !== 'inactive') {
    res.status(400).json({ message: 'Status inválido. Use "active" ou "inactive".' });
    return;
  }

  try {
    const member = await updateMemberStatus(id, statusRaw, auth.user.id);
    res.status(200).json(member);
  } catch (err) {
    if (err instanceof MemberServiceError) {
      if (err.code === 'NOT_FOUND') {
        res.status(404).json({ message: err.message });
        return;
      }
      if (err.code === 'SELF_DEACTIVATE') {
        res.status(400).json({ message: err.message });
        return;
      }
    }
    console.error('[members] status update error:', err);
    res.status(500).json({ message: 'Falha ao atualizar status do membro.' });
  }
});

membersRouter.patch('/:id', ...ownerGuard, async (req, res) => {
  const id = typeof req.params?.['id'] === 'string' ? req.params['id'].trim() : '';

  if (!id) {
    res.status(400).json({ message: 'ID do membro é obrigatório.' });
    return;
  }

  const updates: {
    name?: string;
    role?: 'owner' | 'member';
    display_role?: string;
    permissions?: Record<string, string[]>;
  } = {};
  if (typeof req.body?.['name'] === 'string') updates.name = req.body['name'].trim();
  if (req.body?.['role'] === 'owner' || req.body?.['role'] === 'member')
    updates.role = req.body['role'];
  if (typeof req.body?.['display_role'] === 'string')
    updates.display_role = req.body['display_role'].trim();
  if (req.body?.['permissions'] && typeof req.body['permissions'] === 'object')
    updates.permissions = req.body['permissions'] as Record<string, string[]>;

  try {
    const member = await updateMember(id, updates);
    res.status(200).json(member);
  } catch (err) {
    if (err instanceof MemberServiceError && err.code === 'NOT_FOUND') {
      res.status(404).json({ message: err.message });
      return;
    }
    console.error('[members] update error:', err);
    res.status(500).json({ message: 'Falha ao atualizar membro.' });
  }
});

membersRouter.delete('/:id', ...ownerGuard, async (req, res) => {
  const id = typeof req.params?.['id'] === 'string' ? req.params['id'].trim() : '';
  const auth = (res.locals as { auth: ValidatedAuthContext }).auth;

  if (!id) {
    res.status(400).json({ message: 'ID do membro é obrigatório.' });
    return;
  }

  try {
    await deleteMember(id, auth.user.id);
    res.status(204).send();
  } catch (err) {
    if (err instanceof MemberServiceError) {
      if (err.code === 'SELF_DELETE') {
        res.status(400).json({ message: err.message });
        return;
      }
      if (err.code === 'NOT_FOUND') {
        res.status(404).json({ message: err.message });
        return;
      }
    }
    console.error('[members] delete error:', err);
    res.status(500).json({ message: 'Falha ao remover membro.' });
  }
});

export { membersRouter };
