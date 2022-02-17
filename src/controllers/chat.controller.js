const uuid = require('uuid');

const initializeRealtimeChat = (io) => {
  io.on('connection', (socket) => {
    console.log('new user connected');

    socket.on('join-chat', (data) => {
      const room = uuid.v4();
      console.log(data);
      socket.emit('new-room', room);
    });

    socket.on('send-message', (data) => {
      console.log(data);

      socket.emit('new-message', data);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
};

module.exports = initializeRealtimeChat;
