const Joi = require('joi');
const User = require('../models/user.model');
const Account = require('../models/account.model');

// prettier-ignore
const userSchema = Joi.object({
  name: Joi
    .string()
    .min(1)
    .max(254)
    .required(),
  dob: Joi.date()
    .max('now')
    .required(),
  phoneNumber: Joi
    .string()
    .regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/),
  gender: Joi
    .string()
    .equal(...Object.values(User.gender))
    .required(),
  email: Joi
    .string()
    .email()
    .required(),
  address: Joi
    .string()
    .min(1)
    .max(254)
});

//prettier-ignore
const accountSchema = Joi.object({
  password: Joi.string()
    .min(4)
    .max(200)
    .required(),
  role: Joi.string()
    .equal(...Object.values(Account.role))
})

const formatValidationError = (errors) => {
  return errors.map((err) => ({
    field: err.context.key,
    message: err.message,
    received: err.context.value,
  }));
};

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
        email,
        dob,
        gender,
        password: password.trim(),
      },
      { abortEarly: false }
    );

    if (result.error) {
      const details = result.error.details;
      const errors = formatValidationError(details);
      return res.status(400).json(errors);
    }
    next();
  },
};
