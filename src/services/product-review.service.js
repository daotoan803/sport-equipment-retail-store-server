const httpStatus = require('http-status');
const ProductReview = require('../models/product-review.model');
const productService = require('./product.service');
const ApiError = require('../errors/ApiError');

const generateProductReviewFilterOption = ({
  productId,
  point,
  page,
  limit,
}) => {
  const option = {};
  option.where = { productId };
  if (point) option.where.point = point;
  if (page && limit) {
    option.offset = page * limit;
    option.limit = limit;
  }
  return option;
};

const findReviewById = async (reviewId) => {
  const review = await ProductReview.findByPk(reviewId);
  if (!review)
    throw new ApiError(httpStatus.NOT_FOUND, "Product'review not exists");
  return review;
};

const checkProductReviewBelongToUser = (productReview, userId) => {
  if (productReview.userId !== userId) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "User don't have permission to edit this review"
    );
  }
};

const getProductReviews = async (productId, { point, page, limit }) => {
  const option = generateProductReviewFilterOption({
    productId,
    point,
    page,
    limit,
  });
  const reviews = await ProductReview.findAll(option);
  if (!reviews) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product id not exists');
  }
  return reviews;
};

const createReview = async (userId, productId, { point, review }) => {
  const product = await productService.findProductById(productId);
  const productReview = await product.createProductReview({
    userId,
    point,
    review,
  });
  return productReview;
};

const editReview = async (reviewId, userId, { point, review }) => {
  const productReview = await findReviewById(reviewId);
  checkProductReviewBelongToUser(productReview, userId);
  productReview.point = point;
  productReview.review = review;
  return productReview.save();
};

const deleteReview = async (reviewId, userId) => {
  const productReview = await findReviewById(reviewId);
  checkProductReviewBelongToUser(productReview, userId);
  await productReview.destroy();
};

module.exports = {
  getProductReviews,
  createReview,
  editReview,
  deleteReview,
};
