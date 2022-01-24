const express = require('express');

const userController = require('../../controllers/user.controller');
const userValidator = require('../../middlewares/validations/user.validator');
const authentication = require('../../middlewares/authentication');
const authController = require('../../controllers/auth.controller');

/*------------------------------------------------------*/
/*--------------------/api/user-----------------------*/
/*------------------------------------------------------*/

const routes = express.Router();

routes.post(
  '/signup',
  userValidator.validateUserSignup,
  userValidator.checkIfEmailExists,
  userController.signup,
  authController.createAccessToken
);
routes.post('/signin', authentication.signin, authController.createAccessToken);
routes.post(
  '/logout/all',
  authentication.validateAccessToken,
  authentication.logoutEveryWhere
);
// routes.get('/reset-password', AuthController.sendOtpCode);

module.exports = routes;
