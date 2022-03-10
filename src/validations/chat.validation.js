const Joi = require('joi');

const getChatRooms = {
  query: Joi.object({
    page: Joi.number().min(1),
    limit: Joi.number().min(1),
  }).with('page', 'limit'),
};

const getChatMessages = {
  query: Joi.object({
    page: Joi.number().min(1),
    limit: Joi.number().min(1),
  }).with('page', 'limit'),
};

module.exports = {
  getChatRooms,
  getChatMessages,
};
