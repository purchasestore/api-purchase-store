const Sequelize = require('sequelize');

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

      const existingSupplier = await Supplier.findOne({
        where: { cnpj: cnpj, companyId: company.id }
      });

      if (existingSupplier) {
        throw new Error('Fornecedor com CNPJ informado já existe.');
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

      const supplier = await Supplier.findOne({
        where: { id: id, companyId: company.id }
      });

      if (!supplier) {
        throw new Error('Fornecedor não encontrado.');
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
        throw new Error('Fornecedor com CNPJ informado já existe.');
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

      const supplier = await Supplier.findOne({
        where: { id: id, companyId: company.id }
      });

      if (!supplier) {
        throw new Error('Fornecedor não encontrado.');
      }

      return !!supplier.destroy();
    } catch (err) {
      throw err;
    }
  },
  suppliers: async ({ companyId }, req) => {
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

      const supplier = await Supplier.findOne({
        where: { id: id, companyId: company.id }
      });

      if (!supplier) {
        throw new Error('Fornecedor não encontrado.');
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
