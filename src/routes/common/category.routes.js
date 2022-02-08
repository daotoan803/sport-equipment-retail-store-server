const categoryController = require('../../controllers/category.controller');

const routes = require('express').Router();

/*------------------------------------------------------*/
/*--------------------/api/categories-----------------------*/
/*------------------------------------------------------*/

routes.get('/', categoryController.getCategories);
routes.get('/group', categoryController.getCategoriesGroup);

module.exports = routes;
