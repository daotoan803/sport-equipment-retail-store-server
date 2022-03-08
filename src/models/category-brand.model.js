const { Model, DataTypes } = require('sequelize');
const sequelizeConnection = require('./db-connection');

class CategoryBrand extends Model {}

CategoryBrand.init(
  {
    productsCount: {
      //number of product have this brandId and categoryId
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  {
    sequelize: sequelizeConnection,
    modelName: 'categoryBrand',
    timestamps: false,
  }
);

module.exports = CategoryBrand;
