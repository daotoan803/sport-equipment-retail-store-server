const BrandController = require('../../controllers/brand.controller');
const uploadController = require('../../controllers/upload.controller');

const routes = require('express').Router();

routes.post(
  '/',
  uploadController.handleSingleImageUpload,
  BrandController.addBrand
);

module.exports = routes;
