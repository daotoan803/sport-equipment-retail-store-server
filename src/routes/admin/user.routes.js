const routes = require('express').Router();
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');

/*------------------------------------------------------*/
/*--------------------/api/admin/user-----------------------*/
/*------------------------------------------------------*/

routes.get(
  '/:userId',
  validate(userValidation.findUser),
  userController.findUserDetail
);

module.exports = routes;
