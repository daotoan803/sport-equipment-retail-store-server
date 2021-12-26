const User = require('./user.model');
const Account = require('./account.model');
const sequelizeConnection = require('./db');

User.hasOne(Account);
Account.belongsTo(User);

module.exports = () => {
  return sequelizeConnection.sync({ alter: true });
};
