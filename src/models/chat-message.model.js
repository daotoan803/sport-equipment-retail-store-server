const { Model, DataTypes } = require('sequelize');

const sequelizeConnection = require('../../config/database.config');

class ChatMessage extends Model {
  static messageType = {
    message: 'message',
    event: 'event',
  };
}

ChatMessage.init(
  {
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    messageType: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ChatMessage.messageType.message,
    },
  },
  {
    sequelize: sequelizeConnection,
    modelName: 'chatMessage',
  }
);

module.exports = ChatMessage;
