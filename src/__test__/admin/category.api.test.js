const app = require('../../../app');
const Category = require('../../models/category.model');
const testUtils = require('../../utils/test.utils');
const supertest = require('supertest')(app);

describe('Test admin functionality with category', () => {
  const validCategory = {
    name: '__test__ category',
  };
  const uploadedImages = [];
  let adminToken = null;

  beforeAll(async () => {
    adminToken = await testUtils.getAdminToken();
  });

  afterAll(async () => {
    await Promise.all([
      Category.destroy({ where: { name: validCategory.name } }),
      testUtils.deleteUploadedTestImageByImageUrl(...uploadedImages),
    ]);
  });

  describe('Create new category', () => {
    it('Should create a new category', async () => {
      const res = await supertest
        .post('/api/admin/categories')
        .set('authorization', 'Bearer ' + adminToken)
        .field('name', validCategory.name)
        .attach('image', './src/__test__/data/__test__0__test__.jpg');

      expect(res.status).toBe(200);
      expect(res.body.id).toEqual(expect.any(String));
      expect(res.body.logoUrl).toEqual(expect.stringContaining('/images/'));
      expect(res.body.name).toBe(validCategory.name);

      uploadedImages.push(res.body.logoUrl);
    });

    it('Should not create a new category because of name conflict', async () => {
      const res = await supertest
        .post('/api/admin/categories')
        .set('authorization', 'Bearer ' + adminToken)
        .field('name', validCategory.name)
        .attach('image', './src/__test__/data/__test__0__test__.jpg');

      expect(res.status).toBe(409);
      expect(res.body).toEqual(
        expect.objectContaining({
          error: expect.any(String),
        })
      );
    });

    it('Should not create a new category because of invalid field ', async () => {
      const res = await supertest
        .post('/api/admin/categories')
        .set('authorization', 'Bearer ' + adminToken)
        .field('name', '      ')
        .attach('image', './src/__test__/data/__test__0__test__.jpg');

      expect(res.status).toBe(400);
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: expect.stringMatching('name'),
            message: expect.any(String),
          }),
        ])
      );
    });
  });
});
