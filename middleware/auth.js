const jwt = require('jsonwebtoken');

const User = require('../models/user');

module.exports = async (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    req.user = undefined;
    return next();
  }

  const token = authHeader.split(' ')[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, 'lifeisstrange');
  } catch (err) {
    req.user = undefined;
    return next();
  }

  if (!decodedToken) {
    req.user = undefined;
    return next();
  }

  try {
    req.user = await User.findByPk(decodedToken.userId);
    next();
  } catch (err) {
    req.user = undefined;
    return next();
  }
};
