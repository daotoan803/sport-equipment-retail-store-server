const User = require('./user.model');
const Account = require('./account.model');
const sequelizeConnection = require('./db');
const Image = require('./image.model');
const Product = require('./product.model');

User.hasOne(Account);
Account.belongsTo(User);

Product.hasMany(Image);
Image.belongsTo(Product);

const createDefaultAdminAccount = async () => {
  const defaultAdminAccount = {
    name: 'admin',
    email: 'vnsport@vnsport.com',
    dob: '01-01-2000',
    gender: User.gender.other,
    password: 'admin',
  };
  const alreadyCreate = await User.isEmailAlreadyExist(
    defaultAdminAccount.email
  );
  if (alreadyCreate) return;

  const admin = await User.signupUser(defaultAdminAccount);
  admin.account = await admin.getAccount();
  admin.account.role = Account.role.admin;
  return admin.account.save();
};

module.exports.initialize = async () => {
  await sequelizeConnection.sync({ alter: true });
  await createDefaultAdminAccount();
  return;
};

module.exports.terminate = () => {
  return sequelizeConnection.close();
};
