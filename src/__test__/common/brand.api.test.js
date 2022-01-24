const app = require('../../../app');
const supertest = require('supertest')(app);

describe('Get brand', () => {
  it('GET /api/brands', (done) => {
    supertest
      .get('/api/brands')
      .expect('content-type', /json/)
      .expect(200)
      .then((res) => {
        const brands = res.body;
        if (brands.length > 0) {
          expect(brands).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(String),
                name: expect.any(String),
              }),
            ])
          );
        } else {
          expect(brands).toEqual(expect.any(Array));
        }
        done();
      })
      .catch((err) => done(err));
  });
});
