const Company = require('../models/company');
const { dateToString } = require('./date');
const { handleCompany } = require('./company');

exports.handleCustomer = async customer => {
  try {
    const company = await Company.findOne({
      where: { id: customer.companyId }
    });

    return {
      ...customer.dataValues,
      createdAt: dateToString(customer.createdAt),
      updatedAt: dateToString(customer.updatedAt),
      company: handleCompany(company)
    };
  } catch (err) {
    throw err;
  }
};
