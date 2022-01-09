const { Model, DataTypes } = require('sequelize');
const _ = require('lodash');

const sequelizeConnection = require('./config/db');

class Category extends Model {}

Category.init(
  {
    name: {
      type: DataTypes.STRING,
      set(value) {
        const name = value
          .split(' ')
          .map((word) => _.toCapitalized(word))
          .join(' ');
        this.setDataValue('name', name);
      },
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Category name can't be empty",
        },
        notNull: {
          msg: 'Category name is required',
        },
      },
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: sequelizeConnection,
    modelName: 'category',
  }
);

module.exports = Category;
