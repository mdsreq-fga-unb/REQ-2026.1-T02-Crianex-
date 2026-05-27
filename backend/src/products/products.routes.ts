import { Router } from 'express';
import multer from 'multer';
import { requireAdminAuth } from '../middleware/requireAdminAuth.js';
import {
  createProductController,
  deleteProductController,
  getProductsController,
  reorderProductsController,
  updateProductController,
  uploadProductImageController,
} from './products.controller.js';

const productsRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Formato de arquivo inválido. Use apenas JPG, PNG ou WEBP.'));
    }
  },
});

productsRouter.get('/', getProductsController);
productsRouter.get('/admin', requireAdminAuth, getProductsController);
productsRouter.post(
  '/upload',
  requireAdminAuth,
  upload.single('image'),
  uploadProductImageController
);
productsRouter.post('/', requireAdminAuth, createProductController);
productsRouter.post('/reorder', requireAdminAuth, reorderProductsController);
productsRouter.patch('/reorder', requireAdminAuth, reorderProductsController);
productsRouter.patch('/:id', requireAdminAuth, updateProductController);
productsRouter.delete('/:id', requireAdminAuth, deleteProductController);

export { productsRouter };
