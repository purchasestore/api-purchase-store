const Company = require('../../models/category');
const Category = require('../../models/category');
const { dateToString } = require('../../helpers/date');
const { handleCompany } = require('../../helpers/company');

module.exports = {
  createCategory: async ({ categoryInput }, req) => {
    const name = categoryInput.name;
    const companyId = categoryInput.company;
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
    const user = req;

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

      const category = await Category.findOne({
        where: { id: id, companyId: companyId }
      });

      if (!category) {
        throw new Error('Categoria não encontrada.');
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

      const category = await Category.findOne({
        where: { id: id, companyId: company.id }
      });

      if (!category) {
        throw new Error('Categoria não encontrada.');
      }

      return !!category.destroy();
    } catch (err) {
      throw err;
    }
  },
  categories: async ({ companyId }, req) => {
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

      const category = await Category.findOne({
        where: { id: id, companyId: company.id }
      });

      if (!category) {
        throw new Error('Categoria não encontrada.');
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
