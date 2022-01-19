const brandController = require('../../controllers/brand.controller');

const routes = require('express').Router();

/*----------------------------------------------------*/
/*--------------------/api/products-----------------------*/
/*----------------------------------------------------*/

routes.get('/', brandController.getBrands);

module.exports = routes;
