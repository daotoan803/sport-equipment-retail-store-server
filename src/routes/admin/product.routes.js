const express = require('express');

const ProductController = require('../../controllers/product.controller');

const routes = express.Router();

routes.post(
  '/',
  ProductController.validateProductDetail,
  ProductController.handleImageUpload,
  ProductController.addProduct
);

module.exports = routes;
