const Product = require('../models/product.model');
const Brand = require('../models/brand.model');
const Category = require('../models/category.model');
const fs = require('fs');
const projectPath = require('../utils/project-path');
const path = require('path');
const ProductImages = require('../models/product-image.model');
const sequelizeConnection = require('../models/config/db');

const deleteUploadedImages = (request) => {
  const uploadedImages = request.files;
  uploadedImages.forEach((image) => {
    fs.rm(path.join(projectPath.uploadedImageDirPath, image.filename));
  });
};

module.exports = {
  responseIsTitleUnique(req, res) {
    //product title already check in middlewares, if request come here mean title is valid
    res.sendStatus(200);
  },

  responseProductDetail(req, res) {
    res.json(req.product);
  },

  async findProduct(req, res, next) {
    const { productId } = req.params;
    console.log(productId);
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

  async getAllProductsPreview(req, res, next) {},

  async createProduct(req, res, next) {
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

    const transaction = await sequelizeConnection.transaction();

    try {
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
      req.transaction = transaction;
      req.product = product;
      next();
    } catch (e) {
      transaction.rollback();
      next(e);
    }
  },

  async createProductImages(req, res, next) {
    const uploadedImages = req.files;

    const transaction =
      req.transaction || (await sequelizeConnection.transaction());

    try {
      const images = uploadedImages.map((image) => ({
        url: `/images/${image.filename}`,
      }));

      const productImages = await ProductImages.bulkCreate(images, {
        transaction,
      });

      req.transaction = transaction;
      req.productImages = productImages;
      next();
    } catch (e) {
      transaction.rollback();
      deleteUploadedImages(req);
      next(e);
    }
  },

  async setImagesToProduct(req, res, next) {
    const { transaction, product, productImages } = req;

    try {
      await product.setProductImages(productImages, { transaction });
      await transaction.commit();
      res.json(product);
    } catch (e) {
      transaction.rollback();
      deleteUploadedImages(req);
      next(e);
    }
  },
};
