const { Model, DataTypes } = require('sequelize');
const { createCodeName } = require('../utils/model.util');

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
      set(value) {
        this.setDataValue('name', value?.trim());
      },
      validate: {
        notEmpty: {
          msg: "Category name can't be empty",
        },
        notNull: {
          msg: 'Category name is required',
        },
      },
    },

    code: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
  },
  {
    sequelize: sequelizeConnection,
    modelName: 'category',
    timestamps: false,
    hooks: {
      async beforeCreate(category) {
        let code = createCodeName(category.name);
        console.log('before create category')
        let i = 1;
        while (await Category.findOne({ where: { code } })) {
          code = code + i;
          i++;
        }

        category.code = code;
      },
    },
  }
);

module.exports = Category;
