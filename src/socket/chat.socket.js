const chatSocketController = require('../controllers/chat-socket.controller');

const init = (io) => {
  io.of('/chat').use(chatSocketController.validateUser);

  io.of('/chat').on('connection', (socket) => {
    socket.on('join-support-room', chatSocketController.onJoinChatRoom(socket));

    socket.on(
      'leave-support-room',
      chatSocketController.onLeaveChatRoom(socket)
    );

    socket.on('read-message', chatSocketController.onReadMessage(socket));

    socket.on('send-message', chatSocketController.onNewMessage(socket));

    socket.on('send-image-message', chatSocketController.onImageSend(socket));

    socket.on('disconnecting', chatSocketController.onDisconnecting(socket));
  });
};

module.exports = { init };
