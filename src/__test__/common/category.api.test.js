const app = require('../../../app');

const supertest = require('supertest')(app);

describe('Test client functionality with category', () => {
  describe('Fetch categories', () => {
    it('Should get all categories', async () => {
      const res = await supertest.get('/api/categories');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
          }),
        ])
      );
    });
  });
});
