const routes = require('express').Router();

const chatController = require('../../controllers/chat.controller');

routes.get('/users', chatController.getUserPreviewInfoByNewestChat);

module.exports = routes;
