const userRoutes = require('./user.routes');
const brandController = require('../../controllers/brand.controller');
const categoryController = require('../../controllers/category.controller');

const routes = require('express').Router();

// routes.use('/', (req, res,next) => {
//   console.log('inside common routes');
//   next();
// })
routes.use('/user', userRoutes);

routes.get('/brands', brandController.getBrands);
routes.get('/categories', categoryController.getCategories);

module.exports = routes;
