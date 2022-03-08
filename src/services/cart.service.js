const Cart = require('../models/cart.model');
const productService = require('../services/product.service');

/**
 * If product not in user's cart, add it to user's cart. Else, increase the quantity
 * @param  {string} userId
 * @param  {string | number} productId
 * @param  {number} quantity
 */
const addProductToCartOrUpdateQuantity = async (
  userId,
  productId,
  quantity = 1
) => {
  await productService.findProductById(productId);
  const productInUserCart = await Cart.findOne({
    where: { userId, productId },
  });
  if (productInUserCart) {
    return productInUserCart.increment('quantity', { by: quantity });
  }
  return Cart.create({
    userId,
    productId,
    quantity: quantity,
  });
};

const updateProductInCartQuantity = async (userId, productId, quantity) => {
  await productService.findProductById(productId);
  if (quantity === 0) {
    await Cart.destroy({ where: { userId, productId } });
    return;
  }
  await Cart.update({ quantity }, { where: { userId, productId } });
};

const getProductsInUserCart = async (user) => {
  const cart = await user.getProducts({
    attributes: [
      'id',
      'title',
      'price',
      'discountPrice',
      'state',
      'mainImageUrl',
    ],
  });

  return cart.map((product) => {
    const quantity = product.cart.quantity;
    const tempProduct = { ...product.dataValues };
    delete tempProduct.cart;
    return {
      ...tempProduct,
      quantity,
    };
  });
};

module.exports = {
  addProductToCartOrUpdateQuantity,
  updateProductInCartQuantity,
  getProductsInUserCart,
};
