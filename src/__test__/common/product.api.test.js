const Product = require('../../models/product.model');
const TestServer = require('../../utils/test-server');
const axios = require('axios');

describe('Test normal user functionality with product', () => {
  const testServer = new TestServer();
  let proxy = '';

  beforeAll(async () => {
    await testServer.startServer();
    proxy = testServer.proxy;
  });

  describe('Get all products', () => {
    it('Should get all products', async () => {
      let res = null;
      try {
        res = await axios.get(proxy + '/api/products');
      } catch (err) {
        if (!err.response) throw err;
        res = err.response;
      }
      expect(res.status).toBe(200);
      expect(res.data.length).toBeGreaterThan(0);
      expect(res.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            title: expect.any(String),
            detail: expect.any(String),
            price: expect.any(Number),
            discountPrice: expect.any(Number),
            warrantyPeriodByDay: expect.any(Number),
            availableQuantity: expect.any(Number),
            state: expect.any(String),
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
        res = await axios.get(`${proxy}/api/products/${productId}`);
      } catch (err) {
        if (!err.response) throw err;
        res = err.response;
      }
      expect(res.status).toBe(200);
      expect(res.data).toEqual(
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
      expect(res.data.brand).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
        })
      );
      expect(res.data.categories).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
          }),
        ])
      );
      expect(res.data.productImages).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            url: expect.any(String),
            productId: expect.stringContaining(productId)
          }),
        ])
      );
    });
  });
});
