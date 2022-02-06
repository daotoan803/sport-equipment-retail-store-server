const Product = require('../../models/product.model');
const app = require('../../../app');
const supertest = require('supertest')(app);

describe('Test normal user functionality with product', () => {
  describe('Get all products', () => {
    it('Should get all products', async () => {
      let res = await supertest.get('/api/products');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(expect.any(Array));
      expect(res.body.length).toBeGreaterThan(0);
      const products = res.body;
      products.forEach((product) => {
        expect(product).toEqual(expect.any(Object));
        expect(product.id).toEqual(expect.any(String));
        expect(product.title).toEqual(expect.any(String));
        expect(product.price).toEqual(expect.any(Number));
        expect(product.state).toEqual(expect.any(String));
        expect(product.mainImageUrl).toEqual(expect.any(String));
      });
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
      expect(res.body).toEqual(expect.any(Object));

      expect(res.body.id).toEqual(expect.any(String));
      expect(res.body.title).toEqual(expect.any(String));
      expect(res.body.detail).toEqual(expect.any(String));
      expect(res.body.price).toEqual(expect.any(Number));
      expect(res.body.warrantyPeriodByDay).toEqual(expect.any(Number));
      expect(res.body.availableQuantity).toEqual(expect.any(Number));
      expect(res.body.state).toEqual(expect.any(String));
      expect(res.body.brandId).toEqual(expect.anything());
      expect(res.body.categoryId).toEqual(expect.anything());

      expect(res.body.brand).toEqual(expect.any(Object));
      expect(res.body.brand.id).toBe(res.body.brandId);
      expect(res.body.brand.name).toEqual(expect.any(String));

      expect(res.body.category).toEqual(expect.any(Object));
      expect(res.body.category.id).toBe(res.body.categoryId);
      expect(res.body.category.name).toEqual(expect.any(String));

      expect(res.body.productImages).toEqual(expect.any(Array));
      res.body.productImages.forEach((image) => {
        expect(image.id).toEqual(expect.anything());
        expect(image.url).toEqual(expect.any(String));
        expect(image.productId).toBe(productId);
      });
    });
  });
});
