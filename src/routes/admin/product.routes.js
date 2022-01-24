const express = require('express');

const productController = require('../../controllers/product.controller');
const productValidator = require('../../middlewares/validations/product.validator');

const uploadHandler = require('../../middlewares/upload-handler');

const routes = express.Router();

/*------------------------------------------------------*/
/*--------------------/api/admin/products-----------------------*/
/*------------------------------------------------------*/

routes.get(
  '/isTitleUnique',
  productValidator.checkIfProductTitleAlreadyExists,
  productController.responseIsTitleUnique
);

routes.post(
  '/:productId/images',
  uploadHandler.handleMultipleImagesUpload,
  productController.getProductDetailById,
  productController.addProductImages
);

routes.post(
  '/',
  uploadHandler.handleMultipleImagesUpload,
  productValidator.validateAddProductData,
  productValidator.checkIfProductTitleAlreadyExists,
  productController.findBrandAndCategories,
  productController.createProduct
);

module.exports = routes;
