const authResolver = require('./auth');
const companyResolver = require('./company');
const supplierResolver = require('./supplier');

const rootResolver = {
  ...authResolver,
  ...companyResolver,
  ...supplierResolver
};

module.exports = rootResolver;
