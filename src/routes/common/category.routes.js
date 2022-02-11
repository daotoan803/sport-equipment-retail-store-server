const categoryController = require('../../controllers/common/category.controller');

const routes = require('express').Router();

/*------------------------------------------------------*/
/*--------------------/api/categories-----------------------*/
/*------------------------------------------------------*/

routes.get('/', categoryController.getCategories);
routes.get('/group', categoryController.getAllCategoryGroups);

module.exports = routes;
