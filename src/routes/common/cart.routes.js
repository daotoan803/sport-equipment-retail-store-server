const routes = require('express').Router();
const cartController = require('../../controllers/cart.controller');
const validate = require('../../middlewares/validate');
const cartValidation = require('../../validations/cart.validation');

routes
  .route('/cart')
  .get(cartController.getProductsInCart)
  .post(
    validate(cartValidation.addProductToCart),
    cartController.addProductToCartOrUpdateQuantity
  )
  .put(
    validate(cartValidation.updateQuantity),
    cartController.updateProductInCartQuantity
  );

module.exports = routes;

/**
 * @openapi
 * tags: Cart
 */

/**
 * @openapi
 * /api/users/cart:
 *  get:
 *    tags: [User Cart]
 *    summary: Get user cart
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: User's cart
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                cart:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: string
 *                      title:
 *                        type: string
 *                      price:
 *                        type: number
 *                      discountPrice:
 *                        type: number
 *                      state:
 *                        type: string
 *                        enum: [available, outstock, hidden]
 *                      mainImageUrl:
 *                        type: string
 *                      quantity:
 *                        type: number
 *      403:
 *        $ref: '#components/responses/Forbidden'
 *      401:
 *        $ref: '#components/responses/Unauthorized'
 *
 *  post:
 *    tags: [User Cart]
 *    summary: Add product to user cart, if that product already in user cart, this will increase the quantity
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - productId
 *            properties:
 *              productId:
 *                type: string | number
 *                description: id of product
 *              quantity:
 *                type: number
 *                description: quantity of product need to put in cart
 *    responses:
 *      201:
 *        description: Add product to cart success
 *      400:
 *        $ref: '#components/responses/BadRequest'
 *      403:
 *        $ref: '#components/responses/Forbidden'
 *      401:
 *        $ref: '#components/responses/Unauthorized'
 *      404:
 *        description: Product id not exists
 *        $ref: '#components/responses/NotFound'
 *
 *  put:
 *    tags: [User Cart]
 *    summary: Update product quantity in cart, delete if quantity = 0
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - productId
 *              - quantity
 *            properties:
 *              productId:
 *                type: string
 *                description: id of product
 *              quantity:
 *                type: number
 *                description: quantity of product need to put in cart
 *    responses:
 *      204:
 *        description: Update product quantity success
 *      400:
 *        $ref: '#components/responses/BadRequest'
 *      403:
 *        $ref: '#components/responses/Forbidden'
 *      401:
 *        $ref: '#components/responses/Unauthorized'
 *      404:
 *        description: Product id not exists
 *        $ref: '#components/responses/NotFound'
 */
