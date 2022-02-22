const routes = require('express').Router();

const adminUserController = require('../../controllers/admin/user.controller');

routes.get('/find', adminUserController.findUserInfoByUserIdOrChatRoomId);

module.exports = routes;
