const { Model, DataTypes } = require('sequelize');

const sequelizeConnection = require('../../config/database.config');

class CategoryGroup extends Model {
  static findAllWherePk(categoryIdList) {
    return CategoryGroup.findAll({
      where: {
        id: categoryIdList,
      },
    });
  }

  static async isNameAlreadyExists(name) {
    const existsCategoryName = await CategoryGroup.findOne({
      where: {
        name,
      },
    });
    return existsCategoryName !== null;
  }
}

CategoryGroup.init(
  {
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "CategoryGroup name can't be empty",
        },
        notNull: {
          msg: 'CategoryGroup name is required',
        },
      },
    },
  },
  {
    sequelize: sequelizeConnection,
    modelName: 'category_group',
    timestamps: false,
  }
);

module.exports = CategoryGroup;
