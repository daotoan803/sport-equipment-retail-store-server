const Joi = require('joi');
const Product = require('../../models/product.model');

const { responseValidationError } = require('../../utils/validator.util');

module.exports = {
  validateAddProductData(req, res, next) {
    // prettier-ignore
    const productDetailSchema = Joi.object({
      title: Joi.string()
        .min(4)
        .max(100)
        .required(),
      price: Joi.number()
        .min(0)
        .required(),
      discountPrice: Joi.number()
        .min(0)
        .max(Joi.ref('price')),
      warrantyPeriodByDay: Joi.number()
        .min(0)
        .required(),
      availableQuantity: Joi.number()
        .min(0),
      state: Joi.string()
        .equal(...Object.values(Product.state))
    });

    const {
      title,
      price,
      discountPrice,
      warrantyPeriodByDay,
      availableQuantity,
      state,
    } = req.body;

    const result = productDetailSchema.validate({
      title: title.trim(),
      price: Number(price),
      discountPrice: Number(discountPrice),
      warrantyPeriodByDay: Number(warrantyPeriodByDay),
      availableQuantity: Number(availableQuantity),
      state,
    });

    if (result.error) {
      return responseValidationError(res, result.error);
    }

    next();
  },

  async checkIfProductTitleAlreadyExists(req, res, next) {
    const { title } = req.body;

    if (!title || title.trim().length === 0)
      return res.status(400).json({ error: 'title is required' });

    try {
      const isExists = await Product.isTitleExists(title);
      if (!isExists) return next();
      return res.status(409).json({ error: 'title already exists' });
    } catch (err) {
      next(err);
    }
  },
};
