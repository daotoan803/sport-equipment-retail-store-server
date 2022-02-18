const sequelizeConnection = require('../../config/database.config');
const User = require('./user.model');
const Account = require('./account.model');
const ProductImage = require('./product-image.model');
const Product = require('./product.model');
const Category = require('./category.model');
const Brand = require('./brand.model');
const CategoryGroup = require('./category-group.model');
const ProductReview = require('./product-review.model');
const ChatRoom = require('./chat-room.model');
const ChatMessage = require('./chat-message.model');

const dbUtils = require('../utils/database.utils');

// User --- Account 1-1
User.hasOne(Account, { onDelete: 'CASCADE' });
Account.belongsTo(User);

// Product --- ProductImage 1-*
Product.hasMany(ProductImage, {
  onDelete: 'CASCADE',
});
ProductImage.belongsTo(Product);

// CategoryGroup --- Category 1-*
CategoryGroup.hasMany(Category);
Category.belongsTo(CategoryGroup);

// Category --- Product 1-*
Category.hasMany(Product);
Product.belongsTo(Category);

// Brand --- Product 1-*
Brand.hasMany(Product);
Product.belongsTo(Brand);

// Category --- Brand *-*
Category.belongsToMany(Brand, { through: 'category-brand', timestamps: false });
Brand.belongsToMany(Category, { through: 'category-brand', timestamps: false });

// Product --- ProductPreview 1-*
Product.hasMany(ProductReview);
ProductReview.belongsTo(Product);

// User --- ProductPreview 1-*
User.hasMany(ProductReview);
ProductReview.belongsTo(User);

// User --- ChatRoom 1-1
User.hasOne(ChatRoom);
ChatRoom.belongsTo(User);

// ChatRoom --- ChatMessage 1-*
ChatRoom.hasMany(ChatMessage);
ChatMessage.belongsTo(ChatRoom);

// user --- ChatMessage 1-*
User.hasMany(ChatMessage);
ChatMessage.belongsTo(User);

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
