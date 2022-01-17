const BrandController = require('../../controllers/brand.controller');
const uploadController = require('../../middlewares/upload-handler');

const routes = require('express').Router();

routes.post(
  '/',
  uploadController.handleSingleImageUpload,
  BrandController.addBrand
);

module.exports = routes;
