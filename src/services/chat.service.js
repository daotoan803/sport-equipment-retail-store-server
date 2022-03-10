const User = require('../models/user.model');
const ChatRoom = require('../models/chat-room.model');
const ChatMessage = require('../models/chat-message.model');
const { Sequelize, Op } = require('sequelize');
const httpStatus = require('http-status');
const ApiError = require('../errors/ApiError');

const generatePageLimitOption = (page, limit) => {
  let option = {};
  if (page && limit) {
    option = {
      offset: (page - 1) * limit,
      limit,
    };
  }
  return option;
};

const findChatRoomById = async (chatRoomId, option = {}) => {
  const chatRoom = await ChatRoom.findByPk(chatRoomId, option);
  if (!chatRoom)
    throw new ApiError(httpStatus.NOT_FOUND, 'Chat room id not exists');
  return chatRoom;
};

const findChatRoomByUserId = async (userId, option = {}) => {
  const chatRoom = await ChatRoom.findOne({ where: { userId }, ...option });
  if (!chatRoom)
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "No chat room belong to user's id "
    );
  return chatRoom;
};

const getChatRooms = async (currentUserId, { page, limit }) => {
  const pageOption = generatePageLimitOption(page, limit);
  const listOfMostRecentMessageIdFromEachChatRoom = await ChatMessage.findAll({
    attributes: [[Sequelize.fn('MAX', Sequelize.col('id')), 'id']],
    where: {
      userId: {
        [Op.not]: [currentUserId],
      },
    },
    order: [['id', 'DESC']],
    group: 'chatRoomId',
  });

  const idList = listOfMostRecentMessageIdFromEachChatRoom.map((id) => id.id);

  const chatRooms = await ChatMessage.findAndCountAll({
    where: { id: idList },
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
    ...pageOption,
  });

  return chatRooms;
};

const getChatMessageByRoomId = async (roomId, { page, limit }) => {
  const pageOption = generatePageLimitOption({ page, limit });
  await findChatRoomById(roomId);
  const messages = await ChatMessage.findByRoomId(roomId, {
    ...pageOption,
  });

  return messages;
};

const getChatMessageByUserId = async (userId, { page, limit }) => {
  const pageOption = generatePageLimitOption({ page, limit });
  const chatRoom = await findChatRoomByUserId(userId);
  const messages = await ChatMessage.findByRoomId(chatRoom.id, {
    ...pageOption,
  });
  return messages;
};

const createNewMessage = async (
  userId,
  chatRoomId,
  { message, messageType = ChatMessage.messageType.message }
) => {
  let chatRoom = null;
  if (chatRoomId) {
    chatRoom = await findChatRoomById(chatRoomId);
  } else {
    chatRoom = await findChatRoomByUserId(userId);
  }

  const newMessage = await chatRoom.createChatMessage({
    message,
    messageType,
    userId,
  });

  chatRoom.haveNewMessage = true;
  chatRoom.save();

  return { message: newMessage, chatRoom };
};

const chatRoomMessageRead = (roomId) =>
  ChatRoom.update({ haveNewMessage: false }, { where: { id: roomId } });

module.exports = {
  findChatRoomById,
  findChatRoomByUserId,
  getChatRooms,
  getChatMessageByRoomId,
  getChatMessageByUserId,
  createNewMessage,
  chatRoomMessageRead,
};
