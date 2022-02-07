const sequelizeConnection = require('./config/db');
const User = require('./user.model');
const Account = require('./account.model');
const ProductImage = require('./product-image.model');
const Product = require('./product.model');
const Category = require('./category.model');
const Brand = require('./brand.model');
const CategoryGroup = require('./category-group.model');

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

exports.initialize = async () => {
  const syncOptions = { force: true };
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
