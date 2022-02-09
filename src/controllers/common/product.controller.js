const Product = require('../../models/product.model');
const Category = require('../../models/category.model');
const CategoryGroup = require('../../models/category-group.model');

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
      products.products = products.rows;
      delete products.rows;

      return res.json({ maxPage, ...products });
    } catch (e) {
      next(e);
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
};
