const { Model, DataTypes } = require('sequelize');

const sequelizeConnection = require('./config/db');

class ProductImage extends Model {}

ProductImage.init(
  {
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeConnection,
    modelName: 'product_image',
  }
);

module.exports = ProductImage;
