const Product = require('../models/product.model');
const Brand = require('../models/brand.model');
const Category = require('../models/category.model');
const { Op } = require('sequelize');

exports.addProduct = async (req, res, next) => {
  const {
    title,
    details,
    price,
    discountPrice,
    warrantyPeriodByDay,
    availableQuantity,
    state,
    brandId,
    categories,
  } = req.body;

  try {
    const isTitleExists = await Product.isTitleExists(title);
    if (isTitleExists) {
      return res.status(400).json({
        title:
          'Product title must be unique, another product already use that title',
      });
    }
    const [brand, categoryList] = await Promise.all([
      Brand.findByPk(brandId),
      Category.findAll({
        where: {
          id: {
            [Op.or]: categories,
          },
        },
      }),
    ]);

    if (!brand) return res.status(400).json({ error: 'Brand not found' });
    if (categoryList.length === 0)
      return res.status(400).json({ error: 'Category not found' });

    const product = await Product.create({
      title,
      details,
      price,
      discountPrice,
      warrantyPeriodByDay,
      availableQuantity,
      state,
    });

    await Promise.all([
      product.setBrand(brand),
      product.setCategories(categoryList),
    ]);
    return res.json({ ...product.dataValues, brand, categoryList });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

exports.addProductImages = async (req, res, next) => {
  const images = req.files;
  const product = req.product;
  const { brandId, categoryIdList } = req.body;
  product.brand = await product.setBrand({ id: brandId });
};
