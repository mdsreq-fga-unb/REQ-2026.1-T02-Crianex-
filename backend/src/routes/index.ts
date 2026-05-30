import { Router } from 'express';
import healthRouter from '../health/health.routes.js';
import { authRouter } from '../auth/auth.routes.js';
import leadsRouter from '../leads/leads.routes.js';
import { productsRouter } from '../products/products.routes.js';

export const router = Router();

router.use('/health', healthRouter);
router.use('/auth', authRouter);
router.use('/public', leadsRouter);
router.use('/products', productsRouter);
