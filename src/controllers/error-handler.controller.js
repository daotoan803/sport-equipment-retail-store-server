const errorHandlerUtils = require('../utils/error-handler');
const Sequelize = require('sequelize');
const jwt = require('jsonwebtoken');

module.exports = {
  routesNotExistsHandle(req, res) {
    res.status(404).json({ error: 'Page not found' });
  },

  // eslint-disable-next-line no-unused-vars
  errorHandler(err, req, res, next) {
    if (err instanceof Sequelize.ValidationError) {
      const errors = errorHandlerUtils.parseValidationErrors(err);
      return res.status(400).json(errors);
    }

    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({ error: 'invalid token' });
    }
    res.sendStatus(500);
    console.error(err);
  },
};
