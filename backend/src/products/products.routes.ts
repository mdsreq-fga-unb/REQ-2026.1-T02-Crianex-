import { Router } from 'express';
import { requireAdminAuth } from '../middleware/requireAdminAuth.js';
import {
  createProductController,
  deleteProductController,
  getProductsController,
  reorderProductsController,
  updateProductController,
} from './products.controller.js';

const productsRouter = Router();

productsRouter.get('/', getProductsController);
productsRouter.get('/admin', requireAdminAuth, getProductsController);
productsRouter.post('/', requireAdminAuth, createProductController);
productsRouter.post('/reorder', requireAdminAuth, reorderProductsController);
productsRouter.patch('/reorder', requireAdminAuth, reorderProductsController);
productsRouter.patch('/:id', requireAdminAuth, updateProductController);
productsRouter.delete('/:id', requireAdminAuth, deleteProductController);

export { productsRouter };