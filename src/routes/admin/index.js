const express = require('express');

const authController = require('../../controllers/auth.controller');

const productRoutes = require('./product.routes');
const brandRoutes = require('./brand.routes');
const categoryRoutes = require('./category.routes');

const routes = express.Router();

routes.use(authController.validateAccessToken);

routes.use('/product', productRoutes);
routes.use('/brand', brandRoutes);
routes.use('/category', categoryRoutes);

module.exports = routes;
