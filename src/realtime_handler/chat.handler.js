const User = require('../models/user.model');
const ChatMessage = require('../models/chat-message.model');
const ChatRoom = require('../models/chat-room.model');

const initializeRealtimeChat = (io) => {
  io.of('/chat').use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next('Missing auth token');

    const user = await User.validateTokenAndGetUser(token);
    socket.user = user;
    next();
  });

  io.of('/chat').on('connection', (socket) => {
    socket.on('test-connection', () => {
      console.log('test-connection ok', socket.id);
      socket.emit('connection-result', 'ok');
    });

    socket.on('join-support-room', async (roomId, cb = () => {}) => {
      const user = socket.user;

      if (!roomId) {
        const chatRoom = await user.getChatRoom();
        roomId = chatRoom.id;
      }

      console.log(user.name + ' joining room ' + roomId);
      socket.join(roomId);
      cb(null);
    });

    socket.on('leave-support-room', async (roomId, cb = () => {}) => {
      const user = socket.user;

      console.log(user.name + ' leaving room ' + roomId);
      socket.leave(roomId);
      cb(null);
    });

    socket.on('read-message', (roomId) => {
      ChatRoom.update({ haveNewMessage: false }, { where: { id: roomId } });
    });

    socket.on(
      'send-message',
      async ({ message, chatRoomId }, cb = () => {}) => {
        const user = socket.user;

        let chatRoom = null;

        if (!chatRoomId) {
          chatRoom = await ChatRoom.findOne({ where: { userId: user.id } });
        } else {
          chatRoom = await ChatRoom.findByPk(chatRoomId);
        }

        if (!chatRoom) {
          const errorMessage = 'Chat room not found';
          cb(errorMessage);
          socket.emit('error', errorMessage);
          return;
        }

        const newMessage = await ChatMessage.create({
          message: message,
          messageType: ChatMessage.messageType.message,
          chatRoomId: chatRoom.id,
          userId: user.id,
        });

        newMessage.user = await newMessage.getUser({
          attributes: ['id', 'name', 'avatarUrl'],
        });

        const data = {
          ...newMessage.dataValues,
          user: newMessage.user,
        };

        chatRoom.haveNewMessage = true;
        chatRoom.save();

        cb(data);
        socket.to(chatRoomId).emit('new-message', data);
        socket.broadcast.emit('new-broadcast-message', data);
      }
    );

    socket.on('disconnecting', () => {
      const user = socket.user;
      console.log('user disconnected');
      socket.rooms.forEach((roomId) => {
        if (roomId === socket.id) return;
        socket.to(roomId).emit('user-left', user.name);
      });
    });
  });
};

module.exports = initializeRealtimeChat;
