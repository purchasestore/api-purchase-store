const authResolver = require('./auth');
const companyResolver = require('./company');
const supplierResolver = require('./supplier');
const customerResolver = require('./customer');
const categoryResolver = require('./category');
const productResolver = require('./product');
const purchaseResolver = require('./purchase');
const saleResolver = require('./sale');

const rootResolver = {
  ...authResolver,
  ...companyResolver,
  ...supplierResolver,
  ...customerResolver,
  ...categoryResolver,
  ...productResolver,
  ...purchaseResolver,
  ...saleResolver
};

module.exports = rootResolver;
