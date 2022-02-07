const fs = require('fs');
const path = require('path');
const app = require('../app');
const CategoryGroup = require('../src/models/category-group.model');
const Category = require('../src/models/category.model');
const Brand = require('../src/models/brand.model');
const model = require('../src/models');
const axios = require('axios');
const FormData = require("form-data")

const PORT = 9999;
const proxy = `http://localhost:${PORT}`;
const startServer = () => {
  return new Promise((res) => {
    app.listen(PORT, res);
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

const createProduct = async (product, categories, brands, token) => {
  const images = fs.createReadStream(
    path.join(__dirname, 'images', product.imageName)
  );

  const formData = new FormData();
  formData.append('title', product.title);
  formData.append('detail', product.detail);
  formData.append('price', product.price);
  formData.append('warrantyPeriodByDay', product.warrantyPeriodByDay);
  formData.append('availableQuantity', product.availableQuantity);
  formData.append('state', product.state);
  formData.append('categories[]', categories[product.category].id);
  formData.append('brandId', brands[product.brand].id);
  formData.append('images', images);

  if (product.discountPrice) {
    formData.append('discountPrice', product.discountPrice);
  }

  let res = null;

  try {
    res = await axios.post(
      `http://localhost:${serverPost}/api/admin/products`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          authorization: 'Bearer ' + token,
        },
      }
    );
  } catch (e) {
    if (e.response) {
      res = e.response;
    } else {
      console.error(e);
    }
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
  let categories = JSON.parse(
    await fs.promises.readFile(path.join(__dirname, 'category.json'))
  );
  const products = JSON.parse(
    await fs.promises.readFile(path.join(__dirname, 'products.json'))
  );
  let brands = [...new Set(products.map((product) => product.brand))];

  let [categoryModels, brandModels] = await Promise.all([
    createCategoryGroupAndCategories(categories),
    createBrands(brands),
  ]);

  categories = {};
  categoryModels.forEach((category) => (categories[category.name] = category));
  brands = {};
  brandModels.forEach((brand) => (brands[brand.name] = brand));

  const adminToken = await getAdminToken();
  products.forEach(product => {

  })
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