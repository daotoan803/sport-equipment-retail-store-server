const categoryController = require('../../controllers/category.controller');
const categoryValidator = require('../../middlewares/validations/category.validator');

const routes = require('express').Router();

/*------------------------------------------------------*/
/*--------------------/api/admin/categories-----------------------*/
/*------------------------------------------------------*/

routes.post(
  '/',
  categoryValidator.validateCategoryData,
  categoryValidator.checkIfCategoryNameExists,
  categoryController.addCategory
);

module.exports = routes;
