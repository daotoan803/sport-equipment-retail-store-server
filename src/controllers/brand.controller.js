const Brand = require('../models/brand.model');

module.exports = {
  async addBrand(req, res, next) {
    const { name } = req.body;
    const logo = req.file;
    const fileUploadError = req.fileError;
    if (!logo && fileUploadError)
      return res.status(400).json({ error: fileUploadError });
    if (!name) return res.status(400).json("Brand's name is required");

    if (await Brand.isNameAlreadyExists(name))
      return res.status(409).json({ error: "Brand's name already exists" });

    try {
      const brand = await Brand.create({
        name,
        logoUrl: logo ? `images/${logo.filename}` : null,
      });
      res.json(brand);
    } catch (e) {
      next(e);
    }
  },

  async getBrands(req, res) {
    const brands = await Brand.findAll();
    res.json(brands);
  },
};
