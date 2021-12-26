const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

const sequelizeConnection = require('./db');

class Account extends Model {
  static role = {
    customer: 'customer',
    sale: 'sale',
    storage: 'storage',
    admin: 'admin',
  };
}

Account.init(
  {
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: Account.role.customer,
      set(value) {
        this.setDataValue('role', value.trim().toLowerCase());
      },
      validate: {
        isIn: {
          args: Object.values(Account.role),
          msg: 'Invalid role',
        },
      },
    },
  },
  {
    sequelize: sequelizeConnection,
    modelName: 'account',
    hooks: {
      async beforeCreate(account) {
        account.password = await bcrypt.hash(account.password, 10);
      },
    },
  }
);

module.exports = Account;
