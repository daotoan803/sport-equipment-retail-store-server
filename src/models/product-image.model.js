const { Model, DataTypes } = require('sequelize');

const sequelizeConnection = require('./db-connection');

class ProductImage extends Model {}

ProductImage.init(
  {
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    modelName: 'productImages',
    sequelize: sequelizeConnection,
    timestamps: false,
  }
);

module.exports = ProductImage;
