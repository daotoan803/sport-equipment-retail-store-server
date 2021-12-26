const express = require('express');

const userRoutes = require('./user.routes.js');

const routes = new express.Router();

routes.use('/user', userRoutes);

routes.use((req, res) => {
  res.sendStatus(404);
});

// eslint-disable-next-line no-unused-vars
routes.use((err, req, res, next) => {
  res.sendStatus(500);
  console.error(err);
});

module.exports = routes;
