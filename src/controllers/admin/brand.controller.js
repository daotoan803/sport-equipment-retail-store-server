const Brand = require('../../models/brand.model');

module.exports = {
  async addBrand(req, res, next) {
    const { name } = req.body;
    try {
      const brand = await Brand.create({
        name,
      });
      return res.json(brand);
    } catch (e) {
      next(e);
    }
  },
};
