const BrandController = require('../../controllers/brand.controller');
const brandValidator = require('../../middlewares/validations/brand.validator');

const routes = require('express').Router();

/*------------------------------------------------------*/
/*-------------------- /api/admin/brands -----------------------*/
/*------------------------------------------------------*/

routes.post(
  '/',
  brandValidator.validateBrandData,
  brandValidator.checkIfBrandNameExists,
  BrandController.addBrand
);

module.exports = routes;
