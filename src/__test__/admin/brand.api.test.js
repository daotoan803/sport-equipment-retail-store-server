const Brand = require('../../models/brand.model');
const testUtils = require('../../utils/test.utils');
const app = require('../../../app');
const supertest = require('supertest')(app);

describe('Test admin functionality with brand', () => {
  let adminToken = null;
  let uploadedImage = [];
  const brandName = 'Sample test brand';

  beforeAll(async () => {
    adminToken = await testUtils.getAdminToken();
  });

  afterAll(async () => {
    await Promise.all([
      testUtils.deleteUploadedTestImageByImageUrl(...uploadedImage),
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
        .field('name', brandName)
        .attach('image', './src/__test__/data/__test__1__test__.jpg');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.stringMatching(brandName),
          logoUrl: expect.any(String),
        })
      );
      uploadedImage.push(res.body.logoUrl);
    });

    it("Should fail because brand's name already exists", async () => {
      const res = await supertest
        .post('/api/admin/brands')
        .set('authorization', 'Bearer ' + adminToken)
        .field('name', brandName)
        .attach('image', './src/__test__/data/__test__1__test__.jpg');

      expect(res.status).toBe(409);
      expect(res.body).toEqual(
        expect.objectContaining({
          error: expect.any(String),
        })
      );
    });
  });
});
