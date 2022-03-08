const { Model, DataTypes } = require('sequelize');

const sequelizeConnection = require('./db-connection');

class Brand extends Model {
  static async isNameAlreadyExists(name) {
    const brand = await Brand.findOne({ where: { name } });
    return brand !== null;
  }
}

Brand.init(
  {
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      set(value) {
        this.setDataValue('name', value.trim());
      },
      validate: {
        notEmpty: {
          msg: "Brand name can't be empty",
        },
        notNull: {
          msg: 'Brand name is required',
        },
      },
    },
  },
  {
    sequelize: sequelizeConnection,
    modelName: 'brand',
    timestamps: false,
  }
);

module.exports = Brand;
