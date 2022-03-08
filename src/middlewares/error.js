const ApiError = require('../errors/ApiError');
const httpStatus = require('http-status');
const { JsonWebTokenError } = require('jsonwebtoken');
const { ValidationError } = require('sequelize');

const errorUtil = require('../utils/error.util');

const deleteUploadedFiles = (req) => {
  const filesNeedToBeDelete = [];
  if (req.files) {
    if (Array.isArray(req.files)) {
      filesNeedToBeDelete.push(...req.files);
      return;
    } else if (typeof req.files === 'object') {
      Object.values(req.files).forEach((entry) => {
        if (Array.isArray(entry)) return filesNeedToBeDelete.push(...entry);
        filesNeedToBeDelete.push(entry);
      });
    }
  }
  if (req.file) filesNeedToBeDelete.push(req.file);
  errorUtil.deleteUploadedFiles(filesNeedToBeDelete);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (req.files || req.file) {
    deleteUploadedFiles(req);
  }

  if (err instanceof ApiError) {
    if (err.message)
      return res.status(err.statusCode).json({ error: err.message });
    return res.sendStatus(err.statusCode);
  }

  if (err instanceof JsonWebTokenError) {
    return res.sendStatus(httpStatus.UNAUTHORIZED);
  }

  if (err instanceof ValidationError) {
    const errors = errorUtil.parseValidationErrors(err);
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(httpStatus.CONFLICT).json(errors);
    }
    return res.status(httpStatus.BAD_REQUEST).json(errors);
  }

  res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  console.error(err);
};

module.exports = { errorHandler };
