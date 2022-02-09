const { Model, DataTypes } = require('sequelize');

const sequelizeConnection = require('../../config/database.config');

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
