const httpStatus = require('http-status');
const cartService = require('../services/cart.service');
const handleError = require('../utils/handle-error');

const addProductToCartOrUpdateQuantity = handleError(async (req, res) => {
  const user = req.user;
  const { productId, quantity } = req.body;
  await cartService.addProductToCartOrUpdateQuantity(
    user.id,
    productId,
    quantity
  );
  res.sendStatus(httpStatus.CREATED);
});

const updateProductInCartQuantity = handleError(async (req, res) => {
  const user = req.user;
  const { productId, quantity } = req.body;
  await cartService.updateProductInCartQuantity(user.id, productId, quantity);
  res.sendStatus(httpStatus.NO_CONTENT);
});

const getProductsInCart = handleError(async (req, res) => {
  const cart = await cartService.getProductsInUserCart(req.user);
  res.json({ cart });
});

module.exports = {
  addProductToCartOrUpdateQuantity,
  updateProductInCartQuantity,
  getProductsInCart,
};
