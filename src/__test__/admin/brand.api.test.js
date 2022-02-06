const Brand = require('../../models/brand.model');
const testUtils = require('../../utils/test.utils');
const app = require('../../../app');
const supertest = require('supertest')(app);

describe('Test admin functionality with brand', () => {
  let adminToken = null;
  const brandName = 'Sample test brand';

  beforeAll(async () => {
    adminToken = await testUtils.getAdminToken();
  });

  afterAll(async () => {
    await Promise.all([
      Brand.destroy({
        where: {
          name: brandName,
        },
      }),
    ]);
  });

  describe('Create new brand', () => {
    it('Should create a new brand', async () => {
      const res = await supertest
        .post('/api/admin/brands')
        .set('authorization', 'Bearer ' + adminToken)
        .send({ name: brandName });

      expect(res.status).toBe(200);
      expect(res.body.id).toEqual(expect.anything());
      expect(res.body.name).toBe(brandName);
    });

    it("Should fail because brand's name already exists", async () => {
      const res = await supertest
        .post('/api/admin/brands')
        .set('authorization', 'Bearer ' + adminToken)
        .send({ name: brandName });

      expect(res.status).toBe(409);
      expect(res.body.error).toEqual(expect.any(String));
    });
  });
});
