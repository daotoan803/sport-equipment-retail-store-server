const express = require('express');

const productController = require('../../controllers/product.controller');
const uploadController = require('../../controllers/upload.controller');
const multer = require('multer');
const upload = multer();

const routes = express.Router();

routes.post(
  '/',
  upload.none(),
  productController.validateProductDetail,
  uploadController.handleMultipleImagesUpload,
  productController.addProduct
);

module.exports = routes;
