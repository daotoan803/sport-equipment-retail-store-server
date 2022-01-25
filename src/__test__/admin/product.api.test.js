const Product = require('../../models/product.model');
const testUtils = require('../../utils/test.utils');
const Brand = require('../../models/brand.model');
const Category = require('../../models/category.model');
const app = require('../../../app');
const supertest = require('supertest')(app);

describe('Test admin functionality with product', () => {
  let adminToken = '';
  let uploadedImage = [];

  const validProduct = {
    title: 'This is a test product',
    detail: 'This is long detail, ',
    price: 12000000,
    discountPrice: 11000000,
    warrantyPeriodByDay: 120,
    availableQuantity: 100,
    state: 'hidden',
  };

  beforeAll(async () => {
    adminToken = await testUtils.getAdminToken();
    let [brands, categories] = await Promise.all([
      Brand.findAll(),
      Category.findAll(),
    ]);
    validProduct.brandId = brands[0].id;
    validProduct.categories = categories.map((category) => category.id);
    return 'done';
  });

  afterAll(async () => {
    const product = await Product.findOne({
      where: {
        title: validProduct.title,
      },
    });
    await product?.destroy({ force: true });
    await testUtils.deleteUploadedTestImageByImageUrl(...uploadedImage);
  });

  describe('Create new product', () => {
    it('Should create new product', async () => {
      const res = await supertest
        .post('/api/admin/products')
        .set('authorization', 'Bearer ' + adminToken)
        .field('title', validProduct.title)
        .field('detail', validProduct.detail)
        .field('price', validProduct.price)
        .field('discountPrice', validProduct.discountPrice)
        .field('warrantyPeriodByDay', validProduct.warrantyPeriodByDay)
        .field('availableQuantity', validProduct.availableQuantity)
        .field('state', validProduct.state)
        .field('brandId', validProduct.brandId)
        .field('categories', validProduct.categories[0])
        .field('categories', validProduct.categories[1])
        .attach('images', './src/__test__/data/__test__5__test__.jpg')
        .attach('images', './src/__test__/data/__test__3__test__.jpg');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          title: expect.stringMatching(validProduct.title.toString()),
          detail: expect.stringMatching(validProduct.detail),
          price: validProduct.price,
          discountPrice: validProduct.discountPrice,
          warrantyPeriodByDay: validProduct.warrantyPeriodByDay,
          availableQuantity: validProduct.availableQuantity,
          state: expect.stringMatching(validProduct.state),
        })
      );

      expect(res.body.productImages).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            url: expect.any(String),
            productId: res.body.id,
          }),
        ])
      );
      uploadedImage = res.body.productImages.map((image) => image.url);
    });

    it('Should not create new product because title conflict', async () => {
      const res = await supertest
        .post('/api/admin/products')
        .set('authorization', 'Bearer ' + adminToken)
        .field('title', validProduct.title)
        .field('detail', validProduct.detail)
        .field('price', validProduct.price)
        .field('discountPrice', validProduct.discountPrice)
        .field('warrantyPeriodByDay', validProduct.warrantyPeriodByDay)
        .field('availableQuantity', validProduct.availableQuantity)
        .field('state', validProduct.state)
        .field('brandId', validProduct.brandId)
        .field('categories', validProduct.categories[0])
        .field('categories', validProduct.categories[1])
        .attach('images', './src/__test__/data/__test__5__test__.jpg')
        .attach('images', './src/__test__/data/__test__3__test__.jpg');

      expect(res.status).toBe(409);
      expect(res.body.error).toEqual(expect.any(String));
    });
  });

  describe('Test product title is exists', () => {
    it('Product title should be exists', async () => {
      const res = await supertest
        .post('/api/admin/products/is-title-unique')
        .set('authorization', 'Bearer ' + adminToken)
        .send({ title: validProduct.title });

      expect(res.status).toBe(409);
    });

    it('This title should not be exists', async () => {
      const res = await supertest
        .post('/api/admin/products/is-title-unique')
        .set('authorization', 'Bearer ' + adminToken)
        .send({ title: 'haf;ljksdfb34875q9fabnlkdufhbaiusdkfnah' });

      expect(res.status).toBe(200);
    });
  });

  describe('Test add product images', () => {
    let uploadedProduct = null;

    beforeAll(async () => {
      const products = await Product.findAll();
      uploadedProduct = products[0];
    });

    it('Should add new image to product', async () => {
      const res = await supertest
        .post(`/api/admin/products/${uploadedProduct.id}/images`)
        .set('authorization', 'Bearer ' + adminToken)
        .attach('images', './src/__test__/data/__test__2__test__.jpg')
        .attach('images', './src/__test__/data/__test__3__test__.jpg');

      expect(res.status).toBe(204);
    });
  });
});
