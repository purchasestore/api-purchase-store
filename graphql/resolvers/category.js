const validator = require('validator');

const Company = require('../../models/company');
const Category = require('../../models/category');
const { dateToString } = require('../../helpers/date');
const { handleCompany } = require('../../helpers/company');

module.exports = {
  createCategory: async ({ categoryInput }, req) => {
    const name = categoryInput.name;
    const companyId = categoryInput.company;
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

      const category = await Category.create({
        name: name,
        companyId: companyId
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
  },
  updateCategory: async ({ id, categoryInput }, req) => {
    const name = categoryInput.name;
    const companyId = categoryInput.company;
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

      const category = await Category.findOne({
        where: { id: id, companyId: companyId }
      });

      if (!category) {
        const error = new Error('Categoria não encontrada.');
        error.code = 404;
        throw error;
      }

      category.name = name;

      const updatedCategory = await category.save();

      return {
        ...updatedCategory.dataValues,
        createdAt: dateToString(updatedCategory.createdAt),
        updatedAt: dateToString(updatedCategory.updatedAt),
        company: handleCompany(company)
      };
    } catch (err) {
      throw err;
    }
  },
  deleteCategory: async ({ id, companyId }, req) => {
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

      const category = await Category.findOne({
        where: { id: id, companyId: company.id }
      });

      if (!category) {
        const error = new Error('Categoria não encontrada.');
        error.code = 404;
        throw error;
      }

      return !!category.destroy();
    } catch (err) {
      throw err;
    }
  },
  categories: async ({ companyId }, req) => {
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

      const categories = await Category.findAll({
        where: { companyId: company.id }
      });

      return categories.map(category => ({
        ...category.dataValues,
        createdAt: dateToString(category.createdAt),
        updatedAt: dateToString(category.updatedAt),
        company: handleCompany(company)
      }));
    } catch (err) {
      throw err;
    }
  },
  category: async ({ id, companyId }, req) => {
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

      const category = await Category.findOne({
        where: { id: id, companyId: company.id }
      });

      if (!category) {
        const error = new Error('Categoria não encontrada.');
        error.code = 404;
        throw error;
      }

      return {
        ...category.dataValues,
        createdAt: dateToString(category.createdAt),
        updatedAt: dateToString(category.updatedAt),
        company: handleCompany(company)
      };
    } catch (err) {
      throw err;
    }
  }
};
