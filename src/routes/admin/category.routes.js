const categoryController = require('../../controllers/category.controller');
const uploadController = require('../../controllers/upload.controller');

const routes = require('express').Router();

routes.post(
  '/',
  uploadController.handleSingleImageUpload,
  categoryController.addCategory
);

module.exports = routes;
