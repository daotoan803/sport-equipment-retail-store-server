const Brand = require('../models/brand.model');

exports.addBrand = async (req, res, next) => {
  const { name } = req.body;
  const logo = req.file;
  const fileUploadError = req.fileError;
  if (!logo && fileUploadError)
    return res.status(400).json({ error: fileUploadError });
  if (!name) return res.status(400).json("Brand's name is required");


  try {
    const brand = await Brand.create({
      name,
      logoUrl: `images/${logo.filename}`,
    });
    res.json(brand);
  } catch (e) {
    next(e);
  }
};
