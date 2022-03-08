const routes = require('express').Router();
const orderController = require('../../controllers/order.controller');
const validate = require('../../middlewares/validate');
const orderValidation = require('../../validations/order.validation');

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
