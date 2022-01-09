const errorHandlerUtils = require('../utils/error-handler');
const Sequelize = require('sequelize');

exports.routesNotExistsHandle = (req, res) => {
  res.status(404).json({ error: 'Page not found' });
};

// eslint-disable-next-line no-unused-vars
exports.errorHandler = (err, req, res, next) => {
  if (err instanceof Sequelize.ValidationError) {
    const errors = errorHandlerUtils.parseValidationErrors(err);
    return res.status(400).json(errors);
  }
  res.sendStatus(500);
  console.error(err);
};
