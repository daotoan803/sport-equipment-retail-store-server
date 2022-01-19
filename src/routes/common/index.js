const userRoutes = require('./user.routes');
const categoryRoutes = require('./category.routes');
const brandRoutes = require('./brand.routes');
const productRoutes = require('./product.routes');

const routes = require('express').Router();

routes.use('/user', userRoutes);
routes.use('/brands', brandRoutes);
routes.use('/categories', categoryRoutes);
routes.use('/products', productRoutes);

module.exports = routes;
