const Joi = require('joi');

const getBrands = {
  query: Joi.object({
    categoryCode: Joi.string(),
    categoryGroupCode: Joi.string(),
  }).without('categoryCode', 'categoryGroupCode'),
};

const addBrand = {
  body: Joi.object({
    name: Joi.string().trim().min(1).max(254).required(),
  }),
};

const updateBrand = {
  body: Joi.object({
    name: Joi.string().trim().min(1).max(254).required(),
  }),
};

module.exports = {
  getBrands,
  addBrand,
  updateBrand,
};
