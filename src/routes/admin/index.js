const express = require('express');

const authController = require('../../middlewares/auth.middleware');

const productRoutes = require('./product.routes');
const brandRoutes = require('./brand.routes');
const categoryRoutes = require('./category.routes');
const chatRoutes = require('./chat.routes');

const routes = express.Router();

/*-------------------------------------------------*/
/*--------------------/api/admin-----------------------*/
/*-------------------------------------------------*/

routes.use(
  authController.validateAccessTokenAndGetUserAccount,
  authController.checkAdminAuthorization
);

routes.use('/products', productRoutes);
routes.use('/brands', brandRoutes);
routes.use('/categories', categoryRoutes);
routes.use('/chat', chatRoutes);

module.exports = routes;
