const User = require('../models/user.model');
const Account = require('../models/account.model');
const bcrypt = require('bcrypt');

const generateAuthorizationFunction = (role) => {
  return async (req, res, next) => {
    const userAccount = req.userAccount;
    if (userAccount.role !== role) return res.sendStatus(403);

    next();
  };
};

module.exports = {
  async getUserAndUserAccountByEmail(req, res, next) {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({
        error: "Email can't be empty",
      });

    try {
      const user = await User.findOne({ where: { email }, include: Account });
      if (!user)
        return res.status(400).json({ error: 'invalid email or password' });

      req.userAccount = user.account;
      req.user = user;
      next();
    } catch (e) {
      next(e);
    }
  },

  async validateUserAccountPassword(req, res, next) {
    const { userAccount } = req;
    const { password } = req.body;

    const passwordIsCorrect = await bcrypt.compare(
      password,
      userAccount.password
    );

    if (!passwordIsCorrect) {
      return res.status(400).json({ error: 'invalid email or password' });
    }

    next();
  },

  async validateAccessTokenAndGetUserAccount(req, res, next) {
    try {
      const authorization = req.headers?.authorization;
      const token = authorization?.split(/^(Bearer )/i)[2];
      if (!token) return res.sendStatus(401);

      const user = await User.validateTokenAndGetUser(token);
      if (!user) return res.sendStatus(401);

      req.user = user;
      req.userAccount = user.account;
      next();
    } catch (e) {
      next(e);
    }
  },

  checkAdminAuthorization: generateAuthorizationFunction(Account.role.admin),
};
