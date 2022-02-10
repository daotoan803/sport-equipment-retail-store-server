const { Op } = require('sequelize');
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
  'soldCount',
  'visitedCount',
];

const createPageLimitOption = (page, limit) => {
  let limitOption = {};

  page = Number(page);
  limit = Number(limit);

  page = page >= 1 ? page : 1;

  if (limit >= 0) {
    limitOption = {
      offset: (page - 1) * limit,
      limit: limit,
    };
  }

  return limitOption;
};

const createBrandFilterOption = (brandId) => {
  const brandFilter = {};
  if (Number(brandId) >= -1) {
    brandFilter.brandId = Number(brandId);
  }

  return brandFilter;
};

const createPriceRangeFilterOption = (minPrice, maxPrice) => {
  minPrice = Number(minPrice);
  maxPrice = Number(maxPrice);

  if (
    (Number.isNaN(minPrice) && Number.isNaN(maxPrice)) ||
    (minPrice < 0 && maxPrice < 0)
  ) {
    return {};
  }

  const priceRangeFilterQuery = {
    [Op.and]: {
      [Op.gte]: minPrice > 0 ? minPrice : 0,
      ...(maxPrice >= 0 ? { [Op.lte]: maxPrice } : {}),
    },
  };

  const priceFilter = {
    [Op.or]: [
      { price: priceRangeFilterQuery },
      { discountPrice: priceRangeFilterQuery },
    ],
  };

  return priceFilter;
};

const createSortOption = (sortBy) => {
  if (Object.keys(Product.sortOptions).includes(sortBy)) {
    return {
      order: [Product.sortOptions[sortBy]],
    };
  }

  return { order: [Product.sortOptions.name] };
};

const getMemberCategoryIdListFromCategoryGroupCode = async (
  categoryGroupCode
) => {
  const categoryGroup = await CategoryGroup.findOne({
    where: { code: categoryGroupCode },
    include: Category,
  });

  const categoryIdList = categoryGroup.categories.map(
    (category) => category.id
  );

  return categoryIdList;
};

module.exports = {
  async increaseProductDetailVisitedCount(req) {
    const { product } = req;
    try {
      Product.increment('visitedCount', { by: 1, where: { id: product.id } });
    } catch (e) {
      console.error(e);
    }
  },

  async getProductsByCategoryGroup(req, res, next) {
    const { categoryGroupCode } = req.params;

    let { page, limit, brand: brandId, minPrice, maxPrice, sortBy } = req.query;
    page = Number(page);
    limit = Number(limit);
    minPrice = Number(minPrice);
    maxPrice = Number(maxPrice);

    try {
      const limitOption = createPageLimitOption(page, limit);
      const brandFilter = createBrandFilterOption(brandId);
      const priceFilter = createPriceRangeFilterOption(minPrice, maxPrice);
      const sortOption = createSortOption(sortBy);

      const categoryIdList = await getMemberCategoryIdListFromCategoryGroupCode(
        categoryGroupCode
      );

      const products = await Product.findAndCountAll({
        attributes: productPreviewAttributes,
        ...limitOption,
        ...sortOption,
        logging: console.log,
        where: {
          categoryId: categoryIdList,
          ...brandFilter,
          ...priceFilter,
        },
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

      req.product = product;
      next();
    } catch (e) {
      next(e);
    }
  },

  async getAllProductPreviews(req, res, next) {
    let { page, limit } = req.query;

    page = Number(page);
    limit = Number(limit);

    const limitOption = createPageLimitOption(page, limit);

    try {
      const products = await Product.findAll({
        attributes: productPreviewAttributes,
        ...limitOption,
      });
      return res.json(products);
    } catch (error) {
      next(error);
    }
  },
};
