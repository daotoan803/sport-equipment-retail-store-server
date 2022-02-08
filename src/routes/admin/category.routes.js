const adminCategoryController = require('../../controllers/admin/category.controller');
const categoryValidator = require('../../middlewares/validations/category.validator');

const routes = require('express').Router();

/*------------------------------------------------------*/
/*--------------------/api/admin/categories-----------------------*/
/*------------------------------------------------------*/

routes.post(
  '/',
  categoryValidator.validateCategoryData,
  categoryValidator.checkIfCategoryNameExists,
  adminCategoryController.addCategory
);

module.exports = routes;
