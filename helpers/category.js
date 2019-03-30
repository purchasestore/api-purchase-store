const Company = require('../models/company');
const { dateToString } = require('./date');
const { handleCompany } = require('./company');

exports.handleCategory = async category => {
  try {
    const company = await Company.findOne({
      where: { id: category.companyId }
    });

    return {
      ...category.dataValues,
      createdAt: dateToString(category.createdAt),
      updatedAt: dateToString(category.updatedAt),
      company: handleCompany(company)
    };
  } catch (err) {
    throw err;
  }
};
