const Category = require('../models/category.model');
const Brand = require('../models/brand.model');
const Product = require('../models/product.model');
const UploadImagesRequestError = require('../errors/UploadImagesRequestError');

module.exports = {
  async findBrandAndCategory(req, res, next) {
    const { brandId, categoryId } = req.body;

    try {
      const [brand, category] = await Promise.all([
        Brand.findByPk(brandId),
        Category.findByPk(categoryId),
      ]);

      if (!brand) {
        res.status(400).json({ error: 'Brand not found' });
        return next(new UploadImagesRequestError());
      }
      if (!category) {
        res.status(400).json({ error: 'Category not found' });
        return next(new UploadImagesRequestError());
      }

      req.brand = brand;
      req.category = category;
      next();
    } catch (e) {
      next(new UploadImagesRequestError());
      next(e);
    }
  },

  async getProductById(req, res, next) {
    const { productId } = req.params;
    try {
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      req.product = product;
      next();
    } catch (e) {
      next(e);
    }
  },
};
