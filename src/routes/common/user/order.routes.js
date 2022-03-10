const routes = require('express').Router();
const orderController = require('../../../controllers/order.controller');
const validate = require('../../../middlewares/validate');
const orderValidation = require('../../../validations/order.validation');

routes.get(
  '/',
  validate(orderValidation.getOrderGroup),
  orderController.getOrderGroupsByUser
);

routes.post(
  '/',
  validate(orderValidation.createOrder),
  orderController.createOrder
);

routes.put(
  '/:orderGroupId/contact',
  validate(orderValidation.updateOrderGroupContact),
  orderController.updateOrderGroupContactDetail
);

routes.put(
  '/:orderGroupId/cancel',
  validate(orderValidation.cancelOrder),
  orderController.cancelOrder
);
module.exports = routes;

/**
 * @openapi
 * /api/user/order:
 *  get:
 *    tags: [Order]
 *    summary: Get order groups of current user
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: query
 *        name: state
 *        description: Filter by state
 *        schema:
 *          type: string
 *          enum: [new, confirm, shipping, done, canceled]
 *      - in: query
 *        name: page
 *        schema:
 *          type: number
 *          minValue: 1
 *      - in: query
 *        name: limit
 *        schema:
 *          type: number
 *          minValue: 1
 *    responses:
 *      200:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                orderGroups:
 *                  type: array
 *                  items:
 *                    $ref: '#components/schemas/OrderGroup'
 *      400:
 *        description: Invalid field
 *        content:
 *          application/json:
 *            example:
 *              error: "\"title\" is required"
 *      403:
 *        $ref: '#components/responses/Forbidden'
 *      401:
 *        $ref: '#components/responses/Unauthorized'
 *  post:
 *    tags: [Order]
 *    summary: Create order
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - address
 *              - phoneNumber
 *              - products
 *            properties:
 *              address:
 *                type: string
 *              phoneNumber:
 *                type: string
 *              note:
 *                type: string
 *              products:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    productId:
 *                      type: string
 *                    quantity:
 *                      type: string
 *    responses:
 *      200:
 *        description: Create order success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#components/schemas/OrderGroups'
 *      400:
 *        description: Invalid field
 *        content:
 *          application/json:
 *            example:
 *              error: "\"title\" is required"
 *      403:
 *        $ref: '#components/responses/Forbidden'
 *      401:
 *        $ref: '#components/responses/Unauthorized'
 *      404:
 *        description: Product or user not found
 *      409:
 *        description: Product out of stock
 */

/**
 * @openapi
 * /api/user/order/{id}/contact:
 *  put:
 *    tags: [Order]
 *    summary: Update order contact detail (Only available when order's state is new)
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: params
 *        name: orderGroupsId
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - address
 *              - phoneNumber
 *            properties:
 *              address:
 *                type: string
 *              phoneNumber:
 *                type: string
 *    responses:
 *      200:
 *        description: Update order success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#components/schemas/OrderGroups'
 *      400:
 *        description: Invalid field
 *        content:
 *          application/json:
 *            example:
 *              error: "\"title\" is required"
 *      403:
 *        $ref: '#components/responses/Forbidden'
 *      401:
 *        $ref: '#components/responses/Unauthorized'
 *      404:
 *        description: Product or user not found
 *
 */

/**
 * @openapi
 * /api/user/order/{id}/cancel:
 *  put:
 *    tags: [Order]
 *    summary: Cancel order (can only cancel when order's state is new)
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: params
 *        name: orderGroupsId
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - reason
 *            properties:
 *              reason:
 *                type: string
 *                description: reason why user cancel order
 *    responses:
 *      204:
 *        description: cancel order success
 *      400:
 *        description: Invalid field
 *        content:
 *          application/json:
 *            example:
 *              error: "\"title\" is required"
 *      403:
 *        $ref: '#components/responses/Forbidden'
 *      401:
 *        $ref: '#components/responses/Unauthorized'
 *
 */
