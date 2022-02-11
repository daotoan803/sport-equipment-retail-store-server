const { Op } = require('sequelize');
const Product = require('../../models/product.model');
const Category = require('../../models/category.model');
const CategoryGroup = require('../../models/category-group.model');
const ProductImage = require('../../models/product-image.model');
const ProductReview = require('../../models/product-review.model');
const Brand = require('../../models/brand.model');

const productPreviewAttributes = [
  'id',
  'title',
  'price',
  'discountPrice',
  'state',
  'mainImageUrl',
  'soldCount',
  'visitedCount',
  'reviewCount',
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

const createStateFilterOption = (state) => {
  return state === Product.state.available
    ? { state: Product.state.available }
    : {
        state: {
          [Op.not]: Product.state.hidden,
        },
      };
};

const createCategoryFilterOption = async ({
  categoryGroupCodeOrId,
  categoryCodeOrId,
}) => {
  if (categoryCodeOrId) {
    const category = await Category.findOne({
      where: {
        [Op.or]: [{ id: categoryCodeOrId }, { code: categoryCodeOrId }],
      },
    });
    if (!category) return {};
    return { categoryId: category.id };
  }

  if (categoryGroupCodeOrId) {
    const listOfCategoryInCategoryGroup =
      await getMemberCategoryIdListFromCategoryGroupCode(categoryGroupCodeOrId);

    if (listOfCategoryInCategoryGroup.length === 0) return {};
    return { categoryId: listOfCategoryInCategoryGroup };
  }

  return {};
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
  categoryGroupCodeOrId
) => {
  const categoryGroup = await CategoryGroup.findOne({
    where: {
      [Op.or]: [{ code: categoryGroupCodeOrId }, { id: categoryGroupCodeOrId }],
    },
    include: Category,
  });

  if (!categoryGroup) return [];

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

  async getProductPreviews(req, res, next) {
    let {
      page,
      limit,
      categoryGroup: categoryGroupCodeOrId,
      category: categoryCodeOrId,
      brand: brandId,
      minPrice,
      maxPrice,
      sortBy,
      state,
    } = req.query;

    page = Number(page);
    limit = Number(limit);
    minPrice = Number(minPrice);
    maxPrice = Number(maxPrice);

    try {
      const categoryFilter = await createCategoryFilterOption({
        categoryGroupCodeOrId,
        categoryCodeOrId,
      });
      const limitOption = createPageLimitOption(page, limit);
      const brandFilter = createBrandFilterOption(brandId);
      const priceFilter = createPriceRangeFilterOption(minPrice, maxPrice);
      const sortOption = createSortOption(sortBy);

      const stateFilter = createStateFilterOption(state);

      const products = await Product.findAndCountAll({
        attributes: productPreviewAttributes,
        ...limitOption,
        ...sortOption,
        where: {
          ...categoryFilter,
          ...brandFilter,
          ...priceFilter,
          ...stateFilter,
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

  async getProductDetail(req, res, next) {
    const { productId } = req.params;

    try {
      const product = await Product.findByPk(productId, {
        include: [ProductImage, ProductReview, Category, Brand],
      });
      if (!product) return res.sendStatus(404);

      res.json(product);

      req.product = product;
      next();
    } catch (e) {
      next(e);
    }
  },
};
