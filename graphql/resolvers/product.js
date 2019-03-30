const Product = require('../../models/product');
const Category = require('../../models/category');
const Company = require('../../models/category');
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

      const category = await Category.findOne({ where: { id: categoryId } });

      if (!category) {
        throw new Error('Produto inválido.');
      }

      if (category.companyId !== company.id) {
        throw new Error('Não autorizado.');
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

      const category = await Category.findOne({ where: { id: categoryId } });

      if (!category) {
        throw new Error('Produto inválido.');
      }

      if (category.companyId !== company.id) {
        throw new Error('Não autorizado.');
      }

      const product = Product.findOne({
        where: { id: id, companyId: companyId }
      });

      if (!product) {
        throw new Error('Produto não encontrado.');
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

      const product = Product.findOne({
        where: { id: id, companyId: company.id }
      });

      if (!product) {
        throw new Error('Produto não encontrado.');
      }

      return !!product.destroy();
    } catch (err) {
      throw err;
    }
  },
  products: async ({ companyId }, req) => {
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

      const products = await Product.findAll({
        where: { companyId: company.id }
      });

      return products.map(product => ({
        ...product.dataValues,
        createdAt: dateToString(product.createdAt),
        updatedAt: dateToString(product.updatedAt),
        category: handleCategory(category),
        company: handleCompany(company)
      }));
    } catch (err) {
      throw err;
    }
  },
  product: async ({ id, companyId }, req) => {
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

      const product = await Product.findOne({
        where: { id: id, companyId: company.id }
      });

      if (!product) {
        throw new Error('Produto não encontrado.');
      }

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
