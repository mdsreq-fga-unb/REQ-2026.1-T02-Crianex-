import { Router } from 'express';
import healthRouter from '../health/health.routes';

export const router = Router();

router.use('/health', healthRouter);

// Rotas de feature serão registradas aqui conforme as issues forem implementadas:
//
// import { authRouter } from './auth.js';        // issue #67
// import { membersRouter } from './members.js';  // issue #75
// import { productsRouter } from './products.js'; // issue #79
// import { leadsRouter } from './leads.js';      // issue #86
// import { faqRouter } from './faq.js';          // issue #95
