const { Model, DataTypes, Op } = require('sequelize');
const _ = require('lodash');

const sequelizeConnection = require('./config/db');

class Category extends Model {
  static findAllWherePk(categoryIdList) {
    return Category.findAll({
      where: {
        id: {
          [Op.or]: categoryIdList,
        },
      },
    });
  }

  static async isNameAlreadyExists(name) {
    const existsCategoryName = await Category.findOne({
      where: {
        name,
      },
    });
    return existsCategoryName !== null;
  }
}

Category.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      set(value) {
        const name = value
          .split(' ')
          .map((word) => _.capitalize(word))
          .join(' ');
        this.setDataValue('name', name);
      },
      unique: true,
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
    logoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: sequelizeConnection,
    modelName: 'category',
    timestamps: false,
  }
);

module.exports = Category;
