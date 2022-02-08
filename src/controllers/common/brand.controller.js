const Brand = require('../../models/brand.model');

module.exports = {
  async getBrands(req, res) {
    const brands = await Brand.findAll();
    res.json(brands);
  },
};
