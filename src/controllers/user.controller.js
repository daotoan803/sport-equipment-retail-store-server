const handleError = require('../utils/handle-error');
const tokenService = require('../services/token.service');
const userService = require('../services/user.service');
const httpStatus = require('http-status');

const createTokenWithUserInfo = async (user) => {
  let account = null;
  if (user.account?.userKey) account = user.account;
  else account = await userService.getUserAccountByUserId(user.id);
  return tokenService.createToken({
    userId: user.id,
    userKey: account.userKey,
  });
};

const signup = handleError(async (req, res) => {
  const user = await userService.createUser(req.body);
  const token = await createTokenWithUserInfo(user);
  return res.json({ user, token });
});

const login = handleError(async (req, res) => {
  const { user, role } = await userService.validateLogin(req.body);
  const token = await createTokenWithUserInfo(user);
  return res.json({ user, token, role });
});

const logoutAll = handleError(async (req, res) => {
  const user = req.user;
  await userService.changeUserKey({ user });
  return res.sendStatus(httpStatus.OK);
});

const checkToken = handleError((req, res) => {
  return res.sendStatus(httpStatus.NO_CONTENT);
});

const getUserDetail = handleError(async (req, res) => {
  const user = req.user;
  return res.json({ user });
});

const findUserDetail = handleError(async (req, res) => {
  const { userId } = req.params;
  const user = await userService.getUserById(userId);
  res.json({ user });
});

module.exports = {
  signup,
  login,
  logoutAll,
  checkToken,
  getUserDetail,
  findUserDetail,
};
