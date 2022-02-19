const User = require('../models/user.model');
const ChatRoom = require('../models/chat-room.model');
const ChatMessage = require('../models/chat-message.model');
const { createPageLimitOption } = require('../utils/request-query.utils');
const { Sequelize } = require('sequelize');

module.exports = {
  async getUserPreviewInfoByNewestChat(req, res, next) {
    const { page, limit } = req.query;
    const pageLimitOption = createPageLimitOption(page, limit);

    try {
      const newestChatIdOfEachChatRoomList = await ChatMessage.findAll({
        attributes: [[Sequelize.fn('MAX', Sequelize.col('id')), 'id']],
        group: 'chatRoomId',
        logging: console.log,
      });

      const idList = newestChatIdOfEachChatRoomList.map((id) => id.id);

      const chatMessages = await ChatMessage.findAll({
        where: {
          id: idList,
        },
        include: {
          model: User,
          attributes: ['name', 'avatarUrl'],
        },
        logging: console.log,
        ...pageLimitOption,
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
        include: ChatRoom,
      });

      const messages = await ChatMessage.findAndCountAll({
        where: {
          chatRoomId: user.chatRoom.id,
        },
        ...pageLimitOption,
        order: [['createdAt', 'DESC']],
      });

      const maxPage = limit ? Math.ceil(messages.count / limit) : 1;
      messages.messages = messages.rows;
      delete messages.rows;

      res.json({ maxPage, messages });
    } catch (e) {
      next(e);
    }
  },
};
