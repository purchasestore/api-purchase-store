const Company = require('../models/company');
const { dateToString } = require('./date');
const { handleCompany } = require('./company');

exports.handleSupplier = async supplier => {
  try {
    const company = await Company.findOne({
      where: { id: supplier.companyId }
    });

    return {
      ...supplier.dataValues,
      createdAt: dateToString(supplier.createdAt),
      updatedAt: dateToString(supplier.updatedAt),
      company: handleCompany(company)
    };
  } catch (err) {
    throw err;
  }
};
