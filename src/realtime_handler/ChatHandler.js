const uuid = require('uuid');
const jwt = require('jsonwebtoken');

const initializeRealtimeChat = (io) => {
  io.of('/chat').use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next('Missing auth token');

    const TOKEN_KEY = process.env.TOKEN_KEY;
    const data = await jwt.verify(token, TOKEN_KEY);
    socket.userId = data.userId;
    next();
  });

  io.of('/chat').on('connection', (socket) => {
    console.log('new user connected');
    socket.on('test-connection', (data) => {
      console.log('test-connection ok', socket.id);
      console.log(data);
      socket.emit('connection-result', 'ok');
    });

    socket.on('join-support-chat', () => {
      const room = uuid.v4();
      console.log(socket.userId);

      socket.emit('new-room', room);
    });

    socket.on('send-message', (data) => {
      console.log(data);

      socket.emit('new-message', data);
    });

    socket.on('disconnecting', () => {
      console.log('user disconnected');
    });
  });
};

module.exports = initializeRealtimeChat;
