const Joi = require('joi');
const Category = require('../../models/category.model');
const { responseValidationError } = require('../../utils/validator.util');
const UploadImagesRequestError = require('../../errors/UploadImagesRequestError');

module.exports = {
  validateCategoryData(req, res, next) {
    const categorySchema = Joi.object({
      name: Joi.string().min(1).max(254).required(),
    });

    const { name } = req.body;

    const validateResult = categorySchema.validate({ name });

    if (validateResult.error) {
      next(new UploadImagesRequestError());
      return responseValidationError(res, validateResult.error);
    }

    next();
  },

  async checkIfCategoryNameExists(req, res, next) {
    const { name } = req.body;

    try {
      const existsCategory = await Category.isNameAlreadyExists(name);

      if (existsCategory) {
        next(new UploadImagesRequestError());
        return res.status(409).json({ error: 'Category name already exists' });
      }

      next();
    } catch (e) {
      next(new UploadImagesRequestError());
      next(e);
    }
  },
};
