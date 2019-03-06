const jwt = require('jsonwebtoken');

const User = require('../models/user');

module.exports = async (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    req.isAuth = false;
    return next();
  }

  const token = authHeader.split(' ')[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, 'lifeisstrange');
  } catch (err) {
    req.isAuth = false;
    return next();
  }

  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }

  try {
    req.user = await User.findByPk(decodedToken.userId);
    req.isAuth = true;
    next();
  } catch (err) {
    req.isAuth = false;
    return next();
  }
};
