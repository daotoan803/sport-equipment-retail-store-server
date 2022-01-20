const Product = require('../models/product.model');
const Brand = require('../models/brand.model');
const Category = require('../models/category.model');
const ProductImages = require('../models/product-image.model');
const sequelizeConnection = require('../models/config/db');
const uploadUtils = require('../utils/upload.utils');

module.exports = {
  responseIsTitleUnique(req, res) {
    //product title already check in middlewares, if request come here mean title is valid
    res.sendStatus(200);
  },

  responseProductDetail(req, res) {
    res.json(req.product);
  },

  async getProductDetailById(req, res, next) {
    const { productId } = req.params;
    try {
      const product = await Product.findByPk(productId, {
        include: [Brand, Category, ProductImages],
      });

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      req.product = product;
      next();
    } catch (e) {
      next(e);
    }
  },

  async getAllProductsPreview(req, res, next) {
    try {
      const products = await Product.findAll();
      return res.json(products);
    } catch (error) {
      next(error);
    }
  },

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
        Category.findAll({
          where: {
            id: categoryIdList,
          },
        }),
      ]);

      if (!brand) {
        uploadUtils.deleteUploadedImages(req.files);
        return res.status(400).json({ error: 'Brand not found' });
      }
      if (categoryList.length === 0) {
        uploadUtils.deleteUploadedImages(req.files);
        return res.status(400).json({ error: 'Category not found' });
      }

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

      product.brand = brand;
      product.categories = categoryList;

      req.transaction = transaction;
      req.product = product;
      return next();
    } catch (e) {
      transaction.rollback();
      uploadUtils.deleteUploadedImages(req.files);
      next(e);
    }
  },

  async createProductImages(req, res, next) {
    const uploadedImages = req.files;
    if (!uploadedImages)
      return res.status(400).json({ error: 'Must have at least 1 image' });

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
      uploadUtils.deleteUploadedImages(req.files);
      next(e);
    }
  },

  async setImagesToProduct(req, res, next) {
    const { transaction, product, productImages } = req;

    try {
      await product.setProductImages(productImages, { transaction });
      await transaction.commit();
      product.productImages = productImages;
      res.json(product);
    } catch (e) {
      transaction.rollback();
      uploadUtils.deleteUploadedImages(req.files);
      next(e);
    }
  },
};
