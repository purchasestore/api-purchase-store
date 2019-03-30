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
    const items = purchaseInput.items;
    const discount = saleInput.discount;
    const percentage = saleInput.percentage;
    const online = saleInput.online;
    const disclosure = saleInput.disclosure;
    const customerId = purchaseInput.customer;
    const companyId = purchaseInput.company;
    const user = req.user;
    let value;

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

      const customer = await Customer.findOne({ where: { id: customerId } });

      if (!customer) {
        throw new Error('Cliente inválido.');
      }

      if (customer.companyId !== company.id) {
        throw new Error('Não autorizado.');
      }

      items.map(async item => {
        console.log('--------------------------');
        console.log(item);
        console.log('--------------------------');

        const qty = item.quantity;
        const productId = item.product;
        const product = await Product.findOne({ where: { id: productId } });

        value += product.price * qty;
      });

      const sale = await Sale.create({
        value: value,
        discount: discount,
        percentage: percentage,
        online: online,
        disclosure: disclosure,
        customer: customer,
        companyId: companyId
      });

      const saleItems = [];

      this.items.map(async item => {
        const qty = item.quantity;
        const productId = item.product;

        const saleItem = await SaleItem.create({
          quantity: qty,
          productId: productId,
          saleId: sale.id
        });

        saleItems.push(saleItem);
      });

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
    const items = purchaseInput.items;
    const discount = saleInput.discount;
    const percentage = saleInput.percentage;
    const online = saleInput.online;
    const disclosure = saleInput.disclosure;
    const customerId = purchaseInput.customer;
    const companyId = purchaseInput.company;
    const user = req.user;
    let value;

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

      const customer = await Customer.findOne({ where: { id: customerId } });

      if (!customer) {
        throw new Error('Cliente inválido.');
      }

      if (customer.companyId !== company.id) {
        throw new Error('Não autorizado.');
      }

      const sale = Sale.findOne({
        where: { id: id, companyId: companyId }
      });

      if (!sale) {
        throw new Error('Venda não encontrada.');
      }

      items.map(async item => {
        const qty = item.quantity;
        const productId = item.product;
        const product = await Product.findOne({ where: { id: productId } });

        value += product.price * qty;
      });

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
        throw new Error('Items da venda não encontrado.');
      }

      oldItems.map(async item => {
        await item.destroy();
      });

      const saleItems = [];

      items.map(async item => {
        const qty = item.quantity;
        const productId = item.product;

        const saleItem = await SaleItem.create({
          quantity: qty,
          productId: productId,
          saleId: sale.id
        });

        saleItems.push(saleItem);
      });

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

      const sale = Sale.findOne({
        where: { id: id, companyId: company.id }
      });

      if (!sale) {
        throw new Error('Venda não encontrada.');
      }

      return !!sale.destroy();
    } catch (err) {
      throw err;
    }
  },
  sales: async ({ companyId }, req) => {
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

      const sales = await Sale.findAll({ where: { companyId: companyId } });

      return sales.map(async sale => {
        const saleItems = await SaleItem.findAll({
          where: { saleId: sale.id }
        });

        return {
          ...sale.dataValues,
          createdAt: dateToString(sale.createdAt),
          updatedAt: dateToString(sale.updatedAt),
          supplier: handleSupplier(supplier),
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

      const sale = await Sale.findOne({
        where: { id: id, companyId: company.id }
      });

      if (!sale) {
        throw new Error('Venda não encontrada.');
      }

      const saleItems = await SaleItem.findAll({ where: { saleId: sale.id } });

      return {
        ...sale.dataValues,
        createdAt: dateToString(sale.createdAt),
        updatedAt: dateToString(sale.updatedAt),
        supplier: handleSupplier(supplier),
        company: handleCompany(company),
        items: handleSaleItems([...saleItems])
      };
    } catch (err) {
      throw err;
    }
  }
};
