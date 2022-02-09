const Brand = require('../../models/brand.model');
const CategoryGroup = require('../../models/category-group.model');
const Category = require('../../models/category.model');

module.exports = {
  async getBrands(req, res) {
    const brands = await Brand.findAll();
    res.json(brands);
  },

  async getBrandsByCategoryGroup(req, res, next) {
    const { categoryGroupId } = req.params;
    try {
      const categoryGroups = await CategoryGroup.findByPk(categoryGroupId, {
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
};
