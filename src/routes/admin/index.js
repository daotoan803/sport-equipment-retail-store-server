const express = require('express');

const authController = require('../../middlewares/authentication');

const productRoutes = require('./product.routes');
const brandRoutes = require('./brand.routes');
const categoryRoutes = require('./category.routes');

const routes = express.Router();

/*-------------------------------------------------*/
/*--------------------/api/admin-----------------------*/
/*-------------------------------------------------*/

routes.use(
  authController.validateAccessToken,
  authController.checkAdminAuthorization
);

routes.use('/products', productRoutes);
routes.use('/brands', brandRoutes);
routes.use('/categories', categoryRoutes);

module.exports = routes;
