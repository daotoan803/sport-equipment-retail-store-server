const Product = require('../../models/product.model');
const ProductImage = require('../../models/product-image.model');
const sequelizeConnection = require('../../config/database.config');
const UploadImagesRequestError = require('../../errors/UploadImagesRequestError');
const imageUtils = require('../../utils/image.util');
const requestQueryUtils = require('../../utils/request-query.utils');

const convertUploadedImageToProductImage = (uploadImages) => {
  return uploadImages.map((image) => ({
    url: imageUtils.createImageUrl(image.filename),
  }));
};

module.exports = {
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
        { transaction, include: ProductImage }
      );

      await transaction.commit();

      res.json({
        ...product.dataValues,
        productImages: product.productImages,
      });

      next();
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

  async getProductsForAdmin(req, res, next) {
    const { page, limit } = req.query;

    const pageLimitOption = requestQueryUtils.createPageLimitOption(
      page,
      limit
    );

    try {
      const products = await Product.findAndCountAll({
        attributes: [
          'id',
          'title',
          'price',
          'discountPrice',
          'availableQuantity',
          'soldCount',
          'visitedCount',
          'state',
          'mainImageUrl',
        ],
        ...pageLimitOption,
      });

      const maxPage = limit ? Math.ceil(products.count / limit) : 1;
      products.products = products.rows;
      delete products.rows;

      res.json({ maxPage, ...products });
    } catch (e) {
      next(e);
    }
  },
};
