const { Model, DataTypes } = require('sequelize');

const sequelizeConnection = require('./db-connection');

class ChatRoom extends Model {
  static roomType = {
    customerSupport: 'customer-support',
    internal: 'internal',
  };
}

ChatRoom.init(
  {
    haveNewMessage: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    sequelize: sequelizeConnection,
    modelName: 'chatRoom',
  }
);

module.exports = ChatRoom;
