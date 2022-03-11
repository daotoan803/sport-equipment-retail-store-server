const httpStatus = require('http-status');
const productReviewService = require('../services/product-review.service');
const handleError = require('../utils/handle-error');

const getProductReviews = handleError(async (req, res) => {
  const { productId } = req.params;
  const reviews = await productReviewService.getProductReviews(
    productId,
    req.query
  );
  res.json({ reviews });
});

const addReview = handleError(async (req, res) => {
  const user = req.user;
  const productId = req.params.productId;

  console.log(req.params);

  const review = await productReviewService.createReview(
    user.id,
    productId,
    req.body
  );
  res.json({ review });
});

const editReview = handleError(async (req, res) => {
  const user = req.user;
  const { reviewId } = req.params;

  const review = await productReviewService.editReview(
    reviewId,
    user.id,
    req.body
  );
  res.json({ review });
});

const deleteReview = handleError(async (req, res) => {
  const user = req.user;
  const { reviewId } = req.params;
  await productReviewService.deleteReview(reviewId, user.id);
  res.sendStatus(httpStatus.NO_CONTENT);
});

module.exports = {
  getProductReviews,
  addReview,
  editReview,
  deleteReview,
};
