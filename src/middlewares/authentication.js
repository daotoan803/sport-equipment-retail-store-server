const tokenService = require('../services/token.service');
const userService = require('../services/user.service');
const handleError = require('../utils/handle-error');
const ApiError = require('../errors/ApiError');

const httpStatus = require('http-status');

const verifyToken = handleError(async (req, res, next) => {
  if (!req.headers.authorization) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Missing authorization header');
  }

  const token = req.headers.authorization.split(' ')[1];
  const { userId, userKey } = tokenService.verifyToken(token);
  const user = await userService.validateUserKey(userId, userKey);
  req.user = user;
  next();
});

const verifyAdminAuthorization = handleError(async (req, res, next) => {
  const user = req.user;
  await userService.verifyUserHasAdminAuthorization(user);
  next();
});

module.exports = {
  verifyToken,
  verifyAdminAuthorization,
};
