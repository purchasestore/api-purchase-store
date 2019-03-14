const User = require('../models/user');
const { dateToString } = require('./date');
const { handleUser } = require('./user');

exports.handleCompany = async company => {
  try {
    const user = await User.findOne({ where: { id: company.userId } });

    return {
      ...company.dataValues,
      createdAt: dateToString(company.createdAt),
      updatedAt: dateToString(company.updatedAt),
      user: handleUser(user)
    };
  } catch (err) {
    throw err;
  }
};
