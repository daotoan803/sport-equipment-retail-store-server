const User = require('../models/user.model');
const { ValidationError } = require('sequelize');
const errorHandler = require('../utils/error-handler');

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
    res.status(200).json(user.toJSON());
  } catch (e) {
    if (e instanceof ValidationError) {
      const errors = errorHandler.parseValidationErrors(e);
      return res.status(400).json(errors);
    }
    next(e);
  }
};
