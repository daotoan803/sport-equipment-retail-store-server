const express = require('express');

const commonRoutes = require('./common');
const adminRoutes = require('./admin');
const errorHandlerController = require('../controllers/error-handler.controller');
const customerRoutes = require('./customer');

const routes = express.Router();

/*--------------------------------------------*/
/*------------------/api----------------------*/
/*--------------------------------------------*/

routes.use('/', commonRoutes);
routes.use('/admin', adminRoutes);
routes.use('/user', customerRoutes);

routes.use(errorHandlerController.routesNotExistsHandle);

routes.use(errorHandlerController.errorHandler);

module.exports = routes;
