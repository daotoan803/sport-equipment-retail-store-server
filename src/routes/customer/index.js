const routes = require('express').Router();
const authMiddleware = require('../../middlewares/auth.middleware');

const chatRoutes = require('./chat.routes');

routes.use('/', authMiddleware.validateAccessTokenAndGetUserAccount);
routes.use('/chat', chatRoutes);

module.exports = routes;
