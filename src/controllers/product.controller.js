const Product = require('../models/product.model');
const Brand = require('../models/brand.model');
const Category = require('../models/category.model');
const ProductImage = require('../models/product-image.model');
const sequelizeConnection = require('../models/config/db');
const UploadImagesRequestError = require('../errors/UploadImagesRequestError');
const imageUtils = require('../utils/image.util');

const convertUploadedImageToProductImage = (uploadImages) => {
  return uploadImages.map((image) => ({
    url: imageUtils.createImageUrl(image.filename),
  }));
};

module.exports = {
  responseIsTitleUnique(req, res) {
    //product title already check in middlewares, if request come here mean title is valid
    res.sendStatus(200);
  },

  async responseProductDetail(req, res, next) {
    const product = req.product;

    try {
      const [brand, categories, productImages] = await Promise.all([
        product.getBrand(),
        product.getCategories(),
        product.getProductImages(),
      ]);

      res.json({
        ...product.dataValues,
        brand,
        categories,
        productImages,
      });
    } catch (e) {
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

  async getAllProductsPreview(req, res, next) {
    try {
      const products = await Product.findAll();
      return res.json(products);
    } catch (error) {
      next(error);
    }
  },

  async findBrandAndCategories(req, res, next) {
    const { brandId, categories: categoryIdList } = req.body;

    try {
      const [brand, categories] = await Promise.all([
        Brand.findByPk(brandId),
        Category.findAll({
          where: {
            id: categoryIdList,
          },
        }),
      ]);

      if (!brand) {
        res.status(400).json({ error: 'Brand not found' });
        return next(new UploadImagesRequestError());
      }
      if (categories.length === 0) {
        res.status(400).json({ error: 'Category not found' });
        return next(new UploadImagesRequestError());
      }

      req.brand = brand;
      req.categories = categories;
      next();
    } catch (e) {
      req.transaction?.rollback();
      next(new UploadImagesRequestError());
      next(e);
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
    } = req.body;

    const { brand, categories } = req;

    const images = convertUploadedImageToProductImage(req.files);

    const transaction = await sequelizeConnection.transaction();

    try {
      const product = await Product.create(
        {
          title,
          detail,
          price,
          discountPrice,
          warrantyPeriodByDay,
          availableQuantity,
          state,
          brandId: brand.id,
          productImages: images,
        },
        { transaction, include: [ProductImage] }
      );

      await Promise.all([
        product.setCategories(categories, { transaction }),
        product.setBrand(brand, { transaction }),
      ]);
      await transaction.commit();

      res.json({
        ...product.dataValues,
        brand: brand,
        categories: categories,
        productImages: product.productImages,
      });
    } catch (e) {
      transaction.rollback();
      next(e);
      next(new UploadImagesRequestError());
    }
  },

  async addProductImages(req, res, next) {
    const product = req.product;
    const images = convertUploadedImageToProductImage(req.files);

    try {
      await Promise.all(
        images.map((image) => product.createProductImage(image))
      );
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  },
};
