const routes = require('express').Router();
const productReviewRoutes = require('./product-review.routes');

const validate = require('../../middlewares/validate');
const productValidation = require('../../validations/product.validation');

const productController = require('../../controllers/product.controller');

routes.get(
  '/',
  validate(productValidation.getProducts),
  productController.getProducts
);
routes.get(
  '/:productId',
  validate(productValidation.getProductDetail),
  productController.getProduct
);

routes.use('/', productReviewRoutes);

module.exports = routes;

/**
 * @openapi
 * tags:
 *  name: Product
 *  description: Common products functionality
 */

/**
 * @openapi
 * /api/products:
 *  get:
 *    summary: Get products
 *    tags: [Product]
 *    parameters:
 *      - in: query
 *        name: page
 *        schema:
 *           type: number
 *           minValue: 1
 *      - in: query
 *        name: limit
 *        schema:
 *          type: number
 *          minValue: 0
 *      - in: query
 *        name: sortBy
 *        schema:
 *          type: string
 *          enum: [name, priceAsc, priceDesc, mostVisited, mostSold]
 *      - in: query
 *        name: brandId
 *        schema:
 *          type: number
 *      - in: query
 *        name: categoryCode
 *        schema:
 *          type: string
 *      - in: query
 *        name: categoryGroupCode
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                count:
 *                  type: number
 *                  description: Total products
 *                rows:
 *                  type: array
 *                  items:
 *                    $ref: '#components/schemas/ProductPreview'
 *      404:
 *        description: Category code or categoryGroupCode or brandId not exists
 *      400:
 *        description: Invalid query
 * /api/products/{id}:
 *  get:
 *    tags: [Product]
 *    summary: Get product detail
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *          required: true
 *        description: Product's id
 *    responses:
 *      200:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                product:
 *                  $ref: '#components/schemas/Product'
 *                brand:
 *                  $ref: '#components/schemas/Brand'
 *                category:
 *                  $ref: '#components/schemas/Category'
 *      400:
 *        $ref: '#components/responses/NotFound'
 */
