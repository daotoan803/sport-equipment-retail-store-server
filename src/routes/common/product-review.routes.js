const routes = require('express').Router();
const authentication = require('../../middlewares/authentication');
const validate = require('../../middlewares/validate');
const productReviewValidation = require('../../validations/product-review.validation');
const productReviewController = require('../../controllers/product-review.controller');

routes.use('/', authentication.verifyToken);
routes
  .route('/')
  .get(
    validate(productReviewValidation.getReview),
    productReviewController.getReview
  )
  .post(
    validate(productReviewValidation.addReview),
    productReviewController.addReview
  );
  
routes
  .route('/:commentId')
  .put(
    validate(productReviewValidation.editReview),
    productReviewController.editReview
  )
  .delete(productReviewController.deleteReview);

module.exports = routes;
