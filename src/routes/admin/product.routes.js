const routes = require('express').Router();
const productController = require('../../controllers/product.controller');
const validate = require('../../middlewares/validate');
const productValidation = require('../../validations/product.validation');
const upload = require('../../middlewares/upload');

routes.post(
  '/',
  upload.handleMixedImageUpload([
    { name: 'images' },
    { name: 'mainImage', maxCount: 1 },
  ]),
  validate(productValidation.addProduct),
  productController.addProduct
);

routes.post(
  '/check-title',
  validate(productValidation.checkProductTitleIsUnique),
  productController.checkProductTitleIsUnique
);

routes.put(
  '/:productId',
  upload.handleMixedImageUpload([
    { name: 'images' },
    { name: 'mainImage', maxCount: 1 },
  ]),
  validate(productValidation.updateProduct),
  productController.updateProduct
);

module.exports = routes;

/**
 * @openapi
 * tags: Admin Product
 * description: Admin functionality with product
 */

/**
 * @openapi
 * /api/admin/products:
 *  post:
 *    tags: [Admin Product]
 *    summary: Add new product
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            required:
 *              - title
 *              - detail
 *              - price
 *              - discountPrice
 *              - warrantyPeriodByDay
 *              - availableQuantity
 *              - state
 *              - brandId
 *              - categoryId
 *              - mainImage
 *            properties:
 *              title:
 *                type: string
 *                minLength: 4
 *                maxLength: 101
 *              detail:
 *                type: string
 *                minLength: 1
 *              price:
 *                type: number
 *                minimum: 0
 *              discountPrice:
 *                type: number
 *                minimum: 0
 *                maximum: price
 *              warrantyPeriodByDay:
 *                type: number
 *                minimum: 0
 *              availableQuantity:
 *                type: number
 *                minimum: 0
 *              state:
 *                type: string
 *                description: available value [available, outstock, hidden]
 *              brandId:
 *                type: number
 *              categoryId:
 *                type: number
 *              mainImage:
 *                type: string
 *                format: byte
 *              images:
 *                type: array
 *                items:
 *                  type: string
 *                  format: byte
 *                  description: Product's preview images
 *    responses:
 *      200:
 *        description: Created success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#components/schemas/Product'
 *      400:
 *        description: Invalid field
 *        content:
 *          application/json:
 *            example:
 *              error: "\"title\" is required"
 *      409:
 *        description: Title already exists
 *      403:
 *        $ref: '#components/responses/Forbidden'
 *      401:
 *        $ref: '#components/responses/Unauthorized'
 */

/**
 * @openapi
 * /api/admin/products/check-title:
 *  post:
 *    tags: [Admin Product]
 *    summary: Check if product's title have been taken
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - title
 *            properties:
 *              title:
 *                type: string
 *                minLength: 4
 *                maxLength: 101
 *    responses:
 *      204:
 *        description: Title is ok to use
 *      400:
 *        $ref: "#components/responses/BadRequest"
 *      409:
 *        $ref: "#components/responses/Conflict"
 *      403:
 *        $ref: '#components/responses/Forbidden'
 *      401:
 *        $ref: '#components/responses/Unauthorized'
 */

/**
 * @openapi
 * /api/admin/products/{id}:
 *  put:
 *    tags: [Admin Product]
 *    summary: Update product
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            required:
 *              - title
 *              - detail
 *              - price
 *              - warrantyPeriodByDay
 *              - availableQuantity
 *              - state
 *              - brandId
 *              - categoryId
 *            properties:
 *              title:
 *                type: string
 *                minLength: 4
 *                maxLength: 101
 *              detail:
 *                type: string
 *                minLength: 1
 *              price:
 *                type: number
 *                minimum: 0
 *              discountPrice:
 *                type: number
 *                minimum: 0
 *                maximum: price
 *              warrantyPeriodByDay:
 *                type: number
 *                minimum: 0
 *              availableQuantity:
 *                type: number
 *                minimum: 0
 *              state:
 *                type: string
 *                description: available value [available, outstock, hidden]
 *              brandId:
 *                type: number
 *              categoryId:
 *                type: number
 *              removeImageIds:
 *                type: array
 *                description: List of productImage's id need to be remove
 *                items:
 *                  type: number
 *              mainImage:
 *                type: string
 *                format: byte
 *                description: New product main image
 *              images:
 *                type: array
 *                description: Array of new product images
 *                items:
 *                  type: string
 *                  format: byte
 *                  description: Product's preview images
 *    responses:
 *      204:
 *        description: Update success
 *      400:
 *        description: Invalid field
 *        content:
 *          application/json:
 *            example:
 *              error: "\"title\" is required"
 *      409:
 *        description: Title already exists
 *      403:
 *        $ref: '#components/responses/Forbidden'
 *      401:
 *        $ref: '#components/responses/Unauthorized'
 *      404:
 *        $ref: '#components/responses/NotFound'
 *
 */
