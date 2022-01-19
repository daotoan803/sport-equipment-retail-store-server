const Joi = require('joi');
const User = require('../../models/user.model');
const { responseValidationError } = require('../../utils/validator.util');

module.exports = {
  validateUserSignup(req, res, next) {
    // prettier-ignore
    const userSignupSchema = Joi.object({
      name: Joi.string()
        .min(1)
        .max(254)
        .required(),
      dob: Joi.date()
        .max('now')
        .required(),
      gender: Joi.string()
        .equal(...Object.values(User.gender))
        .required(),
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .min(4)
        .max(200)
        .required(),
    });

    const { name, email, dob, gender, password } = req.body;
    const result = userSignupSchema.validate(
      {
        name: name.trim(),
        email: email.trim(),
        dob,
        gender,
        password: password.trim(),
      },
      { abortEarly: false }
    );

    if (result.error) {
      return responseValidationError(res, result.error);
    }
    next();
  },
};
