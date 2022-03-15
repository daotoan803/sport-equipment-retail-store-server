const Cart = require('../models/cart.model');
const productService = require('../services/product.service');
const Product = require('../models/product.model');

const checkProductInUserCart = async (cart) => {
  let hasChange = false;
  await Promise.all(
    cart.map((productInCart) => {
      if (productInCart.state !== Product.state.available) {
        hasChange = true;
        return productInCart.destroy();
      } else if (
        productInCart.availableQuantity < productInCart.cart.quantity
      ) {
        hasChange = true;
        return Cart.update(
          { quantity: productInCart.availableQuantity },
          {
            where: {
              userId: productInCart.cart.userId,
              productId: productInCart.id,
            },
          }
        );
      }
    })
  );

  return hasChange;
};

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
  quantity = quantity > 0 ? quantity : 1;
  const product = await productService.findProductById(productId);
  quantity = Math.min(quantity, product.availableQuantity);
  const productInUserCart = await Cart.findOne({
    where: { userId, productId },
  });
  if (productInUserCart) {
    return productInUserCart.increment('quantity', {
      by: quantity,
    });
  }
  return Cart.create({
    userId,
    productId,
    quantity,
  });
};

const updateProductInCartQuantity = async (userId, productId, quantity) => {
  const product = await productService.findProductById(productId);

  const productInCart = await Cart.findOne({ where: { userId, productId } });
  if (!productInCart)
    return addProductToCartOrUpdateQuantity(userId, productId, quantity);

  if (quantity === 0) {
    await Cart.destroy({ where: { userId, productId } });
    return;
  }
  quantity = Math.min(quantity, product.availableQuantity);
  await Cart.update({ quantity }, { where: { userId, productId } });
};

const getProductsInUserCart = async (user) => {
  let cart = await user.getCart();

  const hasChange = await checkProductInUserCart(cart);
  if (hasChange) {
    cart = await user.getCart();
  }

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
