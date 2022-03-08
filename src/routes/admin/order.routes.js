const routes = require('express').Router();
const orderController = require('../../controllers/order.controller');
const validate = require('../../middlewares/validate');
const orderValidation = require('../../validations/order.validation');

/**
 * @openapi
 * tags: Admin order
 */

/**
 * @openapi
 * /api/admin/orders:
 *  get:
 *    tags: [Admin order]
 *    summary: Get orders list
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
 *              properties
 *                
 */
routes.get(
  '/',
  validate(orderValidation.getOrderGroup),
  orderController.getOrderGroups
);

routes.put(
  '/:orderGroupId/contact',
  validate(orderValidation.updateOrderGroupContact),
  orderController.updateOrderGroupContactDetail
);

routes.put(
  '/:orderGroupId/state',
  validate(orderValidation.updateOrderGroupState),
  orderController.updateOrderGroupState
);

routes.put(
  '/:orderGroupId/cancel',
  validate(orderValidation.cancelOrder),
  orderController.cancelOrder
);

module.exports = routes;
