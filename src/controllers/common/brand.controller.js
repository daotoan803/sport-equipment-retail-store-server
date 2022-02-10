const Brand = require('../../models/brand.model');
const CategoryGroup = require('../../models/category-group.model');
const Category = require('../../models/category.model');

module.exports = {
  async getBrands(req, res, next) {
    try {
      const brands = await Brand.findAll();
      res.json(brands);
    } catch (e) {
      next(e);
    }
  },

  async getBrandsByCategoryGroup(req, res, next) {
    const { categoryGroupCode } = req.params;
    try {
      const categoryGroups = await CategoryGroup.findOne({
        where: {
          code: categoryGroupCode,
        },
        include: {
          model: Category,
          include: Brand,
        },
      });

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

      res.json(Object.values(brands));
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
