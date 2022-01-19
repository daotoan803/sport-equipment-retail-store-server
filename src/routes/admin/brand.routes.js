const BrandController = require('../../controllers/brand.controller');
const uploadController = require('../../middlewares/upload-handler');

const routes = require('express').Router();


/*------------------------------------------------------*/
/*--------------------/api/admin/brands-----------------------*/
/*------------------------------------------------------*/


routes.post(
  '/',
  uploadController.handleSingleImageUpload,
  BrandController.addBrand
);

module.exports = routes;
