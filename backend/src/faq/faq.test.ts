import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import { faqRouter } from './faq.routes.js';
import { getSupabaseClient } from '../config/supabase.js';

const originalBypass = process.env['ADMIN_AUTH_BYPASS'];

beforeAll(async () => {
  process.env['ADMIN_AUTH_BYPASS'] = 'true';

  // Remove dados residuais de execuções anteriores para garantir idempotência
  const supabase = getSupabaseClient();
  await supabase
    .from('faq_articles')
    .delete()
    .in('title_pt', ['Como usar a plataforma', 'Como configurar sua conta']);
  await supabase
    .from('faq_categories')
    .delete()
    .in('label_pt', ['Dúvidas Gerais', 'Perguntas Frequentes']);
});

afterAll(() => {
  if (originalBypass === undefined) {
    delete process.env['ADMIN_AUTH_BYPASS'];
  } else {
    process.env['ADMIN_AUTH_BYPASS'] = originalBypass;
  }
});

const app = express();
app.use(express.json());
app.use('/admin/faq', faqRouter);

describe('Suite de testes de integração — Endpoints CRUD FAQ', () => {
  let categoriaId: string;
  let artigoId: string;

  // --- Categorias ---

  describe('POST /admin/faq/categories', () => {
    it('Dado dados válidos, deve criar categoria, gerar slug sanitizado e retornar 201', async () => {
      const res = await request(app)
        .post('/admin/faq/categories')
        .send({ label_pt: 'Dúvidas Gerais', label_en: 'General Questions', display_order: 1 })
        .expect(201);

      categoriaId = res.body.id;
      expect(categoriaId).toBeTruthy();
      expect(res.body.label_pt).toBe('Dúvidas Gerais');
      expect(res.body.slug).toBe('duvidas-gerais');
    });

    it('Dado label_pt ausente, deve retornar 400', async () => {
      await request(app).post('/admin/faq/categories').send({ label_en: 'General' }).expect(400);
    });
  });

  describe('GET /admin/faq/categories', () => {
    it('Deve listar categorias ordenadas por display_order e retornar 200', async () => {
      const res = await request(app).get('/admin/faq/categories').expect(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.some((c: { id: string }) => c.id === categoriaId)).toBe(true);
    });
  });

  describe('PATCH /admin/faq/categories/:id', () => {
    it('Dado label_pt atualizado, deve regenerar o slug e retornar 200', async () => {
      const res = await request(app)
        .patch(`/admin/faq/categories/${categoriaId}`)
        .send({ label_pt: 'Perguntas Frequentes', label_en: 'FAQ' })
        .expect(200);

      expect(res.body.label_pt).toBe('Perguntas Frequentes');
      expect(res.body.slug).toBe('perguntas-frequentes');
    });
  });

  // --- Artigos ---

  describe('POST /admin/faq/articles', () => {
    it('Dado dados válidos, deve criar artigo com published=false, gerar slug e retornar 201', async () => {
      const res = await request(app)
        .post('/admin/faq/articles')
        .send({
          title_pt: 'Como usar a plataforma',
          title_en: 'How to use the platform',
          body_pt: 'Explicação detalhada.',
          body_en: 'Detailed explanation.',
          category_id: categoriaId,
        })
        .expect(201);

      artigoId = res.body.id;
      expect(artigoId).toBeTruthy();
      expect(res.body.published).toBe(false);
      expect(res.body.slug).toBe('como-usar-a-plataforma');
      expect(res.body.category_id).toBe(categoriaId);
    });

    it('Dado title_pt ausente, deve retornar 400', async () => {
      await request(app).post('/admin/faq/articles').send({ category_id: categoriaId }).expect(400);
    });
  });

  describe('GET /admin/faq/articles', () => {
    it('Deve listar todos os artigos e retornar 200', async () => {
      const res = await request(app).get('/admin/faq/articles').expect(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.some((a: { id: string }) => a.id === artigoId)).toBe(true);
    });

    it('Deve filtrar artigos por category_id quando passado via query', async () => {
      const res = await request(app)
        .get(`/admin/faq/articles?category_id=${categoriaId}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.every((a: { category_id: string }) => a.category_id === categoriaId)).toBe(
        true
      );
    });
  });

  describe('PATCH /admin/faq/articles/:id', () => {
    it('Dado campos parciais, deve atualizar apenas o payload e retornar 200', async () => {
      const res = await request(app)
        .patch(`/admin/faq/articles/${artigoId}`)
        .send({ body_pt: 'Conteúdo atualizado.' })
        .expect(200);

      expect(res.body.body_pt).toBe('Conteúdo atualizado.');
      expect(res.body.slug).toBe('como-usar-a-plataforma');
    });

    it('Dado title_pt atualizado, deve regenerar o slug e retornar 200', async () => {
      const res = await request(app)
        .patch(`/admin/faq/articles/${artigoId}`)
        .send({ title_pt: 'Como configurar sua conta' })
        .expect(200);

      expect(res.body.title_pt).toBe('Como configurar sua conta');
      expect(res.body.slug).toBe('como-configurar-sua-conta');
    });

    it('Dado published=true, deve publicar o artigo e setar published_at e retornar 200', async () => {
      const res = await request(app)
        .patch(`/admin/faq/articles/${artigoId}`)
        .send({ published: true })
        .expect(200);

      expect(res.body.published).toBe(true);
      expect(res.body.published_at).not.toBeNull();
    });
  });

  describe('DELETE /admin/faq/articles/:id', () => {
    it('Dado artigo publicado, deve bloquear a deleção e retornar 409', async () => {
      const res = await request(app).delete(`/admin/faq/articles/${artigoId}`).expect(409);

      expect(res.body.message).toContain('publicado');
    });

    it('Dado artigo despublicado, deve remover o registro e retornar 204', async () => {
      await request(app)
        .patch(`/admin/faq/articles/${artigoId}`)
        .send({ published: false })
        .expect(200);

      await request(app).delete(`/admin/faq/articles/${artigoId}`).expect(204);
    });

    it('Dado artigo já deletado, deve retornar 404', async () => {
      await request(app).delete(`/admin/faq/articles/${artigoId}`).expect(404);
    });
  });

  describe('DELETE /admin/faq/categories/:id', () => {
    it('Deve remover a categoria sem artigos vinculados e retornar 204', async () => {
      await request(app).delete(`/admin/faq/categories/${categoriaId}`).expect(204);

      const res = await request(app).get('/admin/faq/categories').expect(200);
      expect(res.body.some((c: { id: string }) => c.id === categoriaId)).toBe(false);
    });
  });
});
