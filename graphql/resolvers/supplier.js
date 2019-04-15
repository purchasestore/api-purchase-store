const Sequelize = require('sequelize');
const validator = require('validator');

const Company = require('../../models/company');
const Supplier = require('../../models/supplier');
const { dateToString } = require('../../helpers/date');
const { handleCompany } = require('../../helpers/company');

const Op = Sequelize.Op;

module.exports = {
  createSupplier: async ({ supplierInput }, req) => {
    const name = supplierInput.name;
    const cnpj = supplierInput.cnpj;
    const email = supplierInput.email;
    const cellphone = supplierInput.cellphone;
    const address = supplierInput.address;
    const city = supplierInput.city;
    const state = supplierInput.state;
    const landmark = supplierInput.landmark;
    const note = supplierInput.note;
    const companyId = supplierInput.company;
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

    console.log('-----------------------------------');
    console.log(cnpj.replace(/\D/g, ''));
    console.log('-----------------------------------');

    if (
      !validator.isEmpty(cnpj) &&
      !validator.isLength(cnpj.replace(/\D/g, ''), { min: 14, max: 14 })
    ) {
      errors.push({ message: 'CNPJ inválido.' });
    }

    if (!validator.isEmail(email)) {
      errors.push({ message: 'E-mail inválido.' });
    }

    if (validator.isEmpty(cellphone)) {
      errors.push({ message: 'Celular inválido.' });
    }

    if (validator.isEmpty(address)) {
      errors.push({ message: 'Endereço inválido.' });
    }

    if (validator.isEmpty(city)) {
      errors.push({ message: 'Cidade inválido.' });
    }

    if (validator.isEmpty(state)) {
      errors.push({ message: 'Estado inválido.' });
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

      const existingSupplier = await Supplier.findOne({
        where: { cnpj: cnpj, companyId: company.id }
      });

      if (existingSupplier) {
        const error = new Error('Fornecedor com CNPJ informado já existe.');
        error.code = 422;
        throw error;
      }

      const supplier = await Supplier.create({
        name: name,
        cnpj: cnpj,
        email: email,
        cellphone: cellphone,
        address: address,
        city: city,
        state: state,
        landmark: landmark,
        note: note,
        companyId: companyId
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
  },
  updateSupplier: async ({ id, supplierInput }, req) => {
    const name = supplierInput.name;
    const cnpj = supplierInput.cnpj;
    const email = supplierInput.email;
    const cellphone = supplierInput.cellphone;
    const address = supplierInput.address;
    const city = supplierInput.city;
    const state = supplierInput.state;
    const landmark = supplierInput.landmark;
    const note = supplierInput.note;
    const companyId = supplierInput.company;
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
      !validator.isEmpty(cnpj) &&
      !validator.isLength(cnpj.replace(/\D/g, ''), { min: 14, max: 14 })
    ) {
      errors.push({ message: 'CNPJ inválido.' });
    }

    if (!validator.isEmail(email)) {
      errors.push({ message: 'E-mail inválido.' });
    }

    if (validator.isEmpty(cellphone)) {
      errors.push({ message: 'Celular inválido.' });
    }

    if (validator.isEmpty(address)) {
      errors.push({ message: 'Endereço inválido.' });
    }

    if (validator.isEmpty(city)) {
      errors.push({ message: 'Cidade inválido.' });
    }

    if (validator.isEmpty(state)) {
      errors.push({ message: 'Estado inválido.' });
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

      const supplier = await Supplier.findOne({
        where: { id: id, companyId: company.id }
      });

      if (!supplier) {
        const error = new Error('Fornecedor não encontrado.');
        error.code = 404;
        throw error;
      }

      const existingSupplier = await Supplier.findOne({
        where: {
          [Op.and]: [
            { cnpj: cnpj, companyId: company.id },
            { cnpj: { [Op.ne]: supplier.cnpj } }
          ]
        }
      });

      if (existingSupplier) {
        const error = new Error('Fornecedor com CNPJ informado já existe.');
        error.code = 422;
        throw error;
      }

      supplier.name = name;
      supplier.cnpj = cnpj;
      supplier.email = email;
      supplier.cellphone = cellphone;
      supplier.address = address;
      supplier.city = city;
      supplier.state = state;
      supplier.landmark = landmark;
      supplier.note = note;

      const updatedSupllier = await supplier.save();

      return {
        ...updatedSupllier.dataValues,
        createdAt: dateToString(updatedSupllier.createdAt),
        updatedAt: dateToString(updatedSupllier.updatedAt),
        company: handleCompany(company)
      };
    } catch (err) {
      throw err;
    }
  },
  deleteSupplier: async ({ id, companyId }, req) => {
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

      const supplier = await Supplier.findOne({
        where: { id: id, companyId: company.id }
      });

      if (!supplier) {
        const error = new Error('Fornecedor não encontrado.');
        error.code = 404;
        throw error;
      }

      return !!supplier.destroy();
    } catch (err) {
      throw err;
    }
  },
  suppliers: async ({ companyId }, req) => {
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

      const suppliers = await Supplier.findAll({
        where: { companyId: company.id }
      });

      return suppliers.map(supplier => ({
        ...supplier.dataValues,
        createdAt: dateToString(supplier.createdAt),
        updatedAt: dateToString(supplier.updatedAt),
        company: handleCompany(company)
      }));
    } catch (err) {
      throw err;
    }
  },
  supplier: async ({ id, companyId }, req) => {
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

      const supplier = await Supplier.findOne({
        where: { id: id, companyId: company.id }
      });

      if (!supplier) {
        const error = new Error('Fornecedor não encontrado.');
        error.code = 404;
        throw error;
      }

      return {
        ...supplier.dataValues,
        createdAt: dateToString(supplier.createdAt),
        updatedAt: dateToString(supplier.updatedAt),
        company: handleCompany(company)
      };
    } catch (err) {
      throw err;
    }
  }
};
