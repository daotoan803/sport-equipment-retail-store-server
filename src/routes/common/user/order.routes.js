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
