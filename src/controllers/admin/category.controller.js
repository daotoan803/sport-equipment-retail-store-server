const Category = require('../../models/category.model');
const CategoryGroup = require('../../models/category-group.model');

module.exports = {
  async addCategoryGroup(req, res, next) {
    const { name } = req.body;

    try {
      const categoryGroup = await CategoryGroup.create({ name });
      res.json(categoryGroup);
    } catch (e) {
      next(e);
    }
  },

  async addCategory(req, res, next) {
    const { name } = req.body;

    try {
      const category = await Category.create({
        name,
      });
      res.json(category);
    } catch (e) {
      next(e);
    }
  },
};
