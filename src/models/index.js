const User = require('./user.model');
const Account = require('./account.model');
const sequelizeConnection = require('./db');
const Image = require('./image.model');
const Product = require('./product.model');

User.hasOne(Account);
Account.belongsTo(User);

Product.hasMany(Image);
Image.belongsTo(Product);

module.exports = () => {
  return sequelizeConnection.sync({ force: true });
};
