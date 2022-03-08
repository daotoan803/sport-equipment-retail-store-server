const Joi = require('joi');
const OrderGroup = require('../models/order-group.model');

const createOrder = {
  body: Joi.object({
    address: Joi.string().min(1).required(),
    phoneNumber: Joi.string().min(10).required(),
    note: Joi.string(),
    products: Joi.array().items(
      Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
      })
    ),
  }),
};

const updateOrderGroupContact = {
  body: Joi.object({
    address: Joi.string().min(1).required(),
    phoneNumber: Joi.string().min(10).required(),
  }),
};

const updateOrderGroupState = {
  body: Joi.object({
    state: Joi.string()
      .equal(
        ...(() => {
          const option = { ...OrderGroup.state };
          delete option.canceled;
          return Object.values(option);
        })()
      )
      .required(),
  }),
};

const cancelOrder = {
  body: Joi.object({
    reason: Joi.string().required(),
  }),
};

const getOrderGroup = {
  query: Joi.object({
    state: Joi.string().equal(...Object.values(OrderGroup.state)),
    page: Joi.number().min(1),
    limit: Joi.number().min(1),
  }),
};

module.exports = {
  createOrder,
  updateOrderGroupContact,
  updateOrderGroupState,
  getOrderGroup,
  cancelOrder,
};
