const User = require('../models/user.model');
const uuid = require('uuid');
const ChatMessage = require('../models/chat-message.model');
const ChatRoom = require('../models/chat-room.model');
const { uploadedImageDirPath } = require('../utils/project-path');
const path = require('path');
const imageUtils = require('../utils/image.util');
const fs = require('fs');

const getChatRoom = (user, chatRoomId) => {
  if (!chatRoomId) {
    return ChatRoom.findOne({
      where: { userId: user.id },
      attributes: ['id', 'haveNewMessage'],
    });
  }

  return ChatRoom.findByPk(chatRoomId, {
    attributes: ['id', 'haveNewMessage'],
  });
};

const validateUser = async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next('Missing auth token');

  const user = await User.validateTokenAndGetUser(token);
  socket.user = user;

  if (!user) {
    next('Not logged in');
    return;
  }
  next();
};

const initializeRealtimeChat = (io) => {
  io.of('/chat').use(validateUser);

  io.of('/chat').on('connection', (socket) => {
    socket.on('join-support-room', async (roomId, cb = () => {}) => {
      try {
        const user = socket.user;

        if (!roomId) {
          const chatRoom = await user.getChatRoom();
          roomId = chatRoom.id;
        }

        socket.join(roomId);
        console.log(user.name + ' joining room ' + roomId);
        cb(null);
        socket.to(roomId).emit('user-join-room');
      } catch (e) {
        cb('something went wrong while joining room');
        console.error(e);
      }
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
        if (message.trim() === '') return;

        let chatRoom = await getChatRoom(user, chatRoomId);

        try {
          const newMessage = await ChatMessage.create({
            message: message,
            messageType: ChatMessage.messageType.message,
            chatRoomId: chatRoom.id,
            userId: user.id,
          });

          chatRoom.haveNewMessage = true;
          chatRoom.save();

          const sender = await newMessage.getUser({
            attributes: ['id', 'name', 'avatarUrl'],
          });

          const data = {
            ...newMessage.dataValues,
            user: { ...sender.dataValues },
            chatRoom: { ...chatRoom.dataValues },
          };

          cb(null, data);
          socket.to(chatRoom.id).emit('new-message', data);
          socket.broadcast.emit('new-broadcast-message', data);
        } catch (e) {
          cb('Something went wrong');
          console.error(e);
        }
      }
    );

    socket.on(
      'send-image-message',
      async ({ imageBuffer, chatRoomId }, cb = () => {}) => {
        try {
          const imageName = 'chat_images' + uuid.v4() + '.jpg';

          await fs.promises.writeFile(
            path.join(uploadedImageDirPath, imageName),
            imageBuffer
          );

          const user = socket.user;

          let chatRoom = await getChatRoom(user, chatRoomId);

          const newMessage = await ChatMessage.create({
            message: imageUtils.createImageUrl(imageName),
            messageType: ChatMessage.messageType.image,
            chatRoomId: chatRoom.id,
            userId: user.id,
          });

          chatRoom.haveNewMessage = true;
          chatRoom.save();

          const sender = await newMessage.getUser({
            attributes: ['id', 'name', 'avatarUrl'],
          });

          const data = {
            ...newMessage.dataValues,
            user: { ...sender.dataValues },
            chatRoom: { ...chatRoom.dataValues },
          };

          cb(null, data);
          socket.to(chatRoom.id).emit('new-message', data);
          socket.broadcast.emit('new-broadcast-message', data);
        } catch (e) {
          cb('Error while trying to upload image');
          console.error(e);
        }
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
