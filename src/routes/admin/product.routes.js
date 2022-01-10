const express = require('express');

const productController = require('../../controllers/product.controller');
const uploadController = require('../../controllers/upload.controller');
const multer = require('multer');
const upload = multer();

const routes = express.Router();

routes.post('/', productController.addProduct);

module.exports = routes;
