const productController = require('../../controllers/common/product.controller');

const routes = require('express').Router();

/*------------------------------------------------------*/
/*--------------------/api/products-----------------------*/
/*------------------------------------------------------*/

routes.get(
  '/:productId',
  productController.getProductDetail,
  productController.increaseProductDetailVisitedCount
);

routes.get('/', productController.getProductPreviews);

module.exports = routes;
