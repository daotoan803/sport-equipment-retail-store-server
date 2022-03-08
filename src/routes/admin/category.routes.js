const routes = require('express').Router();
const categoryValidation = require('../../validations/category.validation');
const validate = require('../../middlewares/validate');
const categoryController = require('../../controllers/category.controller');

/**
 * @openapi
 * tags: Admin Category
 * description: Admin functionality with category
 */

/**
 * @openapi
 * /api/admin/categories:
 *  post:
 *    tags: [Admin Category]
 *    summary: Add new category
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - name
 *              - categoryGroupId
 *            properties:
 *              name:
 *                type: string
 *                description: Category's name
 *              categoryGroupId:
 *                type: number
 *                description: Category need to belong to one categoryGroup
 *    responses:
 *      200:
 *        description: Create new category success
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                category:
 *                  $ref: '#components/schemas/Category'
 *      400:
 *        $ref: '#components/responses/BadRequest'
 *      409:
 *        $ref: '#components/responses/Conflict'
 *      401:
 *        $ref: '#components/responses/Unauthorized'
 *      403:
 *        $ref: '#components/responses/Forbidden'
 */
routes.post(
  '/',
  validate(categoryValidation.addCategory),
  categoryController.addCategory
);

/**
 * @openapi
 * /api/admin/categories/{id}:
 *  put:
 *    tags: [Admin Category]
 *    summary: Update category info
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - name
 *              - categoryGroupId
 *            properties:
 *              name:
 *                type: string
 *                description: Category's name
 *              categoryGroupId:
 *                type: number
 *                description: Category need to belong to one categoryGroup
 *    responses:
 *      204:
 *        description: Update category success
 *      400:
 *        $ref: '#components/responses/BadRequest'
 *      409:
 *        $ref: '#components/responses/Conflict'
 *      401:
 *        $ref: '#components/responses/Unauthorized'
 *      403:
 *        $ref: '#components/responses/Forbidden'
 *      404:
 *        $ref: '#components/responses/NotFound'
 *  delete:
 *    tags: [Admin Category]
 *    summary: Delete a category
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      204:
 *        description: Delete category success
 *      409:
 *        $ref: '#components/responses/Conflict'
 *      401:
 *        $ref: '#components/responses/Unauthorized'
 *      403:
 *        $ref: '#components/responses/Forbidden'
 *      404:
 *        $ref: '#components/responses/NotFound'
 */
routes
  .route('/:categoryId')
  .put(
    validate(categoryValidation.addCategory),
    categoryController.updateCategory
  )
  .delete(categoryController.deleteCategory);

/**
 * @openapi
 * tags: Admin Category Group
 * description: Admin functionality with category group
 */

/**
 * @openapi
 * /api/admin/categories/groups:
 *  post:
 *    tags: [Admin Category Group]
 *    summary: Add new category group
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - name
 *            properties:
 *              name:
 *                type: string
 *                description: Category's name
 *    responses:
 *      200:
 *        description: Create new category group success
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                categoryGroup:
 *                  $ref: '#components/schemas/CategoryGroup'
 *      400:
 *        $ref: '#components/responses/BadRequest'
 *      409:
 *        $ref: '#components/responses/Conflict'
 *      401:
 *        $ref: '#components/responses/Unauthorized'
 *      403:
 *        $ref: '#components/responses/Forbidden'
 */
routes.post(
  '/groups',
  validate(categoryValidation.addCategoryGroup),
  categoryController.addCategoryGroup
);

/**
 * @openapi
 * /api/admin/categories/groups/{id}:
 *  put:
 *    tags: [Admin Category Group]
 *    summary: Update category group info
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - name
 *            properties:
 *              name:
 *                type: string
 *                description: Category's name
 *    responses:
 *      204:
 *        description: Update category group success
 *      400:
 *        $ref: '#components/responses/BadRequest'
 *      409:
 *        $ref: '#components/responses/Conflict'
 *      401:
 *        $ref: '#components/responses/Unauthorized'
 *      403:
 *        $ref: '#components/responses/Forbidden'
 *      404:
 *        $ref: '#components/responses/NotFound'
 *  delete:
 *    tags: [Admin Category Group]
 *    summary: Delete a category group
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      204:
 *        description: Delete category group success
 *      409:
 *        $ref: '#components/responses/Conflict'
 *      401:
 *        $ref: '#components/responses/Unauthorized'
 *      403:
 *        $ref: '#components/responses/Forbidden'
 *      404:
 *        $ref: '#components/responses/NotFound'
 */
routes
  .route('/groups/:categoryGroupId')
  .put(
    validate(categoryValidation.addCategoryGroup),
    categoryController.updateCategoryGroup
  )
  .delete(categoryController.deleteCategoryGroup);

module.exports = routes;
