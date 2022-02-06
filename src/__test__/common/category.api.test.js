const app = require('../../../app');

const supertest = require('supertest')(app);

describe('Test client functionality with category', () => {
  describe('Fetch categories', () => {
    it('Should get all categories', async () => {
      const res = await supertest.get('/api/categories');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(expect.any(Array));
      if (res.body.length > 0) {
        res.body.forEach((category) => {
          expect(category.id).toEqual(expect.anything())
          expect(category.name).toEqual(expect.any(String))
        });
      }
    });
  });
});
