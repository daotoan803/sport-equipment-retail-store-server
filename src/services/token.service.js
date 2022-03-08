const jwt = require('jsonwebtoken');

const TOKEN_KEY = process.env.TOKEN_KEY;

const createToken = (data) => {
  return jwt.sign(data, TOKEN_KEY);
};

const verifyToken = (token) => {
  return jwt.verify(token, TOKEN_KEY);
};

module.exports = {
  createToken,
  verifyToken,
};
