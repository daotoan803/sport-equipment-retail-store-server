const Product = require('../models/product.model');
const errorHandler = require('../utils/error-handler');
const { ValidationError } = require('sequelize');

exports.addProduct = async (req, res, next) => {
  const {
    title,
    details,
    price,
    promotionPrice,
    warrantyPeriodByDay,
    availableQuantity,
  } = req.body;

  try {
    const product = await Product.create({
      title,
      details,
      price,
      promotionPrice,
      warrantyPeriodByDay,
      availableQuantity,
    });
    res.json(product);
  } catch (e) {
    console.error(e);
    if (e instanceof ValidationError) {
      return res.status(400).json(errorHandler.parseValidationErrors(e));
    }
    next(e);
  }
};
