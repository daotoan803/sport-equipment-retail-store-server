const chatService = require('../services/chat.service');
const handleError = require('../utils/handle-error');

const formatGetChatMessageResult = (messages, limit) => {
  const maxPage = limit ? Math.ceil(messages.count / limit) : 1;
  messages.messages = messages.rows;
  delete messages.rows;

  return { maxPage, messages };
};

const getChatRooms = handleError(async (req, res) => {
  const user = req.user;
  const rooms = await chatService.getChatRooms(user.id, req.query);
  res.json({ rooms });
});

const getMessagesByRoom = handleError(async (req, res) => {
  const roomId = req.params.roomId;
  const messages = await chatService.getChatMessageByRoomId(roomId, req.query);
  const result = formatGetChatMessageResult(messages, req.query.limit);
  res.json(result);
});

const getMessagesByUser = handleError(async (req, res) => {
  const user = req.user;
  const messages = await chatService.getChatMessageByUserId(user.id, req.query);
  const result = formatGetChatMessageResult(messages, req.query.limit);
  res.json(result);
});

module.exports = {
  getChatRooms,
  getMessagesByRoom,
  getMessagesByUser,
};
