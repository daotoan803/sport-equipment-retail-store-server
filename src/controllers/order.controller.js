const httpStatus = require('http-status');
const orderService = require('../services/order.service');
const handleError = require('../utils/handle-error');

const createOrder = handleError(async (req, res) => {
  const { user } = req;
  const orderGroup = await orderService.createOrder(user.id, req.body);
  res.json({ orderGroup });
});

const updateOrderGroupContactDetail = handleError(async (req, res) => {
  const user = req.user;
  const orderGroup = await orderService.updateOrderGroupContact(
    req.params.orderGroupId,
    user.id,
    req.body
  );

  res.json({ orderGroup });
});

const updateOrderGroupState = handleError(async (req, res) => {
  await orderService.updateOrderGroupState(req.params.orderGroupId, req.body);
  res.sendStatus(httpStatus.NO_CONTENT);
});

const cancelOrder = handleError(async (req, res) => {
  const user = req.user;
  await orderService.cancelOrder(req.params.orderGroupId, user.id, req.body);
  res.sendStatus(httpStatus.NO_CONTENT);
});

const getOrderGroups = handleError(async (req, res) => {
  const orderGroups = await orderService.getOrderGroups(req.query);
  res.json({ orderGroups });
});

const getOrderGroupsByUser = handleError(async (req, res) => {
  const user = req.user;
  const orderGroups = await orderService.getOrderGroupsByUser(
    user.id,
    req.query
  );
  res.json({ orderGroups });
});

module.exports = {
  createOrder,
  updateOrderGroupContactDetail,
  updateOrderGroupState,
  getOrderGroups,
  getOrderGroupsByUser,
  cancelOrder,
};
