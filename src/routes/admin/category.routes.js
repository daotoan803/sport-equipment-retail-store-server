const categoryController = require('../../controllers/category.controller');
const uploadController = require('../../middlewares/upload-handler');
const categoryValidator = require('../../middlewares/validations/category.validator');

const routes = require('express').Router();

/*------------------------------------------------------*/
/*--------------------/api/admin/categories-----------------------*/
/*------------------------------------------------------*/

routes.post(
  '/',
  uploadController.handleSingleImageUpload,
  categoryValidator.validateCategoryData,
  categoryValidator.checkIfCategoryNameExists,
  categoryController.addCategory
);

module.exports = routes;
