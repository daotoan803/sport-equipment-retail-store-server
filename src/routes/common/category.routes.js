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

/**
 * @openapi
 * tags: Category
 */

/**
 * @openapi
 * /api/categories:
 *  get:
 *    tags: [Category]
 *    summary: Get list of categories
 *    parameters:
 *      - in: query
 *        name: brandId
 *        type: number
 *        description: find all categories belong to this brand
 *      - in: query
 *        name: categoryGroupCode
 *        type: string
 *        description: find all categories belong to this categoryGroupCode
 *    responses:
 *      200:
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *                  name:
 *                    type: string
 *                  code:
 *                    type: string
 *                  categoryGroupId:
 *                    type: string
 *                  categoryBrand:
 *                    type: object
 *                    properties:
 *                      productsCount:
 *                        type: number
 *                        description: Number of product in this brand and category
 *                      categoryId:
 *                        type: number
 *                      brandId:
 *                        type: number
 *
 *                example:
 *                  id: 43
 *                  name: Kính Bơi
 *                  code: kinh-boi
 *                  categoryGroupId: 10
 *                  categoryBrand:
 *                      productsCount: 17
 *                      categoryId: 43
 *                      brandId: 8
 *      404:
 *        $ref: '#components/responses/NotFound'
 *
 *      400:
 *        $ref: '#components/responses/BadRequest'
 *
 */

/**
 * @openapi
 * /api/categories/group:
 *  get:
 *    tags: [Category]
 *    summary: Get list of categories group
 *    responses:
 *      200:
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *                  name:
 *                    type: string
 *                  code:
 *                    type: string
 *                  categories:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        $ref: '#components/schema/Category'
 *
 *                example:
 *                  id: 2
 *                  name: Dụng Cụ Tập Gym
 *                  code: dung-cu-tap-gym
 *                  categories:
 *                    - id: 10
 *                      name: Ghế Tập Tạ
 *                      code: ghe-tap-ta
 *                      categoryGroupId: 2
 *
 *
 */
