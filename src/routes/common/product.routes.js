const productController = require('../../controllers/common/product.controller');
const productMiddleware = require('../../middlewares/product.middleware');

const routes = require('express').Router();

/*------------------------------------------------------*/
/*--------------------/api/products-----------------------*/
/*------------------------------------------------------*/

routes.get(
  '/:productId',
  productMiddleware.getProductById,
  productController.responseProductDetail,
  productController.increaseProductDetailVisitedCount
);

routes.get(
  '/category-group/:categoryGroupCode',
  productController.getProductsByCategoryGroup
);

routes.get('/', productController.getAllProductPreviews);

module.exports = routes;
