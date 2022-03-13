const Product = require('../models/product.model');
const brandService = require('./brand.service');
const categoryService = require('./category.service');
const Category = require('../models/category.model');
const ApiError = require('../errors/ApiError');
const httpStatus = require('http-status');
const Brand = require('../models/brand.model');
const ProductImage = require('../models/product-image.model');
const sequelizeConnection = require('../models/db-connection');
const imageUtil = require('../utils/image.util');
const CategoryGroup = require('../models/category-group.model');

const productPreviewAttributes = [
  'id',
  'title',
  'price',
  'discountPrice',
  'availableQuantity',
  'state',
  'mainImageUrl',
  'soldCount',
  'visitedCount',
  'reviewCount',
];

const generateProductFilterOption = (filterOption = {}) => {
  if (Object.keys(filterOption).length === 0) return {};
  const option = {};
  const { page, limit, sortBy, brandId, state } = filterOption;
  if (page && limit) {
    option.offset = (page - 1) * limit;
    option.limit = limit;
  }

  if (sortBy) {
    option.order = [Product.sortOptions[sortBy]];
  }

  if (brandId) {
    option.where = { brandId };
  }

  option.where = option.where || {};

  option.where.state = [Product.state.available, Product.state.outStock];

  if (state) {
    option.where.state = state;
  }

  return option;
};

const increaseProductVisitedCount = async (productId) => {
  await Product.increment('visitedCount', { by: 1, where: { id: productId } });
};

const checkProductTitleExists = (title) => Product.isTitleExists(title);

const findProductById = async (productId, options = {}) => {
  const product = await Product.findByPk(productId, options);
  if (!product)
    throw new ApiError(httpStatus.NOT_FOUND, 'Product id not exists');
  return product;
};

const getProductDetail = async (productId) => {
  const product = await Product.findByPk(productId, {
    include: [Brand, { model: Category, include: CategoryGroup }, ProductImage],
  });

  if (!product)
    throw new ApiError(httpStatus.NOT_FOUND, 'Product id not exists');

  return product;
};

const getProducts = (filterOption = {}) => {
  const option = generateProductFilterOption(filterOption);
  option.attributes = productPreviewAttributes;
  return Product.findAndCountAll(option);
};

const getProductsByCategoryCode = async (categoryCode, filterOption = {}) => {
  const category = await Category.findOneByCode(categoryCode);
  if (!category)
    throw new ApiError(httpStatus.NOT_FOUND, 'Category Code not exists');

  const option = generateProductFilterOption(filterOption);
  option.where = option.where || {};
  option.where.categoryId = category.id;
  option.attributes = productPreviewAttributes;
  return Product.findAndCountAll(option);
};

const getProductsByCategoryGroupCode = async (
  categoryGroupCode,
  filterOption = {}
) => {
  const categories = await categoryService.getCategoriesByCategoryGroupCode(
    categoryGroupCode
  );
  const categoriesIdList = categories.map((category) => category.id);

  const option = generateProductFilterOption(filterOption);
  option.where = option.where || {};
  option.where.categoryId = categoriesIdList;
  option.attributes = productPreviewAttributes;
  return Product.findAndCountAll(option);
};

const createPreviewImageAndAddToProduct = async (
  previewImageUrls = [],
  product,
  transaction = null
) => {
  if (!previewImageUrls || previewImageUrls.length === 0) return null;

  const transactionOption = transaction ? { transaction } : {};

  const previewImages = await ProductImage.bulkCreate(
    previewImageUrls.map((url) => ({ productId: product.id, url })),
    { ...transactionOption }
  );
  return previewImages;
};

const createProduct = async ({
  title,
  detail,
  price,
  discountPrice,
  warrantyPeriodByDay,
  availableQuantity,
  state,
  brandId,
  categoryId,
  mainImageUrl,
  previewImageUrls,
}) => {
  if (await Product.isTitleExists(title))
    throw new ApiError(httpStatus.CONFLICT, 'Product title already taken');

  // check if brand and category exists, if not auto throw api error
  await Promise.all([
    brandService.findBrandById(brandId),
    categoryService.findCategoryById(categoryId),
  ]);

  const transaction = await sequelizeConnection.transaction();
  try {
    const product = await Product.create(
      {
        title,
        detail,
        price,
        discountPrice,
        warrantyPeriodByDay,
        availableQuantity,
        state,
        brandId,
        categoryId,
        mainImageUrl,
      },
      { transaction }
    );

    if (previewImageUrls?.length > 0) {
      await createPreviewImageAndAddToProduct(
        previewImageUrls,
        product,
        transaction
      );
    }
    transaction.commit();
    return product;
  } catch (e) {
    transaction.rollback();
    throw e;
  }
};

/**
 * Destroy product image in database and uploaded image
 * @param  {} productImageIdList=[] List of product image's id to be remove
 * @return {promise<void>}
 */
const removeProductImages = (productImageIdList = []) => {
  return Promise.all(
    productImageIdList.map(async (productImageId) => {
      const productImage = await ProductImage.findByPk(productImageId);
      if (productImage) {
        imageUtil.deleteUploadedImageByUrl(productImage.url);
        await productImage.destroy();
      }
    })
  );
};

const updateProduct = async (
  productId,
  {
    title,
    detail,
    price,
    discountPrice,
    warrantyPeriodByDay,
    state,
    brandId,
    categoryId,
    mainImageUrl,
    previewImageUrls,
  }
) => {
  const product = await Product.findByPk(productId);
  if (!product)
    throw new ApiError(httpStatus.NOT_FOUND, 'Product id not exists');

  await Promise.all([
    brandService.findBrandById(brandId),
    categoryService.findCategoryById(categoryId),
  ]);

  if (title !== product.title) {
    if (await Product.isTitleExists(title)) {
      throw new ApiError(
        httpStatus.CONFLICT,
        'Product title have already taken'
      );
    }
    product.title = title;
  }

  product.detail = detail;
  product.price = price;
  product.discountPrice = discountPrice;
  product.warrantyPeriodByDay = warrantyPeriodByDay;
  product.state = state;
  product.brandId = brandId;
  product.categoryId = categoryId;

  //if mainImageUrl exists mean that user have change main image
  if (mainImageUrl) {
    await imageUtil.deleteUploadedImageByUrl(product.mainImageUrl);
    product.mainImageUrl = mainImageUrl;
  }

  const transaction = await sequelizeConnection.transaction();

  try {
    await product.save({ transaction });

    //if have new product images
    if (previewImageUrls) {
      await createPreviewImageAndAddToProduct(
        previewImageUrls,
        product,
        transaction
      );
    }

    transaction.commit();
  } catch (e) {
    transaction.rollback();
    throw e;
  }
};

const updateProductAvailableQuantity = async (productId, quantityChanged) => {
  const product = await findProductById(productId);
  return product.increment('availableQuantity', { by: quantityChanged });
};

module.exports = {
  getProductDetail,
  getProducts,
  getProductsByCategoryCode,
  getProductsByCategoryGroupCode,
  increaseProductVisitedCount,
  createProduct,
  checkProductTitleExists,
  removeProductImages,
  updateProduct,
  findProductById,
  updateProductAvailableQuantity,
};
