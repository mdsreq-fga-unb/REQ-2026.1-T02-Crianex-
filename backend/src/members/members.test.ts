import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import express from 'express';
import { membersRouter } from './members.routes.js';

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
app.use('/admin/members', membersRouter);

describe('Suite de testes de integração — Members CRUD', () => {
  let memberId: string;
  const testEmail = `member-ci-${Date.now()}@crianex.test`;

  describe('POST /admin/members', () => {
    it('Dado dados válidos, deve criar membro e retornar 201 com o objeto criado', async () => {
      const res = await request(app)
        .post('/admin/members')
        .send({ name: 'Membro CI', email: testEmail, role: 'member' })
        .expect(201);

      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toBe('Membro CI');
      expect(res.body.email).toBe(testEmail);
      expect(res.body.role).toBe('member');
      expect(res.body.status).toBe('active');
      memberId = res.body.id;
    });

    it('Dado nome ausente, deve retornar 400', async () => {
      const res = await request(app)
        .post('/admin/members')
        .send({ email: `outro-${Date.now()}@crianex.test`, role: 'member' })
        .expect(400);

      expect(res.body).toHaveProperty('message');
    });

    it('Dado email ausente, deve retornar 400', async () => {
      const res = await request(app)
        .post('/admin/members')
        .send({ name: 'Sem Email', role: 'member' })
        .expect(400);

      expect(res.body).toHaveProperty('message');
    });

    it('Dado email já cadastrado, deve retornar 409 sem fechar operação', async () => {
      const res = await request(app)
        .post('/admin/members')
        .send({ name: 'Duplicado', email: testEmail, role: 'member' })
        .expect(409);

      expect(res.body).toHaveProperty('message');
    });
  });

  describe('GET /admin/members', () => {
    it('Deve retornar array com os membros cadastrados', async () => {
      const res = await request(app).get('/admin/members').expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      const found = res.body.find((m: { id: string }) => m.id === memberId);
      expect(found).toBeDefined();
    });
  });

  describe('PATCH /admin/members/:id', () => {
    it('Dado campos parciais válidos, deve atualizar nome e role do membro', async () => {
      const res = await request(app)
        .patch(`/admin/members/${memberId}`)
        .send({ name: 'Membro CI Atualizado', role: 'owner' })
        .expect(200);

      expect(res.body.name).toBe('Membro CI Atualizado');
      expect(res.body.role).toBe('owner');
    });
  });

  describe('PATCH /admin/members/:id/status', () => {
    it('Dado status válido, deve atualizar o status do membro', async () => {
      const res = await request(app)
        .patch(`/admin/members/${memberId}/status`)
        .send({ status: 'inactive' })
        .expect(200);

      expect(res.body.status).toBe('inactive');
    });

    it('Dado status inválido, deve retornar 400', async () => {
      const res = await request(app)
        .patch(`/admin/members/${memberId}/status`)
        .send({ status: 'deleted' })
        .expect(400);

      expect(res.body).toHaveProperty('message');
    });

    it('Dado que o admin tenta inativar a própria conta, deve retornar 400 (auto-inativação bloqueada)', async () => {
      // Com ADMIN_AUTH_BYPASS=true o requesterId é 'bypass' — id === requesterId → bloqueado
      const res = await request(app)
        .patch('/admin/members/bypass/status')
        .send({ status: 'inactive' })
        .expect(400);

      expect(res.body).toHaveProperty('message');
    });
  });

  describe('DELETE /admin/members/:id', () => {
    it('Dado que o admin tenta remover a própria conta, deve retornar 400 (auto-remoção bloqueada)', async () => {
      // Com ADMIN_AUTH_BYPASS=true o requesterId é 'bypass' — id === requesterId → bloqueado
      const res = await request(app).delete('/admin/members/bypass').expect(400);

      expect(res.body).toHaveProperty('message');
    });

    it('Dado membro existente, deve remover e retornar 204', async () => {
      await request(app).delete(`/admin/members/${memberId}`).expect(204);
    });

    it('Dado membro já removido, uma nova tentativa de remoção deve retornar 404', async () => {
      const res = await request(app).delete(`/admin/members/${memberId}`).expect(404);
      expect(res.body).toHaveProperty('message');
    });
  });
});
