const Joi = require('joi');
const Brand = require('../../models/brand.model');
const { responseValidationError } = require('../../utils/validator.util');
const UploadImagesRequestError = require('../../errors/UploadImagesRequestError');

module.exports = {
  validateBrandData(req, res, next) {
    const brandSchema = Joi.object({
      name: Joi.string().min(1).max(254).required(),
    });

    const { name } = req.body;

    const validateResult = brandSchema.validate({ name });

    if (validateResult.error) {
      next(new UploadImagesRequestError());
      return responseValidationError(res, validateResult.error);
    }

    next();
  },

  async checkIfBrandNameExists(req, res, next) {
    const { name } = req.body;

    try {
      const existsBrand = await Brand.isNameAlreadyExists(name);

      if (existsBrand) {
        next(new UploadImagesRequestError());
        return res.status(409).json({ error: 'Brand name already exists' });
      }

      next();
    } catch (e) {
      next(new UploadImagesRequestError());
      next(e);
    }
  },
};
