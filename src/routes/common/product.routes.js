const productController = require('../../controllers/product.controller');

const routes = require('express').Router();

/*------------------------------------------------------*/
/*--------------------/api/products-----------------------*/
/*------------------------------------------------------*/

routes.get('/:productId', 
productController.findProduct,
productController.responseProductDetail);

routes.get('/', productController.getAllProductsPreview);

module.exports = routes;
