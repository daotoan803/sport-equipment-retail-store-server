const Category = require('../../models/category.model');
const CategoryGroup = require('../../models/category-group.model');
const Mutex = require('async-mutex').Mutex;
const mutex = new Mutex();

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

  async addBrandToCategory(req) {
    const { brand, category } = req;
    const release = await mutex.acquire();

    try {
      const brandIsExisted = await category.hasBrand(brand);
      if (!brandIsExisted) {
        await category.addBrand(brand);
      }
    } catch (e) {
      console.error(e);
    } finally {
      release();
    }
  },
};
