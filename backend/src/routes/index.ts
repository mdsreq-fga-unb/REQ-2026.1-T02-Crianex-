import { Router } from 'express';
import healthRouter from '../health/health.routes';
import { authRouter } from '../auth/auth.routes.js';

export const router = Router();

router.use('/health', healthRouter);
router.use('/auth', authRouter);

// Rotas de feature serão registradas aqui conforme as issues forem implementadas:
//
// import { membersRouter } from './members.js';  // issue #75
// import { productsRouter } from './products.js'; // issue #79
// import { leadsRouter } from './leads.js';      // issue #86
// import { faqRouter } from './faq.js';          // issue #95
