const app = require('../../../app');
const supertest = require('supertest')(app);

describe('Get brand', () => {
  it('GET /api/brands', async () => {
    const res = await supertest
      .get('/api/brands')
      .expect('content-type', /json/)
      .expect(200);

    expect(res.body).toEqual(expect.any(Array));
    const brands = res.body;
    if (brands.length > 0) {
      brands.forEach((brand) => {
        expect(brand.id).toEqual(expect.anything());
        expect(brand.name).toEqual(expect.any(String));
      });
    }
  });
});
