const adminBrandController = require('../../controllers/admin/brand.controller');
const brandValidator = require('../../middlewares/validations/brand.validator');

const routes = require('express').Router();

/*------------------------------------------------------*/
/*-------------------- /api/admin/brands -----------------------*/
/*------------------------------------------------------*/

routes.post(
  '/',
  brandValidator.validateBrandData,
  brandValidator.checkIfBrandNameExists,
  adminBrandController.addBrand
);

module.exports = routes;
