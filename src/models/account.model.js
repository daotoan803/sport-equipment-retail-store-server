const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

const sequelizeConnection = require('./config/db');
const uuid = require('uuid');

class Account extends Model {
  static role = {
    customer: 'customer',
    sale: 'sale',
    storage: 'storage',
    admin: 'admin',
  };

  toJSON() {
    /*not allow to return anything*/
    return {};
  }

  static generateUserKey() {
    return uuid.v4();
  }
}

Account.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        this.setDataValue('password', value.trim() !== '' ? value : null);
      },
      validate: {
        len: {
          args: [4, 200],
          msg: 'Password must be at least 4 characters',
        },
        notNull: {
          args: true,
          msg: "password can't be empty",
        },
      },
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: Account.role.customer,
      set(value) {
        this.setDataValue('role', value.trim().toLowerCase());
      },
      validate: {
        isIn: {
          args: [Object.values(Account.role)],
          msg: 'Invalid role',
        },
      },
    },
    userKey: {
      //user key is use for validating access token
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
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
