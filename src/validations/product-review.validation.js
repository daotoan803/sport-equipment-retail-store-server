const Joi = require('joi');

const getProductReviews = {
  query: Joi.object({
    point: Joi.number().min(1).max(5),
    page: Joi.number().min(1),
    limit: Joi.number().min(1),
  }),
};

const addReview = {
  body: Joi.object({
    point: Joi.number().min(1).max(5).required(),
    review: Joi.string().trim().required(),
  }),
};

module.exports = {
  getProductReviews,
  addReview,
};
