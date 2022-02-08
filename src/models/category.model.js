const { Model, DataTypes } = require('sequelize');

const sequelizeConnection = require('../../config/database.config');

class Category extends Model {
  static findAllWherePk(categoryIdList) {
    return Category.findAll({
      where: {
        id: categoryIdList,
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
    name: {
      type: DataTypes.STRING,
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
  },
  {
    sequelize: sequelizeConnection,
    modelName: 'category',
    timestamps: false,
  }
);

module.exports = Category;
