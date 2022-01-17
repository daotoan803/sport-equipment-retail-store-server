const categoryController = require('../../controllers/category.controller');
const uploadController = require('../../middlewares/upload-handler');

const routes = require('express').Router();

routes.post(
  '/',
  uploadController.handleSingleImageUpload,
  categoryController.addCategory
);

module.exports = routes;
