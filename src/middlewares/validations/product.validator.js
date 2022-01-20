const Joi = require('joi');
const Product = require('../../models/product.model');
const uploadUtils = require('../../utils/upload.utils');

const { responseValidationError } = require('../../utils/validator.util');

module.exports = {
  validateAddProductData(req, res, next) {
    // prettier-ignore
    const productDetailSchema = Joi.object({
      title: Joi.string()
        .min(4)
        .max(100)
        .required(),
      detail: Joi.string()
        .min(1)
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
        .equal(...Object.values(Product.state)),
      brandId: Joi.string()
        .required(),
      categories: Joi.array().required(),
    });

    const {
      title,
      price,
      detail,
      discountPrice,
      warrantyPeriodByDay,
      availableQuantity,
      state,
      brandId,
      categories,
    } = req.body;

    const result = productDetailSchema.validate({
      title: title.trim(),
      detail,
      price: Number(price),
      discountPrice: Number(discountPrice),
      warrantyPeriodByDay: Number(warrantyPeriodByDay),
      availableQuantity: Number(availableQuantity),
      state,
      brandId,
      categories,
    });

    if (result.error) {
      uploadUtils.deleteUploadedImages(req.files);
      return responseValidationError(res, result.error);
    }

    next();
  },

  async checkIfProductTitleAlreadyExists(req, res, next) {
    const { title } = req.body;

    if (!title || title.trim().length === 0) {
      uploadUtils.deleteUploadedImages(req.files);
      return res.status(400).json({ error: 'title is required' });
    }

    try {
      const titleIsAlreadyExists = await Product.isTitleExists(title);
      if (titleIsAlreadyExists) {
        uploadUtils.deleteUploadedImages(req.files);
        return res.status(409).json({ error: 'title already exists' });
      }
      return next();
    } catch (err) {
      next(err);
    }
  },
};
