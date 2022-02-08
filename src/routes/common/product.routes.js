const productController = require('../../controllers/common/product.controller');
const productMiddleware = require('../../middlewares/product.middleware');

const routes = require('express').Router();

/*------------------------------------------------------*/
/*--------------------/api/products-----------------------*/
/*------------------------------------------------------*/

routes.get(
  '/:productId',
  productMiddleware.getProductById,
  productController.responseProductDetail
);

routes.get(
  '/group/:categoryGroupId',
  productController.getProductsByCategoryGroup
);

routes.get('/', productController.getProductsPreview);

module.exports = routes;
