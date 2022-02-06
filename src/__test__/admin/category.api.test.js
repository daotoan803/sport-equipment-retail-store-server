const app = require('../../../app');
const Category = require('../../models/category.model');
const testUtils = require('../../utils/test.utils');
const supertest = require('supertest')(app);

describe('Test admin functionality with category', () => {
  const validCategory = {
    name: '__test__ category',
  };
  let adminToken = null;

  beforeAll(async () => {
    adminToken = await testUtils.getAdminToken();
  });

  afterAll(async () => {
    await Promise.all([
      Category.destroy({ where: { name: validCategory.name } }),
    ]);
  });

  describe('Create new category', () => {
    it('Should create a new category', async () => {
      const res = await supertest
        .post('/api/admin/categories')
        .set('authorization', 'Bearer ' + adminToken)
        .send({ name: validCategory.name });

      expect(res.status).toBe(200);
      expect(res.body.id).toEqual(expect.anything());
      expect(res.body.name).toBe(validCategory.name);
    });

    it('Should not create a new category because of name conflict', async () => {
      const res = await supertest
        .post('/api/admin/categories')
        .set('authorization', 'Bearer ' + adminToken)
        .send({ name: validCategory.name });

      expect(res.status).toBe(409);
      expect(res.body.error).toEqual(expect.any(String));
    });

    it('Should not create a new category because of invalid field ', async () => {
      const res = await supertest
        .post('/api/admin/categories')
        .set('authorization', 'Bearer ' + adminToken)
        .send({ name: '      ' });

      expect(res.status).toBe(400);
      expect(res.body).toEqual(expect.any(Array));
      res.body.forEach((obj) => {
        expect(obj.field).toEqual(expect.any(String));
        expect(obj.message).toEqual(expect.any(String));
      });
    });
  });
});
