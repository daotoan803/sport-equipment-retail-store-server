const { Model, DataTypes } = require('sequelize');

const sequelizeConnection = require('./db-connection');

class ProductReview extends Model {}

ProductReview.init(
  {
    point: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    review: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
  },
  {
    sequelize: sequelizeConnection,
    modelName: 'productReview',
  }
);

module.exports = ProductReview;
