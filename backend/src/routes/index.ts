import { Router } from 'express';
import healthRouter from '../health/health.routes.js';
import leadsRouter from '../leads/leads.routes.js';

export const router = Router();

router.use('/health', healthRouter);
router.use('/public', leadsRouter);

// Rotas de feature serão registradas aqui conforme as issues forem implementadas:
//
// import { authRouter } from './auth.js';        // issue #67
// import { membersRouter } from './members.js';  // issue #75
// import { productsRouter } from './products.js'; // issue #79
// import { faqRouter } from './faq.js';          // issue #95
