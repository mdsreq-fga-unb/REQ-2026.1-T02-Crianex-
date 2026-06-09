import { Router } from 'express';
import { submitRating } from './faq.ratings.service.js';
import { validateJWT } from '../middleware/validate-jwt.js';
import { requireRole } from '../middleware/require-role.js';
import { requirePermission } from '../middleware/require-permission.js';
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  listArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  FaqServiceError,
  type FaqCategoryInput,
  type FaqArticleUpdateInput,
} from './faq.service.js';

const faqRouter = Router();
const ownerGuard = [validateJWT, requireRole('owner')];
const viewGuard = [validateJWT, requirePermission('faq', 'v')];
const editGuard = [validateJWT, requirePermission('faq', 'e')];

// --- Categories ---

faqRouter.get('/categories', ...viewGuard, async (_req, res) => {
  try {
    const categories = await listCategories();
    res.status(200).json(categories);
  } catch (err) {
    console.error('[faq] list categories error:', err);
    res.status(500).json({ message: 'Falha ao listar categorias.' });
  }
});

const faqPublicRouter = Router();

faqPublicRouter.post('/ratings', async (req, res) => {
  const article_id =
    typeof req.body?.['article_id'] === 'string' ? req.body['article_id'].trim() : '';
  const rating = req.body?.['rating'];

  if (!article_id) {
    res.status(400).json({ message: 'article_id é obrigatório.' });
    return;
  }

  if (rating !== 'y' && rating !== 'n') {
    res.status(400).json({ message: 'rating deve ser "y" ou "n".' });
    return;
  }

  // Trust-proxy-aware client IP (see app.ts) — avoids X-Forwarded-For spoofing
  // that would let a single client bypass the one-rating-per-session dedup.
  const ip = req.ip?.trim() || req.socket.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';

  try {
    const result = await submitRating({ article_id, rating, ip, userAgent });
    res.status(200).json(result);
  } catch (err: unknown) {
    const e = err as { code?: string; message?: string };
    if (e.code === 'NOT_FOUND') {
      res.status(404).end();
      return;
    }
    console.error('[faq] submit rating error:', err);
    res.status(500).json({ message: 'Falha ao registrar avaliação.' });
  }
});

faqRouter.post('/categories', ...editGuard, async (req, res) => {
  const label_pt = typeof req.body?.['label_pt'] === 'string' ? req.body['label_pt'].trim() : '';
  const label_en = typeof req.body?.['label_en'] === 'string' ? req.body['label_en'].trim() : '';

  if (!label_pt || !label_en) {
    res.status(400).json({ message: 'label_pt e label_en são obrigatórios.' });
    return;
  }

  const input: FaqCategoryInput = {
    label_pt,
    label_en,
    product_id: req.body?.['product_id'] ?? null,
    display_order: typeof req.body?.['display_order'] === 'number' ? req.body['display_order'] : 0,
  };

  try {
    const category = await createCategory(input);
    res.status(201).json(category);
  } catch (err) {
    console.error('[faq] create category error:', err);
    res.status(500).json({ message: 'Falha ao criar categoria.' });
  }
});

faqRouter.patch('/categories/:id', ...editGuard, async (req, res) => {
  const id = typeof req.params?.['id'] === 'string' ? req.params['id'].trim() : '';
  if (!id) {
    res.status(400).json({ message: 'ID da categoria é obrigatório.' });
    return;
  }

  const updates: Partial<FaqCategoryInput> = {};
  if (typeof req.body?.['label_pt'] === 'string') updates.label_pt = req.body['label_pt'].trim();
  if (typeof req.body?.['label_en'] === 'string') updates.label_en = req.body['label_en'].trim();
  if ('product_id' in (req.body ?? {})) updates.product_id = req.body['product_id'];
  if (typeof req.body?.['display_order'] === 'number')
    updates.display_order = req.body['display_order'];

  try {
    const category = await updateCategory(id, updates);
    res.status(200).json(category);
  } catch (err) {
    if (err instanceof FaqServiceError && err.code === 'NOT_FOUND') {
      res.status(404).json({ message: err.message });
      return;
    }
    console.error('[faq] update category error:', err);
    res.status(500).json({ message: 'Falha ao atualizar categoria.' });
  }
});

