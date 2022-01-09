const express = require('express');

const path = require('path');
const userRoutes = require('./user.routes.js');
const adminRoutes = require('./admin');
const errorHandlerController = require('../controllers/error-handler.controller');

const routes = express.Router();

routes.use('/user', userRoutes);
routes.use('/admin', adminRoutes);

routes.use('/', (req, res) => {
  res.sendFile(
    path.join(__dirname, '..', '..', 'client', 'shop', 'index.html')
  );
});

routes.use(errorHandlerController.routesNotExistsHandle);

routes.use(errorHandlerController.errorHandler);

module.exports = routes;
