const Joi = require('joi');

const getCategories = {
  query: Joi.object({
    brandId: Joi.alternatives(Joi.string(), Joi.number()),
    categoryGroupCode: Joi.string(),
  }).without('brandId', 'categoryGroupCode'),
};

const addCategory = {
  body: Joi.object({
    name: Joi.string().min(1).max(254).required(),
    categoryGroupId: Joi.alternatives(Joi.string(), Joi.number()).required(),
  }),
};

const addCategoryGroup = {
  body: Joi.object({
    name: Joi.string().min(1).max(254).required(),
  }),
};

module.exports = {
  getCategories,
  addCategory,
  addCategoryGroup,
};
