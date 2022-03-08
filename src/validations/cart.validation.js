const Joi = require('joi');

const addProductToCart = {
  body: Joi.object({
    productId: Joi.string().required(),
    quantity: Joi.number().min(1),
  }),
};

const updateQuantity = {
  body: Joi.object({
    productId: Joi.string().required(),
    quantity: Joi.number().min(0).required(),
  }),
};

module.exports = {
  addProductToCart,
  updateQuantity,
};
