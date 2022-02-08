const productController = require('../../controllers/product.controller');

const routes = require('express').Router();

/*------------------------------------------------------*/
/*--------------------/api/products-----------------------*/
/*------------------------------------------------------*/

routes.get(
  '/:productId',
  productController.getProductById,
  productController.responseProductDetail
);

routes.get('/group/:categoryGroupId', 
  productController.getProductsByCategoryGroup,
)

routes.get('/', productController.getProductsPreview);

module.exports = routes;
