const routes = require('express').Router();
const authController = require('../../controllers/common/auth.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

const chatRoutes = require('./chat.routes');

routes.use('/', authMiddleware.validateAccessTokenAndGetUserAccount);
routes.post('/validateToken', authController.checkTokenStillValid);
routes.use('/chat', chatRoutes);

module.exports = routes;
