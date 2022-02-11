const Product = require('../../models/product.model');

module.exports = {
  async addProductReview(req, res, next) {
    const { user } = req;
    const { point, review, productId } = req.body;

    try {
      const product = await Product.findByPk(productId);
      if (!product) return res.sendStatus(404);

      const newReview = await product.createReview({
        userId: user.id,
        point,
        review,
      });

      await Product.increment('reviewCount', {
        by: 1,
        where: { id: product.id },
      });
      res.json(newReview);
    } catch (e) {
      next(e);
    }
  },
};
