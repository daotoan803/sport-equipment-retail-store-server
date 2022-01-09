const Product = require('../models/product.model');
const errorHandler = require('../utils/error-handler');
const { ValidationError } = require('sequelize');
const multer = require('multer');
const path = require('path');
const imageUtils = require('../utils/image.util');

exports.validateProductDetail = async (req, res, next) => {
  const {
    title,
    details,
    price,
    discountPrice,
    warrantyPeriodByDay,
    availableQuantity,
  } = req.body;

  try {
    const isTitleExists = await Product.isTitleExists(title);
    if (!isTitleExists) {
      return res.status(400).json({
        title:
          'Product title must be unique, another product already use that title',
      });
    }
    const product = await Product.build({
      title,
      details,
      price,
      discountPrice,
      warrantyPeriodByDay,
      availableQuantity,
    });
    req.product = product;
    next();
  } catch (e) {
    console.error(e);
    if (e instanceof ValidationError) {
      return res.status(400).json(errorHandler.parseValidationErrors(e));
    }
    next(e);
  }
};

exports.handleImageUpload = (() => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './upload/images'),
    filename: (req, file, cb) => {
      const unique = Math.round(Math.random * 1e9) + Date.now();
      if (!imageUtils.fileUploadingIsImage(file)) {
        return cb('Error: Only accept images in jpeg|jpg|png|gif ');
      }
      const fileName = `${file.fieldname}_${unique}_${path.extname(
        file.originalname
      )}`;
      cb(null, fileName);
    },
  });

  return multer({ storage }).array('images');
})();

exports.addProduct = (req, res, next) => {
  const images = req.files;
};
