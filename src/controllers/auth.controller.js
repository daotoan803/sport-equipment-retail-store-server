const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

exports.signin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password can't be empty" });

  try {
    const user = await User.validateLoginAndGetUser(email, password);
    if (!user)
      return res.status(400).json({ error: 'invalid email or password' });

    const TOKEN_KEY = process.env.TOKEN_KEY;
    const token = jwt.sign({ userId: user.id }, TOKEN_KEY);
    res.json({ token });
  } catch (e) {
    next(e);
  }
};
