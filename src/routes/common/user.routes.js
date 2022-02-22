const express = require('express');

const userController = require('../../controllers/common/user.controller');
const userValidator = require('../../middlewares/validations/user.validator');
const authMiddleware = require('../../middlewares/auth.middleware');
const authController = require('../../controllers/common/auth.controller');

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
routes.post(
  '/signin',
  authMiddleware.getUserAndUserAccountByEmail,
  authMiddleware.validateUserAccountPassword,
  authController.createAccessToken
);
routes.post(
  '/logout/all',
  authMiddleware.validateAccessTokenAndGetUserAccount,
  authMiddleware.validateUserAccountPassword,
  authController.logoutEveryWhere
);
// routes.get('/reset-password', AuthController.sendOtpCode);

module.exports = routes;
