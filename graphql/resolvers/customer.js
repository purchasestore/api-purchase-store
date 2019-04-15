const validator = require('validator');

const Company = require('../../models/company');
const Customer = require('../../models/customer');
const { dateToString } = require('../../helpers/date');
const { handleCompany } = require('../../helpers/company');

module.exports = {
  createCustomer: async ({ customerInput }, req) => {
    const name = customerInput.name;
    const email = customerInput.email;
    const cellphone = customerInput.cellphone;
    const companyId = customerInput.company;
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

    if (!validator.isEmail(email)) {
      errors.push({ message: 'E-mail inválido.' });
    }

    if (validator.isEmpty(cellphone)) {
      errors.push({ message: 'Celular inválido.' });
    }

    if (errors.length > 0) {
      const error = new Error('Dados inválidos.');
      error.data = errors;
      error.code = 422;
      throw error;
    }

    try {
      const company = await Company.findOne({
        where: { id: companyId, userId: user.id }
      });

      if (!company) {
        const error = new Error('Empresa inválida.');
        error.code = 422;
        throw error;
      }

      const customer = await Customer.create({
        name: name,
        email: email,
        cellphone: cellphone,
        companyId: companyId
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
  },
  updateCustomer: async ({ id, customerInput }, req) => {
    const name = customerInput.name;
    const email = customerInput.email;
    const cellphone = customerInput.cellphone;
    const companyId = customerInput.company;
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

    if (!validator.isEmail(email)) {
      errors.push({ message: 'E-mail inválido.' });
    }

    if (validator.isEmpty(cellphone)) {
      errors.push({ message: 'Celular inválido.' });
    }

    if (errors.length > 0) {
      const error = new Error('Dados inválidos.');
      error.data = errors;
      error.code = 422;
      throw error;
    }

    try {
      const company = await Company.findOne({
        where: { id: companyId, userId: user.id }
      });

      if (!company) {
        const error = new Error('Empresa inválida.');
        error.code = 422;
        throw error;
      }

      const customer = await Customer.findOne({
        where: { id: id, companyId: company.id }
      });

      if (!customer) {
        const error = new Error('Cliente não encontrado.');
        error.code = 404;
        throw error;
      }

      customer.name = name;
      customer.email = email;
      customer.cellphone = cellphone;

      const updatedCustomer = await customer.save();

      return {
        ...updatedCustomer.dataValues,
        createdAt: dateToString(updatedCustomer.createdAt),
        updatedAt: dateToString(updatedCustomer.updatedAt),
        company: handleCompany(company)
      };
    } catch (err) {
      throw err;
    }
  },
  deleteCustomer: async ({ id, companyId }, req) => {
    const user = req.user;

    if (!user) {
      const error = new Error('Não autenticado.');
      error.code = 401;
      throw error;
    }

    try {
      const company = await Company.findOne({
        where: { id: companyId, userId: user.id }
      });

      if (!company) {
        const error = new Error('Empresa inválida.');
        error.code = 422;
        throw error;
      }

      const customer = await Customer.findOne({
        where: { id: id, companyId: company.id }
      });

      if (!customer) {
        const error = new Error('Cliente não encontrado.');
        error.code = 404;
        throw error;
      }

      return !!customer.destroy();
    } catch (err) {
      throw err;
    }
  },
  customers: async ({ companyId }, req) => {
    const user = req.user;

    if (!user) {
      const error = new Error('Não autenticado.');
      error.code = 401;
      throw error;
    }

    try {
      const company = await Company.findOne({
        where: { id: companyId, userId: user.id }
      });

      if (!company) {
        const error = new Error('Empresa inválida.');
        error.code = 422;
        throw error;
      }

      const customers = await Customer.findAll({
        where: { companyId: company.id }
      });

      return customers.map(customer => ({
        ...customer.dataValues,
        createdAt: dateToString(customer.createdAt),
        updatedAt: dateToString(customer.updatedAt),
        company: handleCompany(company)
      }));
    } catch (err) {
      throw err;
    }
  },
  customer: async ({ id, companyId }, req) => {
    const user = req.user;

    if (!user) {
      const error = new Error('Não autenticado.');
      error.code = 401;
      throw error;
    }

    try {
      const company = await Company.findOne({
        where: { id: companyId, userId: user.id }
      });

      if (!company) {
        const error = new Error('Empresa inválida.');
        error.code = 422;
        throw error;
      }

      const customer = await Customer.findOne({
        where: { id: id, companyId: company.id }
      });

      if (!customer) {
        const error = new Error('Cliente não encontrado.');
        error.code = 404;
        throw error;
      }

      return {
        ...customer.dataValues,
        createdAt: dateToString(customer.createdAt),
        updatedAt: dateToString(customer.updatedAt),
        company: handleCompany(company)
      };
    } catch (err) {
      throw err;
    }
  }
};
