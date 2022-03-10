const routes = require('express').Router();
const validate = require('../../middlewares/validate');
const brandValidation = require('../../validations/brand.validation');
const brandController = require('../../controllers/brand.controller');

routes.post('/', validate(brandValidation.addBrand), brandController.addBrand);

routes
  .route('/:brandId')
  .put(validate(brandValidation.updateBrand), brandController.updateBrand)
  .delete(brandController.deleteBrand);

module.exports = routes;

/**
 * @openapi
 * tags: Admin Brand
 * description: Admin functionality with brand
 */

/**
 * @openapi
 * /api/admin/brands:
 *  post:
 *    tags: [Admin Brand]
 *    summary: Create new brand
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
 *                minLength: 1
 *                maxLength: 254
 *                description: Brand's name, need to be unique
 *    responses:
 *      200:
 *        description: Brand created success
 *        content:
 *          application/json:
 *            type: object
 *            properties:
 *              brand:
 *                $ref: '#components/schemas/Brand'
 *      400:
 *        $ref: '#components/responses/BadRequest'
 *      409:
 *        $ref: '#components/responses/Conflict'
 *      401:
 *        $ref: '#components/responses/Unauthorized'
 *      403:
 *        $ref: '#components/responses/Forbidden'
 */

/**
 * @openapi
 * /api/admin/brands/{id}:
 *  put:
 *    tags: [Admin Brand]
 *    summary: update brand
 *    security:
 *      - bearerAuth: []
 *
 *    parameters:
 *      - in: params
 *        name: brandId
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
 *                minLength: 1
 *                maxLength: 254
 *                description: brand's name, need to be unique
 *    responses:
 *      204:
 *        description: Update brand success
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
 *    tags: [Admin Brand]
 *    summary: Delete a brand
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: params
 *        name: brandId
 *        description: Id of brand need to be delete
 *    responses:
 *      204:
 *        description: Delete brand success
 *      400:
 *        $ref: '#components/responses/BadRequest'
 *      409:
 *        description: Can't delete brand because some product is belong to this brand. User need to change product brand first
 *      401:
 *        $ref: '#components/responses/Unauthorized'
 *      403:
 *        $ref: '#components/responses/Forbidden'
 *      404:
 *        $ref: '#components/responses/NotFound'
 *
 */
