const routes = require('express').Router();

const chatController = require('../../../controllers/chat.controller');
const validate = require('../../../middlewares/validate');
const chatValidation = require('../../../validations/chat.validation');

routes.get(
  '/',
  validate(chatValidation.getChatMessages),
  chatController.getMessagesByUser
);

module.exports = routes;
