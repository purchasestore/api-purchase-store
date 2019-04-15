const Sequelize = require('sequelize');
const validator = require('validator');

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
    const errors = [];

    if (!user) {
      const error = new Error('Não autenticado.');
      error.code = 401;
      throw error;
    }

    if (validator.isEmpty(name)) {
      errors.push({ message: 'Nome inválido.' });
    }

    if (
      validator.isEmpty(cnpj) ||
      !validator.isLength(cnpj.replace(/\D/g, ''), { min: 14, max: 14 })
    ) {
      errors.push({ message: 'CNPJ inválido.' });
    }

    if (errors.length > 0) {
      const error = new Error('Dados inválidos.');
      error.data = errors;
      error.code = 422;
      throw error;
    }

    try {
      const existingCompany = await Company.findOne({
        where: { cnpj: cnpj, userId: user.id }
      });

      if (existingCompany) {
        const error = new Error('Empresa com CNPJ informado já existe.');
        error.code = 422;
        throw error;
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
    const errors = [];

    if (!user) {
      const error = new Error('Não autenticado.');
      error.code = 401;
      throw error;
    }

    if (validator.isEmpty(name)) {
      errors.push({ message: 'Nome inválido.' });
    }

    if (
      validator.isEmpty(cnpj) ||
      !validator.isLength(cnpj.replace(/\D/g, ''), { min: 14, max: 14 })
    ) {
      errors.push({ message: 'CNPJ inválido.' });
    }

    if (errors.length > 0) {
      const error = new Error('Dados inválidos.');
      error.data = errors;
      error.code = 422;
      throw error;
    }

    try {
      const company = await Company.findOne({
        where: { id: id, userId: user.id }
      });

      if (!company) {
        const error = new Error('Empresa não encontrada.');
        error.code = 404;
        throw error;
      }

      const existingCompany = await Company.findOne({
        where: {
          [Op.and]: [
            { cnpj: cnpj, userId: user.id },
            { cnpj: { [Op.ne]: company.cnpj } }
          ]
        }
      });

      if (existingCompany) {
        const error = new Error('Empresa com CNPJ informado já existe.');
        error.code = 422;
        throw error;
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
      const error = new Error('Não autenticado.');
      error.code = 401;
      throw error;
    }

    try {
      const company = await Company.findOne({
        where: { id: id, userId: user.id }
      });

      if (!company) {
        const error = new Error('Empresa não encontrada.');
        error.code = 404;
        throw error;
      }

      return !!company.destroy();
    } catch (err) {
      throw err;
    }
  },
  company: async ({ id }, req) => {
    const user = req.user;

    if (!user) {
      const error = new Error('Não autenticado.');
      error.code = 401;
      throw error;
    }

    try {
      const company = await Company.findOne({
        where: { id: id, userId: user.id }
      });

      if (!company) {
        const error = new Error('Empresa não encontrada.');
        error.code = 404;
        throw error;
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
