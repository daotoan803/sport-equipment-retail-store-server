const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const Account = require('../models/account.model');
const ChatRoom = require('../models/chat-room.model');

const sequelizeConnection = require('../models/db-connection');
const ApiError = require('../errors/ApiError');
const httpStatus = require('http-status');

const findUserByEmail = (email, option = {}) => {
  return User.findOne({ where: { email }, ...option });
};

const getUserAccountByUserId = (userId) => {
  return Account.findOne({ where: { userId } });
};

const getUserByChatRoomId = async (chatRoomId) => {
  const chatRoom = await ChatRoom.findByPk(chatRoomId, { include: User });
  if (!chatRoom)
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Chat room not belong to any user'
    );
  return chatRoom.user;
};

const getUserById = async (userId, option = {}) => {
  const user = await User.findByPk(userId, option);
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'userId not exists');
  return user;
};

const createUser = async ({ name, email, dob, gender, password }) => {
  const emailAlreadyTaken = await findUserByEmail(email);
  if (emailAlreadyTaken) {
    throw new ApiError(httpStatus.CONFLICT, 'Email already taken');
  }

  const transaction = await sequelizeConnection.transaction();
  try {
    const user = await User.create(
      { name, email, dob, gender, password },
      { transaction }
    );
    user.account = await user.createAccount({ password }, { transaction });
    await user.createChatRoom({}, { transaction });
    await transaction.commit();
    return user;
  } catch (e) {
    transaction.rollback();
    throw e;
  }
};

const validateLogin = async ({ email, password }) => {
  const user = await findUserByEmail(email, {
    include: Account,
  });
  if (!user)
    throw new ApiError(httpStatus.NOT_FOUND, 'Email not belong to any user');

  const passwordIsCorrect = await bcrypt.compare(
    password,
    user.account.password
  );
  if (!passwordIsCorrect)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Password not correct');

  let role = user.account.role;
  delete user.dataValues.account;

  return { user, role };
};

const changeUserKey = async ({ user, userId }) => {
  let account = null;
  if (user?.account == null) {
    account = await getUserAccountByUserId(userId || user.id);
    if (!account) throw new ApiError(httpStatus.NOT_FOUND, 'userId not exists');
  } else {
    account = user.account;
  }

  account.userKey = Account.generateUserKey();
  await account.save();
};

const validateUserKey = async (userId, userKey) => {
  const user = await User.findByPk(userId, { include: Account });
  if (!user)
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Token not belong to any user');

  if (user.account.userKey !== userKey)
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Token key invalid');

  delete user.dataValues.account;

  return user;
};

const verifyUserHasAdminAuthorization = async (user) => {
  let account = null;
  if (user.account) {
    account = user.account;
  } else {
    account = await user.getAccount();
  }

  if (account.role !== Account.role.admin) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'Only admin have access to this functionality'
    );
  }
};

module.exports = {
  getUserById,
  createUser,
  findUserByEmail,
  getUserAccountByUserId,
  validateLogin,
  changeUserKey,
  validateUserKey,
  verifyUserHasAdminAuthorization,
  getUserByChatRoomId,
};
