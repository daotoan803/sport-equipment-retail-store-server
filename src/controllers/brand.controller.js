const Brand = require('../models/brand.model');
const uploadUtils = require('../utils/upload.utils');
const UploadImagesRequestError = require('../errors/UploadImagesRequestError');

module.exports = {
  async addBrand(req, res, next) {
    const { name } = req.body;
    const logo = req.file;
    try {
      const brand = await Brand.create({
        name,
        logoUrl: logo ? `/images/${logo.filename}` : null,
      });
      return res.json(brand);
    } catch (e) {
      uploadUtils.deleteUploadedImages(logo);
      next(new UploadImagesRequestError());
      next(e);
    }
  },

  async getBrands(req, res) {
    const brands = await Brand.findAll();
    res.json(brands);
  },
};
