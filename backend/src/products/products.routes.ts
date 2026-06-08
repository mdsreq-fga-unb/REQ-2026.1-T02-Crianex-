import { Router } from 'express';
import multer from 'multer';
import { validateJWT } from '../middleware/validate-jwt.js';
import { requireRole } from '../middleware/require-role.js';
import { requirePermission } from '../middleware/require-permission.js';
import {
  createProductController,
  deleteProductController,
  getAllProductsController,
  getPublishedProductsController,
  reorderProductsController,
  updateProductController,
  uploadProductImageController,
} from './products.controller.js';

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
const viewGuard = [validateJWT, requirePermission('products', 'v')];
const editGuard = [validateJWT, requirePermission('products', 'e')];

// Rota pública: apenas produtos publicados
const productsPublicRouter = Router();
productsPublicRouter.get('/', getPublishedProductsController);

// Rotas de admin: todas as operações CRUD
const productsAdminRouter = Router();
productsAdminRouter.get('/', ...viewGuard, getAllProductsController);
productsAdminRouter.post(
  '/upload',
  ...editGuard,
  upload.single('image'),
  uploadProductImageController
);
productsAdminRouter.post('/', ...editGuard, createProductController);
productsAdminRouter.post('/reorder', ...editGuard, reorderProductsController);
productsAdminRouter.patch('/reorder', ...editGuard, reorderProductsController);
productsAdminRouter.patch('/:id', ...editGuard, updateProductController);
productsAdminRouter.delete('/:id', ...ownerGuard, deleteProductController);

export { productsPublicRouter, productsAdminRouter };
