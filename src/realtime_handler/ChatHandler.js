const User = require('../models/user.model');
const ChatMessage = require('../models/chat-message.model');

const initializeRealtimeChat = (io) => {
  io.of('/chat').use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next('Missing auth token');

    const user = await User.validateTokenAndGetUser(token);
    socket.user = user;
    next();
  });

  io.of('/chat').on('connection', (socket) => {
    socket.on('test-connection', (data) => {
      console.log('test-connection ok', socket.id);
      console.log(data);
      socket.emit('connection-result', 'ok');
    });

    socket.on('join-support-chat', async (roomId) => {
      if (roomId) {
        return socket.join(roomId);
      }

      const user = socket.user;
      const chatRoom = await user.getChatRoom();
      socket.join(chatRoom.id);
    });

    socket.on('send-message', async (newMessage, cb) => {
      const user = socket.user;

      const chatRoom = await user.getChatRoom();
      const message = await ChatMessage.create({
        message: newMessage,
        messageType: ChatMessage.messageType.message,
        chatRoomId: chatRoom.id,
        userId: user.id,
      });

      const data = {
        ...message.dataValues,
        sender: user.name,
      };
      console.log(data);

      cb(data);
      socket.to(chatRoom.id).emit('new-message', data);
    });

    socket.on('disconnecting', () => {
      console.log('user disconnected');
    });
  });
};

module.exports = initializeRealtimeChat;
