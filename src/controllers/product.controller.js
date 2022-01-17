const Product = require('../models/product.model');
const Brand = require('../models/brand.model');
const Category = require('../models/category.model');
const fs = require('fs');
const projectPath = require('../utils/project-path');
const path = require('path');
const ProductImages = require('../models/product-image.model');
const { Transaction } = require('sequelize');

module.exports = {
  async addProduct(req, res, next) {
    const {
      title,
      detail,
      price,
      discountPrice,
      warrantyPeriodByDay,
      availableQuantity,
      state,
      brandId,
      categories: categoryIdList,
    } = req.body;

    const transaction = new Transaction();

    try {
      const isTitleExists = await Product.isTitleExists(title);
      if (isTitleExists) {
        return res.status(400).json({
          title:
            'Product title must be unique, another product already use that title',
        });
      }
      const [brand, categoryList] = await Promise.all([
        Brand.findByPk(brandId),
        Category.findAllWherePk(categoryIdList),
      ]);

      if (!brand) return res.status(400).json({ error: 'Brand not found' });
      if (categoryList.length === 0)
        return res.status(400).json({ error: 'Category not found' });

      const product = await Product.create(
        {
          title,
          detail,
          price,
          discountPrice,
          warrantyPeriodByDay,
          availableQuantity,
          state,
        },
        { transaction }
      );

      await Promise.all([
        product.setBrand(brand, { transaction }),
        product.setCategories(categoryList, { transaction }),
      ]);
      await transaction.commit();
      return res.json({ id: product.id });
    } catch (e) {
      transaction.rollback();
      next(e);
    }
  },

  async addProductImages(req, res, next) {
    const images = req.files;
    const { productId } = req.body;

    const transaction = new Transaction();
    try {
      const product = await Product.findByPk(productId);
      if (!product) return res.status(404).json({ error: 'Product not found' });

      const imagesList = await ProductImages.bulkCreate(
        images.map((image) => ({ url: `/images/${image.filename}` })),
        { transaction }
      );
      await product.setProductImages(imagesList, { transaction });

      await transaction.commit();
      res.json(images);
    } catch (e) {
      transaction.rollback();
      images.forEach((image) => {
        fs.rm(path.join(projectPath.uploadedImageDirPath, image.filename));
      });
      next(e);
    }
  },
};
