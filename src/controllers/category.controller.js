const Category = require('../models/category.model');

exports.addCategory = async (req, res, next) => {
  const { name } = req.body;
  const logo = req.file;
  const fileUploadError = req.fileError;
  if (!logo && fileUploadError)
    return res.status(400).json({ error: fileUploadError });
  if (!name) return res.status(400).json("Category's name is required");

  try {
    const category = await Category.create({
      name,
      logoUrl: `images/${logo.filename}`,
    });
    res.json(category);
  } catch (e) {
    next(e);
  }
};
