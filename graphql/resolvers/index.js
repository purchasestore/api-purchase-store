const authResolver = require('./auth');
const companyResolver = require('./company');

const rootResolver = {
  ...authResolver,
  ...companyResolver
};

module.exports = rootResolver;
