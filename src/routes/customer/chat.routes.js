const routes = require('express').Router();

const chatController = require('../../controllers/chat.controller');

routes.get('/chat', chatController.getUserChatMessage);

module.exports = routes;
