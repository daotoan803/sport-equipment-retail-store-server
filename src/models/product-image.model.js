const { Model, DataTypes } = require('sequelize');

const sequelizeConnection = require('./config/db');

class ProductImage extends Model {}

ProductImage.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeConnection,
    modelName: 'productImage',
    timestamps: false,
  }
);

module.exports = ProductImage;
