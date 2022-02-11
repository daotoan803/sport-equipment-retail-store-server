const { Model, DataTypes } = require('sequelize');

const sequelizeConnection = require('../../config/database.config');

class ProductReview extends Model {}

ProductReview.init(
  {
    point: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: 0,
          msg: 'review point must between 0-5',
        },
        max: {
          args: 5,
          msg: 'review point must between 0-5',
        },
      },
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
