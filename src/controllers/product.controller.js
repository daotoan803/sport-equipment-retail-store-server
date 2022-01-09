const Product = require('../models/product.model');

exports.validateProductDetail = async (req, res, next) => {
  const {
    title,
    details,
    price,
    discountPrice,
    warrantyPeriodByDay,
    availableQuantity,
    state,
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
      state,
    });
    req.product = product;
    next();
  } catch (e) {
    console.error(e);
    next(e);
  }
};

exports.addProduct = async (req, res, next) => {
  const images = req.files;
  const product = req.product;
  const { brandId, categoryIdList } = req.body;
  product.brand = await product.setBrand({ id: brandId });
};
