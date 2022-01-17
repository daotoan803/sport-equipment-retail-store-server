const express = require('express');

const authController = require('../../middlewares/authentication');

const productRoutes = require('./product.routes');
const brandRoutes = require('./brand.routes');
const categoryRoutes = require('./category.routes');

const routes = express.Router();

routes.use(
  authController.validateAccessToken,
  authController.checkAdminAuthorization
);

routes.use('/product', productRoutes);
routes.use('/brand', brandRoutes);
routes.use('/category', categoryRoutes);

module.exports = routes;
