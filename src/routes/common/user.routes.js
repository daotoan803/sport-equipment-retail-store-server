const express = require('express');

const userController = require('../../controllers/user.controller');
const userValidator = require('../../middlewares/validations/user.validator');
const authController = require('../../middlewares/authentication');

/*------------------------------------------------------*/
/*--------------------/api/user-----------------------*/
/*------------------------------------------------------*/

const routes = express.Router();

routes.post(
  '/signup',
  userValidator.validateUserSignup,
  userController.signup,
  authController.createAccessToken
);
routes.post('/signin', authController.signin, authController.createAccessToken);
routes.post(
  '/logout/all',
  authController.validateAccessToken,
  authController.logoutEveryWhere
);
// routes.get('/reset-password', AuthController.sendOtpCode);

module.exports = routes;
