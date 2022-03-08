const httpStatus = require('http-status');
const productService = require('../services/product.service');
const handleError = require('../utils/handle-error');
const imageUtils = require('../utils/image.util');
const categoryService = require('../services/category.service');

const getProducts = handleError(async (req, res) => {
  const { categoryCode, categoryGroupCode, brandId, page, limit, sortBy } =
    req.query;

  const filterOption = { brandId, page, limit, sortBy };
  let products = null;
  if (categoryCode) {
    products = await productService.getProductsByCategoryCode(
      categoryCode,
      filterOption
    );
  } else if (categoryGroupCode) {
    products = await productService.getProductsByCategoryGroupCode(
      categoryGroupCode,
      filterOption
    );
  } else {
    products = await productService.getProducts(filterOption);
  }

  return res.json(products);
});

const getProduct = handleError(async (req, res) => {
  const { productId } = req.params;
  const product = await productService.getProductDetail(productId);
  res.json(product);
  productService.increaseProductVisitedCount(productId);
});

const addProduct = handleError(async (req, res) => {
  const {
    images,
    mainImage: [mainImage],
  } = req.files;
  const { brandId, categoryId } = req.body;

  req.body.mainImageUrl = imageUtils.createImageUrlFromMulterFile(mainImage);

  if (images?.length > 0) {
    req.body.previewImageUrls = images.map((image) =>
      imageUtils.createImageUrlFromMulterFile(image)
    );
  }

  const product = await productService.createProduct(req.body);
  await categoryService.addBrandToCategory(categoryId, brandId);
  res.json({ product });
});

const checkProductTitleIsUnique = handleError(async (req, res) => {
  const { title } = req.body;
  const titleIsExists = await productService.checkProductTitleExists(title);
  res.sendStatus(titleIsExists ? httpStatus.CONFLICT : httpStatus.NO_CONTENT);
});

const updateProduct = handleError(async (req, res) => {
  const { productId } = req.params;
  const {
    images,
    mainImage: [mainImage],
  } = req.files;
  const { removeImageIds } = req.body;

  if (mainImage) {
    req.body.mainImageUrl = imageUtils.createImageUrlFromMulterFile(mainImage);
  }
  if (images && images.length > 0) {
    req.body.previewImageUrls = images.map((image) =>
      imageUtils.createImageUrlFromMulterFile(image)
    );
  }

  await productService.updateProduct(productId, req.body);

  if (removeImageIds && removeImageIds.length > 0) {
    await productService.removeProductImages(removeImageIds);
  }

  return res.sendStatus(httpStatus.NO_CONTENT);
});

module.exports = {
  getProducts,
  getProduct,
  addProduct,
  checkProductTitleIsUnique,
  updateProduct,
};
