const request = require('supertest');
const app = require('../../../app');
const database = require('../../models');
const Product = require('../../models/product.model');
const testUtils = require('../../utils/test.utils');

let adminToken = '';
let brand = {};
let categories = [];

const createSampleBrand = () => {
  return request(app)
    .post('/api/admin/brands')
    .set('authorization', 'Bearer ' + adminToken)
    .field('name', Math.random())
    .then((res) => res.body);
};

const createSampleCategory = (categoryName) => {
  return request(app)
    .post('/api/admin/categories')
    .set('authorization', 'Bearer ' + adminToken)
    .field('name', categoryName)
    .then((res) => res.body);
};

beforeAll(async () => {
  adminToken = await testUtils.getAdminToken(app);
  [brand, categories] = await Promise.all([
    createSampleBrand(),
    Promise.all([
      createSampleCategory(Math.random()),
      createSampleCategory(Math.random()),
      createSampleCategory(Math.random()),
    ]),
  ]);
  return 'done';
}, 15000);

afterAll(() => {
  database.terminate();
});

describe('Add new product', () => {
  const validProduct = {
    title: 'This is a valid title',
    detail: 'This is long detail, but it not really necessary',
    price: 12000000,
    discountPrice: 11000000,
    warrantyPeriodByDay: 120,
    availableQuantity: 100,
    state: 'hidden',
  };

  it('Should create new product', (done) => {
    validProduct.brandId = brand.id;
    validProduct.categories = categories.map((category) => category.id);

    console.table(validProduct.brandId);
    console.table(validProduct.categories);
    request(app)
      .post('/api/admin/products')
      .set('authorization', 'bearer ' + adminToken)
      .field('title', validProduct.title)
      .field('detail', validProduct.detail)
      .field('price', validProduct.price)
      .field('discountPrice', validProduct.discountPrice)
      .field('warrantyPeriodByDay', validProduct.warrantyPeriodByDay)
      .field('availableQuantity', validProduct.availableQuantity)
      .field('state', validProduct.state)
      .field('brandId', validProduct.brandId)
      .field('categories', validProduct.categories)
      .attach(
        'images',
        './src/__test__/data/bang-tay-tap-gym-day-quan-co-tay-300x300.jpg'
      )
      .then((res) => {
        console.log(res.status);
        console.log(res.body);
        done();
      });
  });
});
