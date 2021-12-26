const { Router } = require('express');

const UserController = require('../controllers/user.controller');
const AuthController = require('../controllers/auth.controller');

const routes = new Router();

routes.post('/signup', UserController.signup);
routes.post('/signin', AuthController.signin);

module.exports = routes;
