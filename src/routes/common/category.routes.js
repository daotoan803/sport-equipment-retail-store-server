const routes = require('express').Router();
const categoryController = require('../../controllers/category.controller');
const categoryValidation = require('../../validations/category.validation');
const validate = require('../../middlewares/validate');

routes.get(
  '/',
  validate(categoryValidation.getCategories),
  categoryController.getCategories
);

routes.get('/groups', categoryController.getCategoryGroups);

module.exports = routes;
