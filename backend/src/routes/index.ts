import { Router } from 'express';
import { productsRouter } from '../products/products.routes.js';

export const router = Router();

router.use('/products', productsRouter);
