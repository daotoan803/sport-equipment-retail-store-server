const { Model, DataTypes, Op } = require('sequelize');
const { createCodeName } = require('../utils/model.util');

const sequelizeConnection = require('../../config/database.config');

class CategoryGroup extends Model {
  static async findOneWhereCodeOrId(categoryGroupCodeOrId, option = {}) {
    const categoryGroup = await CategoryGroup.findOne({
      where: {
        [Op.or]: [
          { id: categoryGroupCodeOrId },
          { code: categoryGroupCodeOrId },
        ],
      },
      ...option,
    });

    return categoryGroup;
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
      set(value) {
        this.setDataValue('name', value?.trim());
      },
      validate: {
        notEmpty: {
          msg: "CategoryGroup name can't be empty",
        },
        notNull: {
          msg: 'CategoryGroup name is required',
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
    timestamps: false,
    hooks: {
      async beforeCreate(categoryGroup) {
        let code = createCodeName(categoryGroup.name);

        console.log('before create group');
        let i = 1;
        while (await CategoryGroup.findOne({ where: { code } })) {
          code = code + i;
          i++;
        }

        categoryGroup.code = code;
      },
    },
  }
);

module.exports = CategoryGroup;
