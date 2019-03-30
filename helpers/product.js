const Company = require('../models/company');
const Category = require('../models/category');
const { dateToString } = require('./date');
const { handleCompany } = require('./company');
const { handleCategory } = require('./category');

exports.handleProduct = async product => {
  try {
    const company = await Company.findOne({
      where: { id: product.companyId }
    });

    const category = await Category.findOne({
      where: { id: product.categoryId }
    });

    return {
      ...product.dataValues,
      createdAt: dateToString(product.createdAt),
      updatedAt: dateToString(product.updatedAt),
      company: handleCompany(company),
      category: handleCategory(category)
    };
  } catch (err) {
    throw err;
  }
};