faqRouter.delete('/categories/:id', ...ownerGuard, async (req, res) => {
  const id = typeof req.params?.['id'] === 'string' ? req.params['id'].trim() : '';
  if (!id) {
    res.status(400).json({ message: 'ID da categoria é obrigatório.' });
    return;
  }

  try {
    await deleteCategory(id);
    res.status(204).send();
  } catch (err) {
    if (err instanceof FaqServiceError) {
      if (err.code === 'PROTECTED') {
        res.status(409).json({ message: err.message });
        return;
      }
      if (err.code === 'NOT_FOUND') {
        res.status(404).json({ message: err.message });
        return;
      }
    }
    console.error('[faq] delete category error:', err);
    res.status(500).json({ message: 'Falha ao remover categoria.' });
  }
});

// --- Articles ---

faqRouter.get('/articles', ...viewGuard, async (req, res) => {
  const categoryId =
    typeof req.query?.['category_id'] === 'string' ? req.query['category_id'] : undefined;
  try {
    const articles = await listArticles(categoryId);
    res.status(200).json(articles);
  } catch (err) {
    console.error('[faq] list articles error:', err);
    res.status(500).json({ message: 'Falha ao listar artigos.' });
  }
});

faqRouter.post('/articles', ...editGuard, async (req, res) => {
  const title_pt = typeof req.body?.['title_pt'] === 'string' ? req.body['title_pt'].trim() : '';
  const category_id =
    typeof req.body?.['category_id'] === 'string' ? req.body['category_id'].trim() : '';

  if (!title_pt || !category_id) {
    res.status(400).json({ message: 'title_pt e category_id são obrigatórios.' });
    return;
  }

  try {
    const articleInput: {
      title_pt: string;
      category_id: string;
      title_en?: string;
      body_pt?: string;
      body_en?: string;
      published?: boolean;
    } = { title_pt, category_id };
    if (typeof req.body?.['title_en'] === 'string') articleInput.title_en = req.body['title_en'];
    if (typeof req.body?.['body_pt'] === 'string') articleInput.body_pt = req.body['body_pt'];
    if (typeof req.body?.['body_en'] === 'string') articleInput.body_en = req.body['body_en'];
    if (typeof req.body?.['published'] === 'boolean')
      articleInput.published = req.body['published'];
    const article = await createArticle(articleInput);
    res.status(201).json(article);
  } catch (err) {
    console.error('[faq] create article error:', err);
    res.status(500).json({ message: 'Falha ao criar artigo.' });
  }
});

faqRouter.patch('/articles/:id', ...editGuard, async (req, res) => {
  const id = typeof req.params?.['id'] === 'string' ? req.params['id'].trim() : '';
  if (!id) {
    res.status(400).json({ message: 'ID do artigo é obrigatório.' });
    return;
  }

  const updates: FaqArticleUpdateInput = {};
  if (typeof req.body?.['title_pt'] === 'string') updates.title_pt = req.body['title_pt'].trim();
  if (typeof req.body?.['title_en'] === 'string') updates.title_en = req.body['title_en'].trim();
  if (typeof req.body?.['body_pt'] === 'string') updates.body_pt = req.body['body_pt'];
  if (typeof req.body?.['body_en'] === 'string') updates.body_en = req.body['body_en'];
  if (typeof req.body?.['category_id'] === 'string') updates.category_id = req.body['category_id'];
  if (typeof req.body?.['published'] === 'boolean') updates.published = req.body['published'];

  try {
    const article = await updateArticle(id, updates);
    res.status(200).json(article);
  } catch (err) {
    if (err instanceof FaqServiceError && err.code === 'NOT_FOUND') {
      res.status(404).json({ message: err.message });
      return;
    }
    console.error('[faq] update article error:', err);
    res.status(500).json({ message: 'Falha ao atualizar artigo.' });
  }
});

faqRouter.delete('/articles/:id', ...ownerGuard, async (req, res) => {
  const id = typeof req.params?.['id'] === 'string' ? req.params['id'].trim() : '';
  if (!id) {
    res.status(400).json({ message: 'ID do artigo é obrigatório.' });
    return;
  }

  try {
    await deleteArticle(id);
    res.status(204).send();
  } catch (err) {
    if (err instanceof FaqServiceError) {
      if (err.code === 'PUBLISHED') {
        res.status(409).json({ message: err.message });
        return;
      }
      if (err.code === 'NOT_FOUND') {
        res.status(404).json({ message: err.message });
        return;
      }
    }
    console.error('[faq] delete article error:', err);
    res.status(500).json({ message: 'Falha ao remover artigo.' });
  }
});

export { faqRouter, faqPublicRouter };
