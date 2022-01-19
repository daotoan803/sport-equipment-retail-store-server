const categoryController = require('../../controllers/category.controller');

const routes = require('express').Router();

/*------------------------------------------------------*/
/*--------------------/api/categories-----------------------*/
/*------------------------------------------------------*/

routes.get('/', categoryController.getCategories);

module.exports = routes;
