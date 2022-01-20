const request = require('supertest');
const app = require('../../../app');
const database = require('../../models');

afterAll(() => {
  database.terminate();
});

describe('Get brand', () => {
  it('GET /api/brands', (done) => {
    request(app)
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
