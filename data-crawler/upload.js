const fs = require('fs');
const path = require('path');
const app = require('../app');
const CategoryGroup = require('../src/models/category-group.model');
const Category = require('../src/models/category.model');
const Brand = require('../src/models/brand.model');
const model = require('../src/models');
const axios = require('axios');
const FormData = require('form-data');
const Product = require('../src/models/product.model');
const { threadPool } = require('./crawler.utils');

const PORT = 9999;
const proxy = `http://localhost:${PORT}`;
const startServer = () => {
  return new Promise((res) => {
    app.listen(PORT, () => {
      console.log('server running on ' + proxy);
      res();
    });
  });
};

const createCategoryGroupAndCategories = async (categories) => {
  const categoryModels = [];

  for (const categoryGroupName of Object.keys(categories)) {
    const categoryGroup = await CategoryGroup.create({
      name: categoryGroupName,
    });

    const childCategories = await Category.bulkCreate(
      categories[categoryGroupName].map((childCategory) => ({
        name: childCategory.name,
      }))
    );

    categoryGroup.addCategories(childCategories);
    categoryModels.push(...childCategories);
  }

  return categoryModels;
};

const createBrands = async (brands) => {
  return Brand.bulkCreate(brands.map((brand) => ({ name: brand })));
};

const createProduct = async (product, token) => {
  const images = fs.createReadStream(
    path.join(__dirname, 'images', product.mainImageName)
  );

  const formData = new FormData();
  formData.append('title', product.title);
  formData.append('detail', product.detail);
  formData.append('price', product.price);
  formData.append('warrantyPeriodByDay', product.warrantyPeriodByDay);
  formData.append('availableQuantity', product.availableQuantity);
  formData.append('state', product.state);
  formData.append('categoryId', product.categoryId);
  formData.append('brandId', product.brandId);
  formData.append('images', images);

  if (product.discountPrice) {
    formData.append('discountPrice', product.discountPrice);
  }

  let res = null;

  try {
    res = await axios.post(proxy + `/api/admin/products`, formData, {
      headers: {
        ...formData.getHeaders(),
        authorization: 'Bearer ' + token,
      },
    });
  } catch (e) {
    if (e.response) {
      res = e.response;
    } else {
      throw new Error(e.message);
    }
  } finally {
    images.close();
  }

  if (res.status !== 200 && res.status !== 409) {
    console.log('--------------------------------------------');
    console.log('error when uploading product: ' + product.title);
    delete product.detail;
    console.log(product);
    console.log(res.status);
    console.log(res.data);
    throw new Error('stop');
  }
  return res;
};

const getAdminToken = async () => {
  const adminAcc = {
    email: 'vnsport@vnsport.com',
    password: 'admin',
  };
  const res = await axios.post(proxy + '/api/user/signin', adminAcc);
  const data = res.data;
  return data.token;
};

const main = async () => {
  const categories = JSON.parse(
    await fs.promises.readFile(path.join(__dirname, 'category.json'))
  );
  const products = JSON.parse(
    await fs.promises.readFile(path.join(__dirname, 'products.json'))
  );

  const brands = [...new Set(products.map((product) => product.brand))];

  let [categoryModelsList, brandModelsList] = await Promise.all([
    createCategoryGroupAndCategories(categories),
    createBrands(brands),
  ]);

  const categoryModels = {};
  categoryModelsList.forEach(
    (categoryModel) => (categoryModels[categoryModel.name] = categoryModel)
  );
  const brandModels = {};
  brandModelsList.forEach(
    (brandModel) => (brandModels[brandModel.name] = brandModel)
  );

  const adminToken = await getAdminToken();
  return threadPool(
    products.map((product) => {
      return async () => {
        product.categoryId = categoryModels[product.category].id;
        product.brandId = brandModels[product.brand].id;
        product.state =
          product.availableQuantity === 0
            ? Product.state.outStock
            : Product.state.available;
        return createProduct(product, adminToken);
      };
    }),
    5
  );
};

model
  .initialize()
  .then(startServer)
  .then(main)
  .then(model.terminate)
  .then(process.exit);

// doing :
// craw image
// upload product
