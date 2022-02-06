const app = require('../app');
const supertest = require('supertest')(app);
const fs = require('fs');
const path = require('path');
const Product = require('../src/models/product.model');
const model = require('../src/models');
const axios = require('axios');
const FormData = require('form-data');

const serverPost = 9999;

const processData = (products) => {
  const formatPriceToNumber = (value) => {
    value = [...value];
    value.splice(-1, 1);
    return Number(value.filter((c) => c !== '.').join(''));
  };

  return products
    .filter((product) => {
      if (!product.price && !product.discountPrice) return false;
      return true;
    })
    .map((product) => {
      const temp = { ...product };
      if (!temp.price) {
        temp.price = temp.discountPrice;
        delete temp.discountPrice;
      }

      temp.price = formatPriceToNumber(temp.price);
      if (temp.discountPrice)
        temp.discountPrice = formatPriceToNumber(temp.discountPrice);

      temp.state = Product.state.available;
      return temp;
    });
};

const findAllCategoriesAndBrand = (products) => {
  const categories = [];
  const brands = [];
  products.forEach((product) => {
    const category = product.category;
    const brand = product.brand;
    if (!categories[category]) categories[category] = { name: category };
    if (!brands[brand]) brands[brand] = { name: brand };
  });
  return [categories, brands];
};

const createCategories = async (categories, token) => {
  const async = [];
  Object.keys(categories).forEach((categoryKey) => {
    async.push(
      supertest
        .post('/api/admin/categories')
        .set('authorization', 'Bearer ' + token)
        .field('name', categories[categoryKey].name)
        .then((res) => {
          categories[categoryKey].id = res.body.id;
        })
    );
  });

  return Promise.all(async);
};
const createBrands = async (brands, token) => {
  const async = [];

  Object.keys(brands).forEach((brandKey) => {
    async.push(
      supertest
        .post('/api/admin/brands')
        .set('authorization', 'Bearer ' + token)
        .field('name', brands[brandKey].name)
        .then((res) => {
          brands[brandKey].id = res.body.id;
        })
    );
  });

  return Promise.all(async);
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

const startServer = () => {
  return new Promise((resolve) => {
    app.listen(serverPost, () => {
      console.log('server running ');
      resolve();
    });
  });
};

const main = async () => {
  let products = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'final_data.json'))
  );
  products = processData(products);
  const [categories, brands] = findAllCategoriesAndBrand(products);
  const adminToken = (
    await supertest
      .post('/api/user/signin')
      .send({ email: 'vnsport@vnsport.com', password: 'admin' })
  ).body.token;

  await Promise.all([
    createCategories(categories, adminToken),
    createBrands(brands, adminToken),
  ]);

  await startServer();
  for (const product of products) {
    await createProduct(product, categories, brands, adminToken);
  }
};

// model.initialize().then(() =>
//   app.listen(4000, () => {
//     main().then(() => {
//       const t0 = performance.now();
//       const t1 = performance.now();
//       console.log(
//         `Time to finish ${Math.floor((t1 - t0) * 1000) / 1000} milliseconds.`
//       );
//     });
//   })
// );

model.initialize().then(() => {
  const t0 = performance.now();
  main().then(() => {
    const t1 = performance.now();
    console.log(
      `Time to finish ${Math.floor((t1 - t0) * 1000) / 1000} milliseconds.`
    );
    process.exit();
  });
});
