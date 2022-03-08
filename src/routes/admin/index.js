const express = require('express');

const productRoutes = require('./product.routes');
const brandRoutes = require('./brand.routes');
const categoryRoutes = require('./category.routes');
// const chatRoutes = require('./chat.routes');
const userRoutes = require('./user.routes');
const orderRoutes = require("./order.routes")
const authMiddleware = require('../../middlewares/authentication');


const routes = express.Router();

/*-------------------------------------------------*/
/*--------------------/api/admin-----------------------*/
/*-------------------------------------------------*/

routes.use(authMiddleware.verifyToken, authMiddleware.verifyAdminAuthorization);

routes.use('/users', userRoutes);
routes.use('/products', productRoutes);
routes.use('/brands', brandRoutes);
routes.use("/orders", orderRoutes);
routes.use('/categories', categoryRoutes);
// routes.use('/chat', chatRoutes);

module.exports = routes;
