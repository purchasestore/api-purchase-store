const validator = require('validator');

const Product = require('../../models/product');
const Category = require('../../models/category');
const Company = require('../../models/company');
const { dateToString } = require('../../helpers/date');
const { handleCompany } = require('../../helpers/company');
const { handleCategory } = require('../../helpers/category');

module.exports = {
  createProduct: async ({ productInput }, req) => {
    const name = productInput.name;
    const price = productInput.price;
    const code = productInput.code;
    const imageUrl = productInput.imageUrl;
    const highlight = productInput.highlight;
    const categoryId = productInput.category;
    const companyId = productInput.company;
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

    if (validator.isEmpty(price.toString()) || price <= 0) {
      errors.push({ message: 'Preço inválido.' });
    }

    if (validator.isEmpty(code)) {
      errors.push({ message: 'Código inválido.' });
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
        where: { id: categoryId, companyId: company.id }
      });

      if (!category) {
        const error = new Error('Categoria inválida.');
        error.code = 422;
        throw error;
      }

      const product = await Product.create({
        name: name,
        price: price,
        code: code,
        imageUrl: imageUrl,
        highlight: highlight,
        categoryId: categoryId,
        companyId: companyId
      });

      return {
        ...product.dataValues,
        createdAt: dateToString(product.createdAt),
        updatedAt: dateToString(product.updatedAt),
        category: handleCategory(category),
        company: handleCompany(company)
      };
    } catch (err) {
      throw err;
    }
  },
  updateProduct: async ({ id, productInput }, req) => {
    const name = productInput.name;
    const price = productInput.price;
    const code = productInput.code;
    const imageUrl = productInput.imageUrl;
    const highlight = productInput.highlight;
    const categoryId = productInput.category;
    const companyId = productInput.company;
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

    if (validator.isEmpty(price.toString()) || price <= 0) {
      errors.push({ message: 'Preço inválido.' });
    }

    if (validator.isEmpty(code)) {
      errors.push({ message: 'Código inválido.' });
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
        where: { id: categoryId, companyId: company.id }
      });

      if (!category) {
        const error = new Error('Categoria inválida.');
        error.code = 422;
        throw error;
      }

      const product = await Product.findOne({
        where: { id: id, companyId: companyId }
      });

      if (!product) {
        const error = new Error('Produto não encontrado.');
        error.code = 404;
        throw error;
      }

      product.name = name;
      product.price = price;
      product.code = code;
      product.imageUrl = imageUrl;
      product.highlight = highlight;
      if (categoryId !== product.categoryId) {
        product.categoryId = categoryId;
      }

      const updatedProduct = await product.save();

      return {
        ...updatedProduct.dataValues,
        createdAt: dateToString(updatedProduct.createdAt),
        updatedAt: dateToString(updatedProduct.updatedAt),
        category: handleCategory(category),
        company: handleCompany(company)
      };
    } catch (err) {
      throw err;
    }
  },
  deleteProduct: async ({ id, companyId }, req) => {
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

      const product = await Product.findOne({
        where: { id: id, companyId: company.id }
      });

      if (!product) {
        const error = new Error('Produto não encontrado.');
        error.code = 404;
        throw error;
      }

      return !!product.destroy();
    } catch (err) {
      throw err;
    }
  },
  products: async ({ companyId }, req) => {
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

      const products = await Product.findAll({
        where: { companyId: company.id }
      });

      return products.map(async product => {
        const category = await Category.findOne({
          where: { id: product.categoryId, companyId: company.id }
        });

        return {
          ...product.dataValues,
          createdAt: dateToString(product.createdAt),
          updatedAt: dateToString(product.updatedAt),
          category: handleCategory(category),
          company: handleCompany(company)
        };
      });
    } catch (err) {
      throw err;
    }
  },
  product: async ({ id, companyId }, req) => {
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

      const product = await Product.findOne({
        where: { id: id, companyId: company.id }
      });

      if (!product) {
        const error = new Error('Produto não encontrado.');
        error.code = 404;
        throw error;
      }

      const category = await Category.findOne({
        where: { id: product.categoryId, companyId: company.id }
      });

      return {
        ...product.dataValues,
        createdAt: dateToString(product.createdAt),
        updatedAt: dateToString(product.updatedAt),
        category: handleCategory(category),
        company: handleCompany(company)
      };
    } catch (err) {
      throw err;
    }
  }
};
