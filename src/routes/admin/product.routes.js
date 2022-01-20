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
  '/:productId/addImages',
  uploadHandler.handleMultipleImagesUpload,
  productController.getProductDetailById,
  productController.createProductImages,
  productController.setImagesToProduct
);

routes.post(
  '/',
  uploadHandler.handleMultipleImagesUpload,
  productValidator.validateAddProductData,
  productValidator.checkIfProductTitleAlreadyExists,
  productController.createProduct,
  productController.createProductImages,
  productController.setImagesToProduct
);

module.exports = routes;
