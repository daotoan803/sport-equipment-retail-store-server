const Brand = require('../models/brand.model');
const UploadImagesRequestError = require('../errors/UploadImagesRequestError');
const imageUtils = require('../utils/image.util');

module.exports = {
  async addBrand(req, res, next) {
    const { name } = req.body;
    const logo = req.file;
    try {
      const brand = await Brand.create({
        name,
        logoUrl: logo ? imageUtils.createImageUrl(logo.filename) : null,
      });
      return res.json(brand);
    } catch (e) {
      next(new UploadImagesRequestError());
      next(e);
    }
  },

  async getBrands(req, res) {
    const brands = await Brand.findAll();
    res.json(brands);
  },
};
