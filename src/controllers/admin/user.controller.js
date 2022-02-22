const { Op } = require('sequelize');
const User = require('../../models/user.model');
const ChatRoom = require('../../models/chat-room.model');

module.exports = {
  async findUserInfoByUserIdOrChatRoomId(req, res, next) {
    const { userId, chatRoomId } = req.query;

    if (!userId && !chatRoomId) return res.sendStatus(400);

    try {
      const { user } = ChatRoom.findOne({
        where: {
          [Op.or]: [{ userId }, { id: chatRoomId }],
        },
        attributes: ['id'],
        include: User,
      });

      if (!user) res.sendStatus(404);

      return res.json(user);
    } catch (e) {
      next(e);
    }
  },
};
