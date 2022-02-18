const { Model } = require('sequelize');

const sequelizeConnection = require('../../config/database.config');

class ChatRoom extends Model {
  static roomType = {
    customerSupport: 'customer-support',
    internal: 'internal',
  };
}

ChatRoom.init(
  {},
  {
    sequelize: sequelizeConnection,
    modelName: 'chatRoom',
  }
);

module.exports = ChatRoom;
