const Category = require('../../models/category.model');
const CategoryGroup = require('../../models/category-group.model');
const { Op } = require('sequelize');

module.exports = {
  async getCategories(req, res, next) {
    const { group: categoryGroupCodeOrId } = req.query;

    try {
      let categories = [];

      if (categoryGroupCodeOrId) {
        const categoryGroup = await CategoryGroup.findOne({
          where: {
            [Op.or]: [
              { id: categoryGroupCodeOrId },
              { code: categoryGroupCodeOrId },
            ],
          },
          include: Category,
        });
        categories = categoryGroup.categories;
      } else {
        categories = await Category.findAll();
      }

      res.json(categories);
    } catch (e) {
      next(e);
    }
  },

  async getAllCategoryGroups(req, res) {
    const categoryGroups = await CategoryGroup.findAll({ include: Category });
    res.json(categoryGroups);
  },
};
