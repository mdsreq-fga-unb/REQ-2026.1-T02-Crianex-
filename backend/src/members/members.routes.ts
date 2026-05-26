import { Router, type Request, type Response, type NextFunction } from 'express';
import { validateJWT } from '../middleware/validate-jwt.js';
import {
  listMembersController,
  createMemberController,
  updateMemberController,
  updateMemberStatusController,
  deleteMemberController,
} from './members.controller.js';

export function requireOwner(req: Request, res: Response, next: NextFunction): void {
  const auth = (res.locals as { auth?: { user: { role: string } } }).auth;
  if (!auth || auth.user.role !== 'owner') {
    res.status(403).json({ message: 'Acesso restrito a proprietários.' });
    return;
  }
  next();
}

const membersRouter = Router();

// Apply authentication and owner authorization to all CRUD endpoints
membersRouter.use(validateJWT);
membersRouter.use(requireOwner);

membersRouter.get('/', listMembersController);
membersRouter.post('/', createMemberController);
membersRouter.patch('/:id', updateMemberController);
membersRouter.patch('/:id/status', updateMemberStatusController);
membersRouter.delete('/:id', deleteMemberController);

export default membersRouter;
