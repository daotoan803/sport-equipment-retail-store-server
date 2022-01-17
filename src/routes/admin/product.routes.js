const express = require('express');

const productController = require('../../controllers/product.controller');
const uploadController = require('../../middlewares/upload-handler');

const routes = express.Router();

routes.post('/', productController.addProduct);
routes.post(
  '/images',
  uploadController.handleMultipleImagesUpload,
  productController.addProductImages
);

module.exports = routes;
