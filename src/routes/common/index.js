const userRoutes = require('./user.routes');
const brandController = require('../../controllers/brand.controller');

const routes = require('express').Router();

routes.use('/user', userRoutes);

routes.get('/brands', brandController.getBrands);

module.exports = routes;
