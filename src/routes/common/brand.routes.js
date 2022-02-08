const brandController = require('../../controllers/common/brand.controller');

const routes = require('express').Router();

/*----------------------------------------------------*/
/*--------------------/api/products-----------------------*/
/*----------------------------------------------------*/

routes.get('/', brandController.getBrands);

module.exports = routes;
