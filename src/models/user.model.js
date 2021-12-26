const { Model, DataTypes } = require('sequelize');
const _ = require('lodash');
const validator = require('validator');
const bcrypt = require('bcrypt');
const Account = require('./account.model');

const sequelizeConnection = require('./db');

class User extends Model {
  static gender = {
    male: 'male',
    female: 'female',
    other: 'other',
  };

  static async isEmailAlreadyExist(email) {
    const user = await User.findOne({ where: { email } });
    if (user) return true;
    return false;
  }

  static async isPhoneNumberAlreadyExist(phoneNumber) {
    const user = await User.findOne({ where: { phoneNumber } });
    if (user) return true;
    return false;
  }

  static async validateLoginAndGetUser(email, password) {
    const user = await User.findOne({
      where: { email },
      include: Account,
    });
    if (!user) return null;

    const validPassword = await bcrypt.compare(password, user.account.password);
    if (!validPassword) return null;
    return user;
  }

  static async signupUser({ name, email, dob, gender, password }) {
    const t = await sequelizeConnection.transaction();

    const user = await User.create(
      { name, email, dob, gender, password },
      { transaction: t }
    );
    await user.createAccount({ password }, { transaction: t });
    await t.commit();
    return user;
  }
}

User.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        this.setDataValue('name', _.startCase(value.trim()));
      },
      validate: {
        notEmpty: {
          args: true,
          msg: "Name can't be empty",
        },
      },
    },

    dob: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      set(value) {
        this.setDataValue('phoneNumber', value.trim());
      },
      validate: {
        isPhoneNumber(value) {
          if (!value) return;
          if (!validator.isMobilePhone(value, 'vi-VN')) {
            throw new Error('Please enter a valid phone number');
          }
        },
      },
    },

    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      set(value) {
        this.setDataValue('email', value.trim().toLowerCase());
      },
      validate: {
        isEmail: {
          args: true,
          msg: 'Please enter a valid email address',
        },
      },
    },

    gender: {
      type: DataTypes.STRING,
      defaultValue: User.gender.other,
      validate: {
        isIn: {
          args: Object.values(User.gender),
          msg: `Invalid gender, only accept: ${Object.values(User.gender).join(
            ', '
          )}`,
        },
      },
    },

    address: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        notEmpty: {
          args: true,
          msg: "Address can't be empty",
        },
      },
    },

    avatarUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize: sequelizeConnection,
    modelName: 'user',
  }
);

module.exports = User;
