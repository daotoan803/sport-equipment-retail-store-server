const jwt = require('jsonwebtoken');
const Account = require('../../models/account.model');

module.exports = {
  createAccessToken(req, res) {
    const { user } = req;
    const TOKEN_KEY = process.env.TOKEN_KEY;
    const token = jwt.sign(
      { userId: user.id, userKey: user.account.userKey },
      TOKEN_KEY
    );
    if (user.account.role !== Account.role.customer) {
      const role = user.account.role;
      return res.json({
        token,
        role,
        user: { id: user.id, name: user.name, avatarUrl: user.avatarUrl },
      });
    }
    res.json({
      token,
      user: { id: user.id, name: user.name, avatarUrl: user.avatarUrl },
    });
  },

  async logoutEveryWhere(req, res) {
    const userAccount = req.userAccount;

    userAccount.userKey = Account.generateUserKey();
    await userAccount.save();
    res.sendStatus(200);
  },
};
