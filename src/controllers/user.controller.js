const User = require('../models/user.model');

exports.signup = async (req, res, next) => {
  const { name, email, dob, gender, password } = req.body;
  try {
    const isEmailExists = await User.isEmailAlreadyExist(email);
    if (isEmailExists)
      return res.status(409).json({ error: 'Email already exists' });
    const user = await User.signupUser({
      name,
      email,
      dob,
      gender,
      password,
    });
    req.user = user;
    next();
  } catch (e) {
    next(e);
  }
};
