const Joi = require('joi');
const Product = require('../models/product.model');

const getProducts = {
  query: Joi.object({
    sortBy: Joi.string().equal(...Object.keys(Product.sortOptions)),
    page: Joi.number().min(1),
    limit: Joi.number().min(0),
    categoryGroupCode: Joi.string(),
    categoryCode: Joi.string(),
    brandId: Joi.alternatives(Joi.string(), Joi.number()),
  })
    .without('categoryGroupCode', 'categoryCode')
    .with('page', 'limit'),
};

const getProductDetail = {
  params: Joi.object({
    productId: Joi.alternatives(
      Joi.string().required(),
      Joi.number().required()
    ),
  }),
};

const addProduct = {
  body: Joi.object({
    title: Joi.string().min(4).max(101).required(),
    detail: Joi.string().min(1).required(),
    price: Joi.number().min(0).required(),
    discountPrice: Joi.number().min(0).max(Joi.ref('price')),
    warrantyPeriodByDay: Joi.number().min(0).required(),
    availableQuantity: Joi.number().min(0).required(),
    state: Joi.string().equal(...Object.values(Product.state)).required(),
    brandId: Joi.string().required(),
    categoryId: Joi.string().required(),
  }),
  files: Joi.object({
    images: Joi.array(),
    mainImage: Joi.array().min(1).required(),
  }),
};

const addPreviewImages = {
  params: Joi.object({
    productId: Joi.string().required(),
  }),
  files: Joi.array().label('images').min(1).required(),
};

const checkProductTitleIsUnique = {
  body: Joi.object({
    title: Joi.string().min(4).max(101).required(),
  }),
};

const updateProduct = {
  body: Joi.object({
    title: Joi.string().min(4).max(101).required(),
    detail: Joi.string().min(1).required(),
    price: Joi.number().min(0).required(),
    discountPrice: Joi.number().min(0).max(Joi.ref('price')),
    warrantyPeriodByDay: Joi.number().min(0).required(),
    availableQuantity: Joi.number().min(0).required(),
    state: Joi.string().equal(...Object.values(Product.state)).required(),
    brandId: Joi.string().required(),
    categoryId: Joi.string().required(),
    removeImageIds: Joi.array().items(Joi.number()),
  }),
};

module.exports = {
  getProducts,
  getProductDetail,
  addProduct, 
  addPreviewImages,
  checkProductTitleIsUnique,
  updateProduct,
};
