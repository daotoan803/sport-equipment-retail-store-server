const { Model, DataTypes } = require('sequelize');

const sequelizeConnection = require('./db-connection');
const User = require('./user.model');

class ChatMessage extends Model {
  static messageType = {
    message: 'message',
    event: 'event',
    image: 'image',
  };

  static async findByRoomId(roomId, { option = {} }) {
    const messages = await ChatMessage.findAndCountAll({
      where: {
        chatRoomId: roomId,
      },
      include: {
        model: User,
        attributes: ['id', 'name', 'avatarUrl'],
      },
      ...option,
      order: [['createdAt', 'DESC']],
    });

    return messages;
  }
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
