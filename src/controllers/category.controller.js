const Category = require('../models/category.model');

module.exports = {
  async addCategory(req, res, next) {
    const { name } = req.body;
    const logo = req.file;
    const fileUploadError = req.fileError;
    if (!logo && fileUploadError)
      return res.status(400).json({ error: fileUploadError });
    if (!name) return res.status(400).json("Category's name is required");

    try {
      const category = await Category.create({
        name,
        logoUrl: logo ? `images/${logo.filename}` : null,
      });
      res.json(category);
    } catch (e) {
      next(e);
    }
  },

  async getCategories(req, res) {
    const categories = await Category.findAll();
    res.json(categories);
  },
};
