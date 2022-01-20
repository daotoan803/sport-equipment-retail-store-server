const Product = require('../../models/product.model');
const testUtils = require('../../utils/test.utils');
const TestServer = require('../../utils/test-server');
const Brand = require('../../models/brand.model');
const Category = require('../../models/category.model');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

describe('Test admin functionality with product', () => {
  const testServer = new TestServer();
  let adminToken = '';
  let proxy = '';
  let uploadedImage = [];

  const validProduct = {
    title: Math.random(),
    detail: 'This is long detail, but it not really necessary',
    price: 12000000,
    discountPrice: 11000000,
    warrantyPeriodByDay: 120,
    availableQuantity: 100,
    state: 'hidden',
  };

  beforeAll(async () => {
    proxy = await testServer.startServer();
    adminToken = await testUtils.getAdminToken(proxy);
    let [brands, categories] = await Promise.all([
      Brand.findAll(),
      Category.findAll(),
    ]);
    validProduct.brandId = brands[0].id;
    validProduct.categories = categories.map((category) => category.id);
    return 'done';
  });

  afterAll(() => {
    testServer.shutDownServer();
  });

  describe('Add new product', () => {
    afterAll(async () => {
      const product = await Product.findOne({
        where: {
          title: validProduct.title,
        },
      });
      await product.destroy();
    });

    it('Should create new product', async () => {
      const productData = new FormData();
      productData.append('title', validProduct.title);
      productData.append('detail', validProduct.detail);
      productData.append('price', validProduct.price);
      productData.append('discountPrice', validProduct.discountPrice);
      productData.append(
        'warrantyPeriodByDay',
        validProduct.warrantyPeriodByDay
      );
      productData.append('availableQuantity', validProduct.availableQuantity);
      productData.append('state', validProduct.state);
      productData.append('brandId', validProduct.brandId);
      productData.append('categories', validProduct.categories[0]);
      productData.append('categories', validProduct.categories[1]);
      productData.append(
        'images',
        fs.createReadStream('src/__test__/data/__test__5__test__.jpg')
      );
      productData.append(
        'images',
        fs.createReadStream('src/__test__/data/__test__3__test__.jpg')
      );

      let res = null;
      try {
        res = await axios.post(`${proxy}/api/admin/products`, productData, {
          headers: {
            ...productData.getHeaders(),
            authorization: 'Bearer ' + adminToken,
          },
        });
      } catch (err) {
        if (err.response) {
          res = err.response;
          if (res.status === 400) console.log(res.data);
        }
      }

      expect(res.status).toBe(200);
      expect(res.data).toEqual(
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
    });
  });
});
