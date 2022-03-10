const User = require('../models/user.model');
const uuid = require('uuid');
const ChatMessage = require('../models/chat-message.model');
const { uploadedImageDirPath } = require('../utils/project-path');
const path = require('path');
const imageUtils = require('../utils/image.util');
const fs = require('fs');
const ApiError = require('../errors/ApiError');
const chatService = require('../services/chat.service');

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

const onJoinChatRoom = (socket) => {
  return async (roomId, cb = () => {}) => {
    try {
      const user = socket.user;

      if (!roomId) {
        const chatRoom = await chatService.findChatRoomByUserId(user.id);
        roomId = chatRoom.id;
      }

      socket.join(roomId);
      console.log(user.name + ' joining room ' + roomId);
      cb(null);
      socket.to(roomId).emit('user-join-room');
    } catch (e) {
      if (e instanceof ApiError) {
        return cb(e.message);
      }
      cb('something went wrong while joining room');
      console.error(e);
    }
  };
};

const onLeaveChatRoom = (socket) => {
  return async (roomId, cb = () => {}) => {
    const user = socket.user;

    console.log(user.name + ' leaving room ' + roomId);
    socket.leave(roomId);
    cb(null);
  };
};

const onReadMessage = () => (roomId) => {
  chatService.chatRoomMessageRead(roomId);
};

const onNewMessage = (socket) => {
  return async ({ message, chatRoomId }, cb = () => {}) => {
    const user = socket.user;
    if (message?.trim() === '') {
      cb('Message is required');
      return;
    }

    try {
      const { message: newMessage, chatRoom } =
        await chatService.createNewMessage(user.id, chatRoomId, { message });

      const data = {
        message: { ...newMessage.dataValues },
        user: { ...user.dataValues },
        chatRoom: { ...chatRoom.dataValues },
      };

      cb(null, data);
      socket.to(chatRoom.id).emit('new-message', data);
      socket.broadcast.emit('new-broadcast-message', data);
    } catch (e) {
      if (e instanceof ApiError) {
        return cb(e.message);
      }
      cb('Something went wrong');
      console.error(e);
    }
  };
};

const onImageSend = (socket) => {
  return async ({ imageBuffer, chatRoomId }, cb = () => {}) => {
    try {
      const imageName = 'chat_images' + uuid.v4() + '.jpg';
      const imageUrl = imageUtils.createImageUrl(imageName);

      await fs.promises.writeFile(
        path.join(uploadedImageDirPath, imageName),
        imageBuffer
      );

      const user = socket.user;

      const { message, chatRoom } = await chatService.createNewMessage(
        user.id,
        chatRoomId,
        {
          message: imageUrl,
          messageType: ChatMessage.messageType.image,
        }
      );

      const data = {
        message: { ...message.dataValues },
        user: { ...user.dataValues },
        chatRoom: { ...chatRoom.dataValues },
      };

      cb(null, data);
      socket.to(chatRoom.id).emit('new-message', data);
      socket.broadcast.emit('new-broadcast-message', data);
    } catch (e) {
      if (e instanceof ApiError) {
        return cb(e.message);
      }
      cb('Error while trying to upload image');
      console.error(e);
    }
  };
};

const onDisconnecting = (socket) => {
  return () => {
    const user = socket.user;
    console.log('user disconnected');
    socket.rooms.forEach((roomId) => {
      if (roomId === socket.id) return;
      socket.to(roomId).emit('user-left', user.name);
    });
  };
};

module.exports = {
  validateUser,
  onJoinChatRoom,
  onLeaveChatRoom,
  onReadMessage,
  onNewMessage,
  onImageSend,
  onDisconnecting,
};
