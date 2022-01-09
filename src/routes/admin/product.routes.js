const express = require('express');

const productController = require('../../controllers/product.controller');
const uploadController = require('../../controllers/upload.controller');

const routes = express.Router();

routes.post(
  '/',
  productController.validateProductDetail,
  uploadController.handleMultipleImagesUpload,
  productController.addProduct
);

module.exports = routes;
