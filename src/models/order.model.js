const { Model, DataTypes } = require('sequelize');

const sequelizeConnection = require('./db-connection');

class Order extends Model {}

Order.init(
  {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeConnection,
    modelName: 'order',
    timestamps: false,
  }
);

module.exports = Order;
