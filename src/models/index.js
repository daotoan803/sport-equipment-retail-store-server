const sequelizeConnection = require('../../config/database.config');
const User = require('./user.model');
const Account = require('./account.model');
const ProductImage = require('./product-image.model');
const Product = require('./product.model');
const Category = require('./category.model');
const Brand = require('./brand.model');
const CategoryGroup = require('./category-group.model');
const ProductReview = require('./product-review.model');

const dbUtils = require('../utils/database.utils');

User.hasOne(Account, { onDelete: 'CASCADE' });
Account.belongsTo(User);

Product.hasMany(ProductImage, {
  onDelete: 'CASCADE',
});
ProductImage.belongsTo(Product);

CategoryGroup.hasMany(Category);
Category.belongsTo(CategoryGroup);

Category.hasMany(Product);
Product.belongsTo(Category);

Brand.hasMany(Product);
Product.belongsTo(Brand);

Category.belongsToMany(Brand, { through: 'category-brand', timestamps: false });
Brand.belongsToMany(Category, { through: 'category-brand', timestamps: false });

Product.hasMany(ProductReview, { as: 'review' });
ProductReview.belongsTo(Product);

User.hasMany(ProductReview);
ProductReview.belongsTo(User);

exports.initialize = async () => {
  const force = false;
  const syncOptions = { force, alter: !force };
  if (syncOptions.force) {
    dbUtils.cleanImageUploadFolder();
  }
  await sequelizeConnection.sync(syncOptions);
  await Promise.all([
    dbUtils.createDefaultAdminAccount(),
    dbUtils.createSampleDataForTesting(),
  ]);

  return;
};

exports.terminate = () => {
  return sequelizeConnection.close();
};
