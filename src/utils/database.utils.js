const Product = require('../models/product.model');
const ProductImage = require('../models/product-image.model');
const Brand = require('../models/brand.model');
const Category = require('../models/category.model');

const createSampleProduct = async () => {
  const product = {
    title: 'Sample product __test_____',
    detail: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
    price: 14000000,
    discountPrice: 12000000,
    warrantyPeriodByDay: 120,
    availableQuantity: 100,
    state: Product.state.hidden,
  };
  const existsProduct = await Product.findOne({
    where: {
      title: product.title,
    },
  });
  if (existsProduct) return existsProduct;

  return Product.create(product);
};

const createSampleProductImages = async () => {
  const productImages = [
    { url: '/images/image___test__do__not__delete__2_' },
    { url: '/images/image___test__do__not__delete__3_' },
    { url: '/images/image___test__do__not__delete__4_' },
  ];

  const existsProductImages = await ProductImage.findAll({
    where: { url: productImages.map((image) => image.url) },
  });

  if (existsProductImages.length > 0) return existsProductImages;

  return ProductImage.bulkCreate(productImages);
};

const createSampleBrand = async () => {
  const brand = {
    name: 'Adidas __test__',
    logoUrl: '/images/image___test__do__not__delete__1_',
  };

  const existsBrand = await Brand.findOne({ where: { name: brand.name } });
  if (existsBrand) return existsBrand;

  return Brand.create(brand);
};

const createSampleCategories = async () => {
  const categories = [
    {
      name: 'Basketball __test__',
      logoUrl: '/images/image___test__do__not__delete__1_',
    },
    {
      name: 'Baseball __test__',
      logoUrl: '/images/image___test__do__not__delete__1_',
    },
  ];

  const existsCategories = await Category.findAll({
    where: {
      name: categories.map((category) => category.name),
    },
  });
  if (existsCategories.length > 0) return existsCategories;

  return Category.bulkCreate(categories);
};

module.exports = {
  async createSampleDataForTesting() {
    const [brand, categories, product, productImages] = await Promise.all([
      createSampleBrand(),
      createSampleCategories(),
      createSampleProduct(),
      createSampleProductImages(),
    ]);

    const [productBrand, productCategories, productPreviewImages] =
      await Promise.all([
        product.getBrand(),
        product.getCategories(),
        product.getProductImages(),
      ]);

    if (!productBrand) await product.setBrand(brand);
    if (productCategories.length === 0) await product.setCategories(categories);
    if (productPreviewImages.length === 0)
      await product.setProductImages(productImages);

    // const fullFillProduct = await Product.findByPk(product.id, {
    //   include: [Brand, Category, ProductImage],
    //   paranoid: false,
    // });
  },
};
