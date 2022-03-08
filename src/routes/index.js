const express = require('express');
const httpStatus = require('http-status');

const commonRoutes = require('./common');
const adminRoutes = require('./admin');

const errorMiddlewares = require('../middlewares/error');

const routes = express.Router();

/*--------------------------------------------*/
/*------------------/api----------------------*/
/*--------------------------------------------*/

routes.use('/', commonRoutes);
routes.use('/admin', adminRoutes);

routes.use((req, res) => {
  return res.status(httpStatus.NOT_FOUND).json({ error: 'Endpoint not found' });
});

routes.use(errorMiddlewares.errorHandler);

module.exports = routes;
