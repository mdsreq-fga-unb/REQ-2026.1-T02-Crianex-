import type { Request, Response } from 'express';
import {
  listAllMembers,
  createMember,
  updateMember,
  updateMemberStatus,
  deleteMember,
  MemberServiceError,
} from './members.service.js';

function handleError(res: Response, err: unknown, defaultMessage: string): Response {
  if (err instanceof MemberServiceError) {
    return res.status(err.status).json({ message: err.message });
  }
  console.error(`[members controller] Error:`, err);
  return res.status(500).json({ message: defaultMessage });
}

export async function listMembersController(req: Request, res: Response): Promise<Response> {
  try {
    const members = await listAllMembers();
    return res.status(200).json(members);
  } catch (err) {
    return handleError(res, err, 'Falha ao listar membros.');
  }
}

export async function createMemberController(req: Request, res: Response): Promise<Response> {
  const { name, email, role } = req.body as Record<string, unknown>;

  if (typeof name !== 'string' || typeof email !== 'string' || typeof role !== 'string') {
    return res
      .status(400)
      .json({ message: 'Nome, e-mail e papel são obrigatórios e devem ser texto.' });
  }

  try {
    const newMember = await createMember(name, email, role as 'owner' | 'member');
    return res.status(201).json(newMember);
  } catch (err) {
    return handleError(res, err, 'Falha ao cadastrar membro.');
  }
}

export async function updateMemberController(req: Request, res: Response): Promise<Response> {
  const { id } = req.params as { id: string };
  const body = req.body as Record<string, unknown>;

  if (!id) {
    return res.status(400).json({ message: 'ID do membro é obrigatório.' });
  }

  if (body['email'] !== undefined) {
    return res.status(400).json({ message: 'Não é permitido alterar o e-mail do membro.' });
  }

  try {
    const updated = await updateMember(id, body);
    return res.status(200).json(updated);
  } catch (err) {
    return handleError(res, err, 'Falha ao atualizar membro.');
  }
}

export async function updateMemberStatusController(req: Request, res: Response): Promise<Response> {
  const { id } = req.params as { id: string };
  const { status } = req.body as Record<string, unknown>;

  if (!id) {
    return res.status(400).json({ message: 'ID do membro é obrigatório.' });
  }

  if (status !== 'active' && status !== 'inactive') {
    return res.status(400).json({ message: 'Status inválido. Deve ser active ou inactive.' });
  }

  try {
    const updated = await updateMemberStatus(id, status);
    return res.status(200).json(updated);
  } catch (err) {
    return handleError(res, err, 'Falha ao atualizar status do membro.');
  }
}

export async function deleteMemberController(req: Request, res: Response): Promise<Response> {
  const { id } = req.params as { id: string };
  const authContext = (res.locals as { auth?: { user: { id: string } } }).auth;
  const currentUserId = authContext?.user?.id;

  if (!id) {
    return res.status(400).json({ message: 'ID do membro é obrigatório.' });
  }

  if (id === currentUserId) {
    return res.status(400).json({ message: 'Não é permitido remover a si mesmo.' });
  }

  try {
    await deleteMember(id);
    return res.status(204).send();
  } catch (err) {
    return handleError(res, err, 'Falha ao remover membro.');
  }
}
