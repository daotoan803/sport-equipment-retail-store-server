const routes = require('express').Router();

const chatController = require('../../controllers/chat.controller');

routes.get('/users', chatController.getUserPreviewInfoByNewestChat);
routes.get('/room/:chatRoomId', chatController.getChatMessageByRoomId);

module.exports = routes;
