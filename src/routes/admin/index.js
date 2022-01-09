const express = require('express');

const productRoutes = require('./product.routes');
const brandRoutes = require('./brand.routes');

const routes = express.Router();

routes.use('/product', productRoutes);
routes.use('/brand', brandRoutes);

module.exports = routes;
