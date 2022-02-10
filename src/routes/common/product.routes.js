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
  '/category-group/:categoryGroupId',
  productController.getProductsByCategoryGroup
);

routes.get('/', productController.getProductsPreview);

module.exports = routes;
