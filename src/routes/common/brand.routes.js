const brandController = require('../../controllers/common/brand.controller');

const routes = require('express').Router();

/*----------------------------------------------------*/
/*--------------------/api/products-----------------------*/
/*----------------------------------------------------*/

routes.get('/', brandController.getBrands);
routes.get("/group/:categoryGroupId", brandController.getBrandsByCategoryGroup)

module.exports = routes;
