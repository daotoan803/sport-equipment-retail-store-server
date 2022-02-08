const Product = require('../models/product.model');
const Brand = require('../models/brand.model');
const Category = require('../models/category.model');
const ProductImage = require('../models/product-image.model');
const sequelizeConnection = require('../models/config/db');
const UploadImagesRequestError = require('../errors/UploadImagesRequestError');
const imageUtils = require('../utils/image.util');
const CategoryGroup = require('../models/category-group.model');

const convertUploadedImageToProductImage = (uploadImages) => {
  return uploadImages.map((image) => ({
    url: imageUtils.createImageUrl(image.filename),
  }));
};

const productPreviewAttributes = [
  'id',
  'title',
  'price',
  'discountPrice',
  'state',
  'mainImageUrl',
];

module.exports = {
  async getProductsByCategoryGroup(req, res, next) {
    const { categoryGroupId } = req.params;
    console.log(categoryGroupId);
    let { page, limit } = req.query;
    page = Number(page);
    limit = Number(limit);
    try {
      let limitOption = {};

      if (page >= 1 && limit >= 0) {
        limitOption = {
          offset: (page - 1) * limit,
          limit: limit,
        };
      }

      const categoryGroup = await CategoryGroup.findByPk(categoryGroupId, {
        include: Category,
      });
      const categoryIdList = categoryGroup.categories.map(
        (category) => category.id
      );
      const products = await Product.findAndCountAll({
        attributes: productPreviewAttributes,
        where: { categoryId: categoryIdList },
        ...limitOption,
      });

      const maxPage = limit ? Math.ceil(products.count / limit) : 1;
      return res.json({ maxPage, ...products });
    } catch (e) {
      next(e);
    }
  },

  async responseIsTitleUnique(req, res, next) {
    let { title } = req.body;
    title += '';
    if (!title || title.trim() === 0) return res.sendStatus(400);

    try {
      const productIsAlreadyExists = await Product.isTitleExists(title);
      if (productIsAlreadyExists) return res.sendStatus(409);

      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  },

  async responseProductDetail(req, res, next) {
    const product = req.product;

    try {
      const [brand, category, productImages] = await Promise.all([
        product.getBrand(),
        product.getCategory(),
        product.getProductImages(),
      ]);

      res.json({
        ...product.dataValues,
        brand,
        category,
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

  async getProductsPreview(req, res, next) {
    let { page = 1, limit = 20 } = req.query;

    page = Number(page);
    limit = Number(limit);
    if (Number.isNaN(page) || Number.isNaN(limit)) {
      return res.sendStatus(400);
    }

    try {
      const products = await Product.findAll({
        attributes: productPreviewAttributes,
        offset: (page - 1) * limit,
        limit,
      });
      return res.json(products);
    } catch (error) {
      next(error);
    }
  },

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

    const { brand, category } = req;

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
          categoryId: category.id,
          mainImageUrl: images[0].url,
          productImages: images.slice(1),
        },
        { transaction, include: [ProductImage] }
      );

      await transaction.commit();

      res.json({
        ...product.dataValues,
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
