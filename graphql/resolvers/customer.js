const Company = require('../../models/company');
const Customer = require('../../models/customer');
const { dateToString } = require('../../helpers/date');
const { handleCompany } = require('../../helpers/company');

module.exports = {
  createCustomer: async ({ customerInput }, req) => {
    const name = customerInput.name;
    const email = customerInput.email;
    const cellphone = customerInput.cellphone;
    const companyId = customerInput.companyId;
    const user = req.user;

    if (!user) {
      throw new Error('Não autenticado.');
    }

    try {
      const company = await Company.findOne({ where: { id: companyId } });

      if (!company) {
        throw new Error('Empresa inválida.');
      }

      if (company.userId !== user.id) {
        throw new Error('Não autorizado.');
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
    const companyId = customerInput.companyId;
    const user = req.user;

    if (!user) {
      throw new Error('Não autenticado.');
    }

    try {
      const company = await Company.findOne({
        where: { id: companyId }
      });

      if (!company) {
        throw new Error('Empresa inválida.');
      }

      if (company.userId !== user.id) {
        throw new Error('Não autorizado.');
      }

      const customer = await Customer.findOne({
        where: { id: id, companyId: company.id }
      });

      if (!customer) {
        throw new Error('Cliente não encontrado.');
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
      throw new Error('Não autenticado.');
    }

    try {
      const company = await Company.findOne({
        where: { id: companyId }
      });

      if (!company) {
        throw new Error('Empresa inválida.');
      }

      if (company.userId !== user.id) {
        throw new Error('Não autorizado.');
      }

      const customer = await Customer.findOne({
        where: { id: id, companyId: company.id }
      });

      if (!customer) {
        throw new Error('Cliente não encontrado.');
      }

      return !!supplier.destroy();
    } catch (err) {
      throw err;
    }
  },
  customers: async ({ companyId }, req) => {
    const user = req.user;

    if (!user) {
      throw new Error('Não autenticado.');
    }

    try {
      const company = await Company.findOne({ where: { id: companyId } });

      if (!company) {
        throw new Error('Empresa inválida.');
      }

      if (company.userId !== user.id) {
        throw new Error('Não autorizado.');
      }

      const customers = await Customers.findAll({
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
  customer: async ({ id, customerInput }, req) => {
    const user = req.user;

    if (!user) {
      throw new Error('Não autenticado.');
    }

    try {
      const company = await Company.findOne({ where: { id: companyId } });

      if (!company) {
        throw new Error('Empresa inválida.');
      }

      if (company.userId !== user.id) {
        throw new Error('Não autorizado.');
      }

      const customer = await Customer.findOne({
        where: { id: id, companyId: company.id }
      });

      if (!customer) {
        throw new Error('Cliente não encontrado.');
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
