const express = require('express');

const UserController = require('../../controllers/user.controller');
const AuthController = require('../../controllers/auth.controller');

const routes = express.Router();

routes.post('/signup', UserController.signup, AuthController.createAccessToken);
routes.post('/signin', AuthController.signin, AuthController.createAccessToken);
routes.use(AuthController.validateAccessToken);
routes.post('/logout/all', AuthController.logoutEveryWhere);
// routes.get('/reset-password', AuthController.sendOtpCode);

module.exports = routes;
