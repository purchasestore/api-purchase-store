const validator = require('validator');

const Sale = require('../../models/sale');
const SaleItem = require('../../models/sale-item');
const Product = require('../../models/product');
const Customer = require('../../models/customer');
const Company = require('../../models/company');
const { dateToString } = require('../../helpers/date');
const { handleCompany } = require('../../helpers/company');
const { handleCustomer } = require('../../helpers/customer');
const { handleSaleItems } = require('../../helpers/sale-items');

module.exports = {
  createSale: async ({ saleInput }, req) => {
    const items = saleInput.items;
    const discount = saleInput.discount;
    const percentage = saleInput.percentage;
    const online = saleInput.online;
    const disclosure = saleInput.disclosure;
    const customerId = saleInput.customer;
    const companyId = saleInput.company;
    const user = req.user;
    const errors = [];
    let value = 0;

    if (!user) {
      const error = new Error('Não autenticado.');
      error.code = 401;
      throw error;
    }

    if (validator.isEmpty(discount.toString()) || discount < 0) {
      errors.push({ message: 'Desconto inválido.' });
    }

    if (validator.isEmpty(percentage.toString()) || percentage < 0) {
      errors.push({ message: 'Porcentagem inválida.' });
    }

    if (validator.isEmpty(online.toString())) {
      errors.push({ message: 'Online inválido.' });
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
        where: { id: customerId, companyId: company.id }
      });

      if (!customer) {
        const error = new Error('Cliente inválido.');
        error.code = 422;
        throw error;
      }

      await Promise.all(
        items.map(async item => {
          const qty = item.quantity;
          const productId = item.product;
          const product = await Product.findOne({
            where: { id: productId, companyId: company.id }
          });

          if (!product) {
            const error = new Error('Produto inválido.');
            error.code = 422;
            throw error;
          }

          if (validator.isEmpty(qty.toString()) || qty <= 0) {
            const error = new Error(
              'Quantidade inválida no produto ' + product.name + '.'
            );
            error.code = 422;
            throw error;
          }

          value += product.price * qty;
        })
      );

      const sale = await Sale.create({
        value: value,
        discount: discount,
        percentage: percentage,
        online: online,
        disclosure: disclosure,
        customerId: customerId,
        companyId: companyId
      });

      const saleItems = [];

      await Promise.all(
        items.map(async item => {
          const qty = item.quantity;
          const productId = item.product;

          const saleItem = await SaleItem.create({
            quantity: qty,
            productId: productId,
            saleId: sale.id
          });

          saleItems.push(saleItem);
        })
      );

      return {
        ...sale.dataValues,
        createdAt: dateToString(sale.createdAt),
        updatedAt: dateToString(sale.updatedAt),
        customer: handleCustomer(customer),
        company: handleCompany(company),
        items: handleSaleItems([...saleItems])
      };
    } catch (err) {
      throw err;
    }
  },
  updateSale: async ({ id, saleInput }, req) => {
    const items = saleInput.items;
    const discount = saleInput.discount;
    const percentage = saleInput.percentage;
    const online = saleInput.online;
    const disclosure = saleInput.disclosure;
    const customerId = saleInput.customer;
    const companyId = saleInput.company;
    const user = req.user;
    const errors = [];
    let value = 0;

    if (!user) {
      const error = new Error('Não autenticado.');
      error.code = 401;
      throw error;
    }

    if (validator.isEmpty(discount.toString()) || discount < 0) {
      errors.push({ message: 'Desconto inválido.' });
    }

    if (validator.isEmpty(percentage.toString()) || percentage < 0) {
      errors.push({ message: 'Porcentagem inválida.' });
    }

    if (validator.isEmpty(online.toString())) {
      errors.push({ message: 'Online inválido.' });
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
        where: { id: customerId, companyId: company.id }
      });

      if (!customer) {
        const error = new Error('Cliente inválido.');
        error.code = 422;
        throw error;
      }

      const sale = await Sale.findOne({
        where: { id: id, companyId: companyId }
      });

      if (!sale) {
        const error = new Error('Compra não encontrada.');
        error.code = 404;
        throw error;
      }

      await Promise.all(
        items.map(async item => {
          const qty = item.quantity;
          const productId = item.product;
          const product = await Product.findOne({
            where: { id: productId, companyId: company.id }
          });

          if (!product) {
            const error = new Error('Produto inválido.');
            error.code = 422;
            throw error;
          }

          if (validator.isEmpty(qty.toString()) || qty <= 0) {
            const error = new Error(
              'Quantidade inválida no produto ' + product.name + '.'
            );
            error.code = 422;
            throw error;
          }

          value += product.price * qty;
        })
      );

      sale.value = value;
      sale.discount = discount;
      sale.percentage = percentage;
      sale.online = online;
      sale.disclosure = disclosure;
      if (customerId !== sale.customerId) {
        sale.customer = customer;
      }

      const updatedSale = await sale.save();

      const oldItems = await SaleItem.findAll({
        where: { saleId: sale.id }
      });

      if (oldItems.length < 1) {
        const error = new Error('Items da venda não encontrados.');
        error.code = 404;
        throw error;
      }

      oldItems.map(async item => {
        await item.destroy();
      });

      const saleItems = [];

      await Promise.all(
        items.map(async item => {
          const qty = item.quantity;
          const productId = item.product;

          const saleItem = await SaleItem.create({
            quantity: qty,
            productId: productId,
            saleId: sale.id
          });

          saleItems.push(saleItem);
        })
      );

      return {
        ...updatedSale.dataValues,
        createdAt: dateToString(updatedSale.createdAt),
        updatedAt: dateToString(updatedSale.updatedAt),
        customer: handleCustomer(customer),
        company: handleCompany(company),
        items: handleSaleItems([...saleItems])
      };
    } catch (err) {
      throw err;
    }
  },
  deleteSale: async ({ id, companyId }, req) => {
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

      const sale = await Sale.findOne({
        where: { id: id, companyId: company.id }
      });

      if (!sale) {
        const error = new Error('Compra não encontrada.');
        error.code = 404;
        throw error;
      }

      return !!sale.destroy();
    } catch (err) {
      throw err;
    }
  },
  sales: async ({ companyId }, req) => {
    const user = req.user;

    if (!user) {
      const error = new Error('Não autenticado.');
      error.code = 401;
      throw error;
    }

    try {
      const company = await Company.findOne({ where: { id: companyId } });

      if (!company) {
        const error = new Error('Empresa inválida.');
        error.code = 422;
        throw error;
      }

      if (company.userId !== user.id) {
        const error = new Error('Não autorizado.');
        error.code = 403;
        throw error;
      }

      const sales = await Sale.findAll({ where: { companyId: companyId } });

      return sales.map(async sale => {
        const saleItems = await SaleItem.findAll({
          where: { saleId: sale.id }
        });

        const customer = await Customer.findOne({
          where: { id: sale.customerId, companyId: company.id }
        });

        return {
          ...sale.dataValues,
          createdAt: dateToString(sale.createdAt),
          updatedAt: dateToString(sale.updatedAt),
          customer: handleCustomer(customer),
          company: handleCompany(company),
          items: handleSaleItems([...saleItems])
        };
      });
    } catch (err) {
      throw err;
    }
  },
  sale: async ({ id, companyId }, req) => {
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

      const sale = await Sale.findOne({
        where: { id: id, companyId: company.id }
      });

      if (!sale) {
        const error = new Error('Compra não encontrada.');
        error.code = 404;
        throw error;
      }

      const customer = await Customer.findOne({
        where: { id: sale.customerId, companyId: company.id }
      });

      const saleItems = await SaleItem.findAll({ where: { saleId: sale.id } });

      return {
        ...sale.dataValues,
        createdAt: dateToString(sale.createdAt),
        updatedAt: dateToString(sale.updatedAt),
        customer: handleCustomer(customer),
        company: handleCompany(company),
        items: handleSaleItems([...saleItems])
      };
    } catch (err) {
      throw err;
    }
  }
};
