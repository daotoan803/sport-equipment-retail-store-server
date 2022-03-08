const { Model, DataTypes } = require('sequelize');

const sequelizeConnection = require('./db-connection');

class OrderGroup extends Model {
  static state = {
    new: 'new',
    confirm: 'confirm',
    shipping: 'shipping',
    done: 'done',
    canceled: 'canceled',
  };

  static sortOption = {
    newest: ['createdAt', 'ASC'],
  };
}

OrderGroup.init(
  {
    state: {
      type: DataTypes.STRING,
      defaultValue: OrderGroup.state.new,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    reason: {
      // reason only use when order is canceled. reason why order was cancel
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize: sequelizeConnection,
    modelName: 'orderGroup',
  }
);

module.exports = OrderGroup;
