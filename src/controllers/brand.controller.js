const Brand = require('../models/brand.model');
const Sequelize = require('sequelize');
const errorHandler = require('../utils/error-handler');

exports.addBrand = async (req, res, next) => {
  const { name } = req.body;
  const logo = req.file;
  const fileUploadError = req.fileError;
  if (!logo && fileUploadError)
    return res.status(400).json({ error: fileUploadError });
  if (!name) return res.status(400).json("Brand's name is required");

  console.log(logo);

  try {
    const brand = await Brand.create({
      name,
      logoUrl: `images/${logo.filename}`,
    });
    // console.log(brand);
    res.json(brand);
  } catch (e) {
    if (e instanceof Sequelize.ValidationError) {
      const errors = errorHandler.parseValidationErrors(e);
      return res.status(400).json(errors);
    }
    next(e);
  }
};
