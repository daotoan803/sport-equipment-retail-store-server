const express = require('express');

const ProductController = require('../../controllers/product.controller');

const routes = express.Router();

routes.post('/', ProductController.addProduct);

module.exports = routes;
