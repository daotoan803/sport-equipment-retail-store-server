const Brand = require('../../models/brand.model');
const CategoryGroup = require('../../models/category-group.model');
const Category = require('../../models/category.model');
const { Op } = require('sequelize');

const findBrandByCategoryGroup = async (categoryGroupCodeOrId) => {
  const categoryGroups = await CategoryGroup.findOneWhereCodeOrId(
    categoryGroupCodeOrId,
    {
      include: {
        model: Category,
        include: Brand,
      },
    }
  );

  const brands = {};
  const categories = categoryGroups.categories;
  categories.forEach((category) => {
    category.brands.forEach((brand) => {
      if (!brands[brand.id]) {
        delete brand['category-brand'];
        brands[brand.id] = { id: brand.id, name: brand.name };
      }
    });
  });

  return Object.values(brands);
};

module.exports = {
  async getBrands(req, res, next) {
    const { categoryGroupCodeOrId, categoryCodeOrId } = req.query;

    try {
      let brands = null;
      if (categoryGroupCodeOrId) {
        brands = await findBrandByCategoryGroup(categoryGroupCodeOrId);
      } else if (categoryCodeOrId) {
        const category = await category.findOne({
          where: {
            [Op.or]: [{ id: categoryCodeOrId }, { code: categoryCodeOrId }],
          },
          include: Brand,
        });
        brands = category.brands;
      } else {
        brands = await Brand.findAll();
      }

      res.json(brands);
    } catch (e) {
      next(e);
    }
  },

  async getBrandByCategory(req, res, next) {
    const { categoryId } = req.params;

    try {
      const category = await Category.findByPk(categoryId);
      if (!category) return res.sendStatus(404);

      const brands = await category.getBrands();
      const data = brands.map((brand) => ({ id: brand.id, name: brand.name }));
      res.json(data);
    } catch (e) {
      next(e);
    }
  },
};
