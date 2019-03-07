const Sequelize = require('sequelize');

const Company = require('../../models/company');
const { dateToString } = require('../../helpers/date');
const { handleUser } = require('../../helpers/user');

const Op = Sequelize.Op;

module.exports = {
  createCompany: async ({ companyInput }, req) => {
    const name = companyInput.name;
    const trade = companyInput.trade;
    const cnpj = companyInput.cnpj;
    const user = req.user;

    if (!user) {
      throw new Error('Não autenticado.');
    }

    try {
      const existingCompany = await Company.findOne({ where: { cnpj: cnpj } });

      if (existingCompany) {
        throw new Error('Empresa com CNPJ inserido já existe.');
      }

      const company = await Company.create({
        name: name,
        trade: trade,
        cnpj: cnpj,
        userId: user.id
      });

      return {
        ...company.dataValues,
        createdAt: dateToString(company.createdAt),
        updatedAt: dateToString(company.updatedAt),
        user: handleUser(user)
      };
    } catch (err) {
      throw err;
    }
  },
  updateCompany: async ({ id, companyInput }, req) => {
    const name = companyInput.name;
    const trade = companyInput.trade;
    const cnpj = companyInput.cnpj;
    const user = req.user;

    if (!user) {
      throw new Error('Não autenticado.');
    }

    try {
      const company = await Company.findOne({
        where: { id: id, userId: user.id }
      });

      if (!company) {
        throw new Error('Não autorizado.');
      }

      const existingCompany = await Company.findOne({
        where: {
          [Op.and]: [{ cnpj: cnpj }, { cnpj: { [Op.ne]: company.cnpj } }]
        }
      });

      if (existingCompany) {
        throw new Error('Empresa com CNPJ inserido já existe.');
      }

      company.name = name;
      company.trade = trade;
      company.cnpj = cnpj;

      const updatedCompany = await company.save();

      return {
        ...updatedCompany.dataValues,
        createdAt: dateToString(updatedCompany.createdAt),
        updatedAt: dateToString(updatedCompany.updatedAt),
        user: handleUser(user)
      };
    } catch (err) {
      throw err;
    }
  },
  deleteCompany: async ({ id }, req) => {
    const user = req.user;

    if (!user) {
      throw new Error('Não autenticado.');
    }

    try {
      const company = await Company.findOne({
        where: { id: id, userId: user.id }
      });

      if (!company) {
        throw new Error('Não autorizado.');
      }

      return !!company.destroy();
    } catch (err) {
      throw err;
    }
  },
  company: async ({ id }, req) => {
    const user = req.user;

    if (!user) {
      throw new Error('Não autenticado.');
    }

    try {
      const company = await Company.findOne({
        where: { id: id, userId: user.id }
      });

      if (!company) {
        throw new Error('Não autorizado.');
      }

      return {
        ...company.dataValues,
        createdAt: dateToString(company.createdAt),
        updatedAt: dateToString(company.updatedAt),
        user: handleUser(user)
      };
    } catch (err) {
      throw err;
    }
  }
};
