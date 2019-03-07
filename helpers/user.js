const { dateToString } = require('./date');

exports.handleUser = user => {
  return {
    ...user.dataValues,
    password: null,
    createdAt: dateToString(user.createdAt),
    updatedAt: dateToString(user.updatedAt)
  };
};
