const routes = require('express').Router();

const chatController = require('../../controllers/chat.controller');
const validate = require('../../middlewares/validate');
const chatValidation = require('../../validations/chat.validation');

routes.get(
  '/rooms',
  validate(chatValidation.getChatRooms),
  chatController.getChatRooms
);
routes.get(
  '/rooms/:roomId',
  validate(chatValidation.getChatMessages),
  chatController.getMessagesByRoom
);

module.exports = routes;
