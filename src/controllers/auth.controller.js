const jwt = require('jsonwebtoken');
const Account = require('../models/account.model');

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
      return res.json({ token, role });
    }
    res.json({ token });
  },
};
