const User = require('../models/user.model');
const ChatRoom = require('../models/chat-room.model');
const ChatMessage = require('../models/chat-message.model');
const { createPageLimitOption } = require('../utils/request-query.utils');
const { Sequelize, Op } = require('sequelize');

const formatGetChatMessageResult = (messages, limit) => {
  const maxPage = limit ? Math.ceil(messages.count / limit) : 1;
  messages.messages = messages.rows;
  delete messages.rows;

  return { maxPage, messages };
};

module.exports = {
  async getUserPreviewInfoByNewestChat(req, res, next) {
    const { page, limit } = req.query;
    const pageLimitOption = createPageLimitOption(page, limit);
    const { user } = req;

    try {
      const newestChatIdOfEachChatRoomList = await ChatMessage.findAll({
        attributes: [[Sequelize.fn('MAX', Sequelize.col('id')), 'id']],
        where: {
          userId: {
            [Op.not]: [user.id],
          },
        },
        order: [['id', 'DESC']],
        group: 'chatRoomId',
        ...pageLimitOption,
      });

      const idList = newestChatIdOfEachChatRoomList.map((id) => id.id);

      const chatMessages = await ChatMessage.findAll({
        where: {
          id: idList,
        },
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'avatarUrl'],
          },
          {
            model: ChatRoom,
            attributes: ['id', 'haveNewMessage'],
          },
        ],
        order: [['createdAt', 'DESC']],
      });

      res.json(chatMessages);
    } catch (e) {
      next(e);
    }
  },

  async getUserChatMessage(req, res, next) {
    const { userAccount } = req;
    const { page, limit } = req.query;
    const pageLimitOption = createPageLimitOption(page, limit);

    const userId = userAccount.userId;

    try {
      const user = await User.findByPk(userId, {
        attributes: ['id'],
        include: ChatRoom,
      });

      const roomId = user.chatRoom.id;

      const messages = await ChatMessage.findByRoomId(roomId, {
        ...pageLimitOption,
      });

      const result = formatGetChatMessageResult(messages, limit);

      res.json(result);
    } catch (e) {
      next(e);
    }
  },

  async getChatMessageByRoomId(req, res, next) {
    const { page, limit } = req.query;
    const { chatRoomId } = req.params;

    const pageLimitOption = createPageLimitOption(page, limit);

    try {
      const messages = await ChatMessage.findByRoomId(chatRoomId, {
        ...pageLimitOption,
      });

      const result = formatGetChatMessageResult(messages, limit);

      res.json(result);
    } catch (e) {
      next(e);
    }
  },
};
