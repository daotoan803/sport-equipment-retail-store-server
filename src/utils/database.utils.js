const Product = require('../models/product.model');
const ProductImage = require('../models/product-image.model');
const Brand = require('../models/brand.model');
const Category = require('../models/category.model');
const User = require('../models/user.model');
const Account = require('../models/account.model');

const createSampleProduct = async () => {
  const product = {
    title: 'Sample product __test_____',
    detail: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
    price: 14000000,
    discountPrice: 12000000,
    warrantyPeriodByDay: 120,
    availableQuantity: 100,
    state: Product.state.hidden,
    mainImageUrl: '/images/image___test__do__not__delete__5_.jpg',
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
    { url: '/images/image___test__do__not__delete__2_.jpg' },
    { url: '/images/image___test__do__not__delete__3_.jpg' },
    { url: '/images/image___test__do__not__delete__4_.jpg' },
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

const createSampleCategory = async () => {
  const category = {
    name: 'Basketball __test__',
  };

  const existsCategory = await Category.findOne({
    where: {
      name: category.name,
    },
  });
  if (existsCategory) return existsCategory;

  return Category.create(category);
};

module.exports = {
  async createDefaultAdminAccount() {
    const defaultAdminAccount = {
      name: 'admin',
      email: 'vnsport@vnsport.com',
      dob: '01-01-2000',
      gender: User.gender.other,
      password: 'admin',
    };
    const alreadyCreate = await User.isEmailAlreadyExist(
      defaultAdminAccount.email
    );
    if (alreadyCreate) return;

    const admin = await User.signupUser(defaultAdminAccount);
    admin.account = await admin.getAccount();
    admin.account.role = Account.role.admin;
    return admin.account.save();
  },

  async createSampleDataForTesting() {
    const [brand, category, product, productImages] = await Promise.all([
      createSampleBrand(),
      createSampleCategory(),
      createSampleProduct(),
      createSampleProductImages(),
    ]);

    const [productBrand, productCategory, productPreviewImages] =
      await Promise.all([
        product.getBrand(),
        product.getCategory(),
        product.getProductImages(),
      ]);

    if (!productBrand) await product.setBrand(brand);
    if (!productCategory) await product.setCategory(category);
    if (productPreviewImages.length === 0)
      await product.setProductImages(productImages);

    // const fullFillProduct = await Product.findByPk(product.id, {
    //   include: [Brand, Category, ProductImage],
    //   paranoid: false,
    // });
  },
};
