const Category = require('../../models/category.model');
const CategoryGroup = require('../../models/category-group.model');

module.exports = {

  async getCategories(req, res) {
    const categories = await Category.findAll();
    res.json(categories);
  },

  async getCategoriesGroup(req, res) {
    const categoryGroups = await CategoryGroup.findAll({ include: Category });
    res.json(categoryGroups);
  },
};
