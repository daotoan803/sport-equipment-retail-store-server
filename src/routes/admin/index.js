const express = require('express');

const productRoutes = require("./product.routes")

const routes = express.Router();

routes.post('/product', productRoutes)

module.exports = routes;