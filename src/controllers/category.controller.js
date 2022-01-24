const Category = require('../models/category.model');
const UploadImagesRequestError = require('../errors/UploadImagesRequestError');
const imageUtils = require('../utils/image.util');

module.exports = {
  async addCategory(req, res, next) {
    const { name } = req.body;
    const logo = req.file;

    try {
      const category = await Category.create({
        name,
        logoUrl: logo ? imageUtils.createImageUrl(logo.filename) : null,
      });
      res.json(category);
    } catch (e) {
      next(new UploadImagesRequestError());
      next(e);
    }
  },

  async getCategories(req, res) {
    const categories = await Category.findAll();
    res.json(categories);
  },
};
