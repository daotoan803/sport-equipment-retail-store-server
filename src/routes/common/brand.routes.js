const brandController = require('../../controllers/common/brand.controller');

const routes = require('express').Router();

/*----------------------------------------------------*/
/*--------------------/api/brands-----------------------*/
/*----------------------------------------------------*/

routes.get('/', brandController.getBrands);
routes.get('/category/:categoryId', brandController.getBrandByCategory);

module.exports = routes;
