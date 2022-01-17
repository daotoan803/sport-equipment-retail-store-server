const express = require('express');

const userController = require('../../controllers/user.controller');
const authController = require('../../middlewares/authentication');
const validator = require('../../middlewares/validator');

/*----------------- /user/* -----------------*/

const routes = express.Router();

// routes.use('/', (req, res, next) => {
//   console.log('inside common/user routes');
//   next();
// });
routes.post(
  '/signup',
  validator.validateUserSignup,
  userController.signup,
  authController.createAccessToken
);
routes.post(
  '/signin',
  authController.signin,
  authController.createAccessToken
);
routes.post(
  '/logout/all',
  authController.validateAccessToken,
  authController.logoutEveryWhere
);
// routes.get('/reset-password', AuthController.sendOtpCode);

module.exports = routes;
