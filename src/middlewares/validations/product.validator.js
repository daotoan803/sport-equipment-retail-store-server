const Joi = require('joi');
const UploadImagesRequestError = require('../../errors/UploadImagesRequestError');
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
      images: Joi.array()
        .min(1)
        .required()
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
    const images = req.files;

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
      images,
    });

    if (result.error) {
      next(new UploadImagesRequestError());
      return responseValidationError(res, result.error);
    }

    next();
  },

  async checkIfProductTitleAlreadyExists(req, res, next) {
    const { title } = req.body;

    if (!title || title.trim().length === 0) {
      next(new UploadImagesRequestError());
      return res.status(400).json({ error: 'title is required' });
    }

    try {
      const titleIsAlreadyExists = await Product.isTitleExists(title);
      if (titleIsAlreadyExists) {
        next(new UploadImagesRequestError());
        return res.status(409).json({ error: 'title already exists' });
      }
      return next();
    } catch (err) {
      next(new UploadImagesRequestError());
      next(err);
    }
  },
};
