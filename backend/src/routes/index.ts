import { Router } from 'express';
import healthRouter from '../health/health.routes.js';
import { authRouter } from '../auth/auth.routes.js';
import leadsRouter from '../leads/leads.routes.js';
import { productsPublicRouter, productsAdminRouter } from '../products/products.routes.js';
import { membersRouter } from '../members/members.routes.js';
import { faqRouter } from '../faq/faq.routes.js';

export const router = Router();

router.use('/health', healthRouter);
router.use('/auth', authRouter);
router.use('/public', leadsRouter);
router.use('/products', productsPublicRouter);
router.use('/admin/products', productsAdminRouter);
router.use('/admin/members', membersRouter);
router.use('/admin/faq', faqRouter);
