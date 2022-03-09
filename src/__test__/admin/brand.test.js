const app = require('../../../app');
const supertest = require('supertest');
const { faker } = require('@faker-js/faker');
const authUtil = require('../utils/authorization.util');
const Brand = require('../../models/brand.model');

describe('Testing admin functionality with brand', () => {
  const newBrand = { name: faker.name.firstName() };
  const updatedBrand = { name: newBrand.name + 'updated' };
  let createdBrandId = null;
  let adminToken = null;
  let normalUserToken = null;

  beforeAll(async () => {
    adminToken = await authUtil.getAdminToken();
    normalUserToken = await authUtil.getNormalUserToken();
  });

  afterAll(async () => {
    if (createdBrandId) {
      await Brand.destroy({ where: { id: createdBrandId } });
    }
  });

  describe('POST: /api/admin/brands Adding brand', () => {
    it('Should create new brand success', async () => {
      const res = await supertest(app)
        .post('/api/admin/brands')
        .set('Authorization', 'Bearer ' + adminToken)
        .send(newBrand);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(expect.any(Object));
      expect(res.body.brand).toEqual(expect.any(Object));
      expect(res.body.brand.id).toEqual(expect.any(Number));
      expect(res.body.brand.name).toBe(newBrand.name);

      createdBrandId = res.body.brand.id;
    });

    it('Should create new brand fail because name conflict', async () => {
      const res = await supertest(app)
        .post('/api/admin/brands')
        .set('Authorization', 'Bearer ' + adminToken)
        .send(newBrand);

      expect(res.status).toBe(409);
      expect(res.body.error).toEqual(expect.any(String));
    });

    it('Should create new brand fail because invalid field', async () => {
      const res = await supertest(app)
        .post('/api/admin/brands')
        .set('Authorization', 'Bearer ' + adminToken)
        .send({ name: '    ' });

      expect(res.status).toBe(400);
      expect(res.body.error).toEqual(expect.any(String));
    });

    it('Should create new brand fail because missing field', async () => {
      const res = await supertest(app)
        .post('/api/admin/brands')
        .set('Authorization', 'Bearer ' + adminToken)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toEqual(expect.any(String));
    });

    it('Should create new brand fail because invalid token', async () => {
      const res = await supertest(app)
        .post('/api/admin/brands')
        .set('Authorization', 'Bearer ' + adminToken + '123')
        .send(newBrand);

      expect(res.status).toBe(401);
      expect(res.body.error).toEqual(expect.any(String));
    });

    it('Should create new brand fail because invalid authorization', async () => {
      const res = await supertest(app)
        .post('/api/admin/brands')
        .set('Authorization', 'Bearer ' + normalUserToken)
        .send(newBrand);

      expect(res.status).toBe(401);
      expect(res.body.error).toEqual(expect.any(String));
    });

    it('Should create new brand fail because missing token', async () => {
      const res = await supertest(app).post('/api/admin/brands').send(newBrand);

      expect(res.status).toBe(403);
      expect(res.body.error).toEqual(expect.any(String));
    });
  });

  describe('PUT: /api/admin/brands/:brandId Update brand', () => {
    it("Should update brand's name success", async () => {
      const res = await supertest(app)
        .put(`/api/admin/brands/${createdBrandId}`)
        .set('authorization', 'Bearer ' + adminToken)
        .send(updatedBrand);

      expect(res.status).toBe(204);
    });

    it("Should not update brand's name because name conflict", async () => {
      const res = await supertest(app)
        .put(`/api/admin/brands/${createdBrandId}`)
        .set('authorization', 'Bearer ' + adminToken)
        .send(updatedBrand);

      expect(res.status).toBe(409);
    });

    it("Should not update brand's name because brand's id not exists", async () => {
      const res = await supertest(app)
        .put(`/api/admin/brands/${createdBrandId + '4d2'}`)
        .set('authorization', 'Bearer ' + adminToken)
        .send(updatedBrand);

      expect(res.status).toBe(404);
    });

    it("Should not update brand's name because missing field", async () => {
      const res = await supertest(app)
        .put(`/api/admin/brands/${createdBrandId}`)
        .set('authorization', 'Bearer ' + adminToken)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toEqual(expect.any(String));
    });

    it("Should not update brand's name because invalid field", async () => {
      const res = await supertest(app)
        .put(`/api/admin/brands/${createdBrandId}`)
        .set('authorization', 'Bearer ' + adminToken)
        .send({ name: '      ' });

      expect(res.status).toBe(400);
      expect(res.body.error).toEqual(expect.any(String));
    });

    it("Should not update brand's name because invalid token", async () => {
      const res = await supertest(app)
        .put(`/api/admin/brands/${createdBrandId}`)
        .set('authorization', 'Bearer ' + adminToken + '123')
        .send(updatedBrand);

      expect(res.status).toBe(401);
      expect(res.body.error).toEqual(expect.any(String));
    });

    it("Should not update brand's name because missing authorization", async () => {
      const res = await supertest(app)
        .put(`/api/admin/brands/${createdBrandId}`)
        .send(updatedBrand);

      expect(res.status).toBe(403);
    });

    it("Should not update brand's name because invalid authorization", async () => {
      const res = await supertest(app)
        .put(`/api/admin/brands/${createdBrandId}`)
        .set('authorization', 'Bearer ' + normalUserToken)
        .send(updatedBrand);

      expect(res.status).toBe(401);
      expect(res.body.error).toEqual(expect.any(String));
    });
  });

  describe('DELETE: /api/admin/brands/:brandId Delete brand', () => {
    it('Should delete brand success', async () => {
      const res = await supertest(app)
        .delete(`/api/admin/brands/${createdBrandId}`)
        .set('authorization', 'Bearer ' + adminToken);

      expect(res.status).toBe(204);
    });

    it('Should delete brand fail because brand not exists', async () => {
      const res = await supertest(app)
        .delete(`/api/admin/brands/${createdBrandId}`)
        .set('authorization', 'Bearer ' + adminToken);

      expect(res.status).toBe(404);
      expect(res.body.error).toEqual(expect.any(String));
    });

    it('Should delete brand fail because invalid token', async () => {
      const res = await supertest(app)
        .delete(`/api/admin/brands/${createdBrandId}`)
        .set('authorization', 'Bearer ' + adminToken + '123');

      expect(res.status).toBe(401);
      expect(res.body.error).toEqual(expect.any(String));
    });

    it('Should delete brand fail because invalid authorization', async () => {
      const res = await supertest(app)
        .delete(`/api/admin/brands/${createdBrandId}`)
        .set('authorization', 'Bearer ' + normalUserToken);

      expect(res.status).toBe(401);
      expect(res.body.error).toEqual(expect.any(String));
    });

    it('Should delete brand fail because missing token', async () => {
      const res = await supertest(app).delete(
        `/api/admin/brands/${createdBrandId}`
      );

      expect(res.status).toBe(403);
      expect(res.body.error).toEqual(expect.any(String));
    });
  });
});
