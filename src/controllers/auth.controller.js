const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const Account = require('../models/account.model');

exports.signin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password can't be empty" });

  try {
    const user = await User.validateLoginAndGetUser(email, password);
    if (!user)
      return res.status(400).json({ error: 'invalid email or password' });

    req.user = user;
    next();
  } catch (e) {
    next(e);
  }
};

exports.createAccessToken = (req, res, next) => {
  const { user } = req;
  if (!user || !user.account)
    return next(new Error('Missing user or user account in create access token'));
  const TOKEN_KEY = process.env.TOKEN_KEY;
  const token = jwt.sign({ userId: user.id }, TOKEN_KEY);
  if (user.account.role !== Account.role.customer) {
    role = user.account.role;
    return res.json({ token, role });
  }
  res.json({ token });
};
