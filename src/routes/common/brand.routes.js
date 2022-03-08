const routes = require('express').Router();
const brandController = require('../../controllers/brand.controller');
const brandValidation = require('../../validations/brand.validation');
const validate = require('../../middlewares/validate');

routes.get('/', validate(brandValidation.getBrands), brandController.getBrands);

module.exports = routes;
