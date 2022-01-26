const Product = require('../../models/product.model');
const app = require('../../../app');
const supertest = require('supertest')(app);

describe('Test normal user functionality with product', () => {
  describe('Get all products', () => {
    it('Should get all products', async () => {
      let res = await supertest.get('/api/products');
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            title: expect.any(String),
            price: expect.any(Number),
            discountPrice: expect.any(Number),
            warrantyPeriodByDay: expect.any(Number),
            availableQuantity: expect.any(Number),
            state: expect.any(String),
            mainImageUrl: expect.any(String),
            brandId: expect.any(String),
          }),
        ])
      );
    });
  });

  describe('Get product detailed', () => {
    let productId = '';

    beforeAll(async () => {
      const products = await Product.findAll();
      productId = products[0].id;
    });

    it('Should get a detailed product by id', async () => {
      let res = null;
      try {
        res = await supertest.get(`/api/products/${productId}`);
      } catch (err) {
        if (!err.response) throw err;
        res = err.response;
      }
      expect(res.status).toBe(200);
      expect(res.body).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          title: expect.any(String),
          detail: expect.any(String),
          price: expect.any(Number),
          discountPrice: expect.any(Number),
          warrantyPeriodByDay: expect.any(Number),
          availableQuantity: expect.any(Number),
          state: expect.any(String),
          brandId: expect.any(String),
        })
      );
      expect(res.body.brand).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
        })
      );
      expect(res.body.categories).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
          }),
        ])
      );
      expect(res.body.productImages).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            url: expect.any(String),
            productId: expect.stringContaining(productId),
          }),
        ])
      );
    });
  });
});
