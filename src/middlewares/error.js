const ApiError = require('../errors/ApiError');
const httpStatus = require('http-status');
const { JsonWebTokenError } = require('jsonwebtoken');
const { ValidationError } = require('sequelize');

const errorParser = require('../utils/error-parser');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    if (err.message)
      return res.status(err.statusCode).json({ error: err.message });
    return res.sendStatus(err.statusCode);
  }

  if (err instanceof JsonWebTokenError) {
    return res.sendStatus(httpStatus.UNAUTHORIZED);
  }

  if (err instanceof ValidationError) {
    const errors = errorParser.parseValidationErrors(err);
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(httpStatus.CONFLICT).json(errors);
    }
    return res.status(httpStatus.BAD_REQUEST).json(errors);
  }

  res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  console.error(err);
};

module.exports = { errorHandler };
