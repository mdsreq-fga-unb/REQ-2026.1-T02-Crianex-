import { Router } from 'express';
import multer from 'multer';
import { validateJWT } from '../middleware/validate-jwt.js';
import { requireRole } from '../middleware/require-role.js';
import {
  createProductController,
  deleteProductController,
  getAllProductsController,
  getPublishedProductsController,
  reorderProductsController,
  updateProductController,
  uploadProductImageController,
} from './products.controller.js';

const productsRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Formato de arquivo inválido. Use apenas JPG, PNG ou WEBP.'));
    }
  },
});

const ownerGuard = [validateJWT, requireRole('owner')];

productsRouter.get('/', getPublishedProductsController);
productsRouter.get('/admin', ...ownerGuard, getAllProductsController);
productsRouter.post('/upload', ...ownerGuard, upload.single('image'), uploadProductImageController);
productsRouter.post('/', ...ownerGuard, createProductController);
productsRouter.post('/reorder', ...ownerGuard, reorderProductsController);
productsRouter.patch('/reorder', ...ownerGuard, reorderProductsController);
productsRouter.patch('/:id', ...ownerGuard, updateProductController);
productsRouter.delete('/:id', ...ownerGuard, deleteProductController);

export { productsRouter };
