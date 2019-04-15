const Product = require('../models/product');
const { dateToString } = require('./date');
const { handleProduct } = require('./product');

exports.handlePurchaseItems = async purchaseItems => {
  try {
    return purchaseItems.map(async item => {
      const product = await Product.findOne({
        where: { id: item.productId }
      });

      return {
        ...item.dataValues,
        createdAt: dateToString(item.createdAt),
        updatedAt: dateToString(item.updatedAt),
        product: handleProduct(product)
      };
    });
  } catch (err) {
    throw err;
  }
};
