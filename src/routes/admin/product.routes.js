const express = require('express');

const adminProductController = require('../../controllers/admin/product.controller');
const productValidator = require('../../middlewares/validations/product.validator');
const productMiddleware = require('../../middlewares/product.middleware');

const uploadHandler = require('../../middlewares/upload-handler');
const adminCategoryController = require('../../controllers/admin/category.controller');

const routes = express.Router();

/*------------------------------------------------------*/
/*--------------------/api/admin/products-----------------------*/
/*------------------------------------------------------*/

routes.post('/is-title-unique', adminProductController.responseIsTitleUnique);

routes.get('/', adminProductController.getProductsForAdmin);

routes.post(
  '/:productId/images',
  uploadHandler.handleMultipleImagesUpload,
  productMiddleware.getProductById,
  adminProductController.addProductImages
);

routes.post(
  '/',
  uploadHandler.handleMultipleImagesUpload,
  productValidator.validateAddProductData,
  productValidator.checkIfProductTitleAlreadyExists,
  productMiddleware.findBrandAndCategory,
  adminProductController.createProduct,
  adminCategoryController.addBrandToCategory
);

module.exports = routes;
