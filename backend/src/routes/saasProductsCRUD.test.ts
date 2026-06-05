import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import { productsAdminRouter as productsRouter } from '../products/products.routes.js';

const originalBypass = process.env['ADMIN_AUTH_BYPASS'];

beforeAll(() => {
  process.env['ADMIN_AUTH_BYPASS'] = 'true';
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

app.use('/admin/products', productsRouter);

describe('Suite de testes de Intergração - Endpoints CRUD', () => {
  let produtoId: string;
  let imageUrlGuardada: string;

  const produotValido = {
    name_pt: 'Produto TESTE',
    name_en: 'TEST product',
    tagline_pt: 'não sei',
    tagline_en: 'IDK',
    description_pt: 'tbm não',
    description_en: 'IDK too',
    icon_text: 'TE',
    color: '#7c3aed',
    category_pt: 'Alguma',
    category_en: 'someone',
    published: false,
    display_order: 1,
  };

  describe('POST /admin/products/upload', () => {
    it('Dado que imagem é válida é enviada via multipart, deve faze upload para o Storage e retorna 200', async () => {
      const bufferFake = Buffer.from('89504e470d0a1a0a0000000d49484452', 'hex');

      const res = await request(app)
        .post('/admin/products/upload')
        .attach('image', bufferFake, 'foto-teste.png')
        .expect(200);

      expect(res.body).toHaveProperty('image_url');
      expect(res.body.image_url).toContain('product-images');
      imageUrlGuardada = res.body.image_url;
    });

    it('Dado que o arquivo possui formato inválido, o Multer deve barrar e retorna erro', async () => {
      const bufferInvalido = Buffer.from('Deu ruim :[ ,  a image está em formato inváçlido');

      await request(app)
        .post('/admin/products/upload')
        .attach('image', bufferInvalido, 'documento.txt')
        .expect(500);
    });
  });

  describe('POST /admin/products', () => {
    it('Dado que dados válidos são enviados, deve salvar o produto, gerar o slug higenizado e retonar 201', async () => {
      const payload = { ...produotValido, image_url: imageUrlGuardada };

      const res = await request(app).post('/admin/products').send(payload).expect(201);

      expect(res.body).toHaveProperty('id');
      expect(res.body.slug).toBe('produto-teste');
      produtoId = res.body.id;
    });
  });

  describe('PATCH /admin/products/:id', () => {
    it('Dado que campos parciais são enviados, deve atualizar apenas o payload e resconstruir o slug se necessário', async () => {
      const paricalPayload = {
        name_pt: 'Produto TESTE Atualizado',
        published: true,
      };
      const res = await request(app)
        .patch(`/admin/products/${produtoId}`)
        .send(paricalPayload)
        .expect(200);

      expect(res.body.name_pt).toBe('Produto TESTE Atualizado');
      expect(res.body.slug).toBe('produto-teste-atualizado');
      expect(res.body.published).toBe(true);
    });
  });

  describe('PATCH /admin/products/reorder', () => {
    it('Dado um array de orders, deve chamar a RPC do Supabase e retornar 200', async () => {
      const payloadOrders = {
        orders: [{ id: produtoId, display_order: 5 }],
      };
      const res = await request(app)
        .patch('/admin/products/reorder')
        .send(payloadOrders)
        .expect(200);

      expect(res.body.message).toBe('Produtos reordenados com sucesso!');
    });
  });

  describe('DELETE /admin/products/:id', () => {
    it('Dado que o produto está publicado, deve imperdir a deleção e retornar 409', async () => {
      const res = await request(app).delete(`/admin/products/${produtoId}`).expect(409);

      expect(res.body.message).toBe(
        'Não é possível deletar um produto publicado. Despublique-o primeiro!'
      );
    });

    it('Dado que o produto foi despublicado, deve remover o arquivo do Storage, apagar o resgistro e retornar 204', async () => {
      await request(app).patch(`/admin/products/${produtoId}`).send({ published: false });

      await request(app).delete(`/admin/products/${produtoId}`).expect(204);

      await request(app).delete(`/admin/products/${produtoId}`).expect(404);
    });
  });
});
