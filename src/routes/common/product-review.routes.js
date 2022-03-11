const routes = require('express').Router();
const authentication = require('../../middlewares/authentication');
const validate = require('../../middlewares/validate');
const productReviewValidation = require('../../validations/product-review.validation');
const productReviewController = require('../../controllers/product-review.controller');

/*-------------------------------------------------*/
/*--------------------/api/products/:productId/review-----------------------*/
/*-------------------------------------------------*/

routes.get(
  '/:productId/review',
  validate(productReviewValidation.getProductReviews),
  productReviewController.getProductReviews
);

routes.use('/', authentication.verifyToken);
routes.post(
  '/:productId/review',
  validate(productReviewValidation.addReview),
  productReviewController.addReview
);

routes
  .route('/:productId/review/:reviewId')
  .put(
    validate(productReviewValidation.addReview),
    productReviewController.editReview
  )
  .delete(productReviewController.deleteReview);

module.exports = routes;

/**
 * @openapi
 *  /api/products/{productId}/review:
 *    get:
 *      tags: [Product review]
 *      summary: Get product's review by product id
 *      parameters:
 *        - in: path
 *          name: productId
 *        - in: query
 *          name: point
 *          type: number
 *          description: filter by point
 *        - in: query
 *          name: page
 *          type: number
 *        - in: query
 *          name: limit
 *          type: number
 *      responses:
 *        200:
 *          description: Get product's reviews success
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  reviews:
 *                    type: array
 *                    items:
 *                      $ref: "#components/schemas/ProductReview"
 *        400:
 *          $ref: "#components/responses/BadRequest"
 *        404:
 *          $ref: "#components/responses/NotFound"
 *    post:
 *      tags: [Product review]
 *      summary: Create product's review by product id
 *      parameters:
 *        - in: path
 *          name: productId
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *           schema:
 *            type: object
 *            required:
 *              - point
 *              - review
 *            properties:
 *              point:
 *                type: number
 *                minValue: 1
 *                maxValue: 5
 *              review:
 *                type: string
 *      responses:
 *        200:
 *          description: Create product's review success
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  review:
 *                    $ref: "#components/schemas/ProductReview"
 *        400:
 *          $ref: "#components/responses/BadRequest"
 *        403:
 *          $ref: '#components/responses/Forbidden'
 *        401:
 *          $ref: '#components/responses/Unauthorized'
 */

/**
 * @openapi
 * /api/products/{productId}/review/${reviewId}:
 *  put:
 *    tags: [Product review]
 *    summary: Edit product's review by product id
 *    parameters:
 *      - in: path
 *        name: productId
 *      - in: path
 *        name: reviewId
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *         schema:
 *          type: object
 *          required:
 *            - point
 *            - review
 *          properties:
 *            point:
 *              type: number
 *              minValue: 1
 *              maxValue: 5
 *            review:
 *              type: string
 *    responses:
 *      200:
 *        description: Update product's review success
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                review:
 *                  $ref: "#components/schemas/ProductReview"
 *      400:
 *        $ref: "#components/responses/BadRequest"
 *      403:
 *        $ref: '#components/responses/Forbidden'
 *      401:
 *        $ref: '#components/responses/Unauthorized'
 *  delete:
 *    tags: [Product Review]
 *    summary: Edit product's review by product id
 *    parameters:
 *      - in: path
 *        name: productId
 *      - in: path
 *        name: reviewId
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      204:
 *        description: Delete product's review success
 *      400:
 *        $ref: "#components/responses/BadRequest"
 *      403:
 *        $ref: '#components/responses/Forbidden'
 *      401:
 *        $ref: '#components/responses/Unauthorized'
 */
