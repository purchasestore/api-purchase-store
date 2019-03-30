const Purchase = require('../../models/purchase');
const PurchaseItem = require('../../models/purchase-item');
const Product = require('../../models/product');
const Supplier = require('../../models/supplier');
const Company = require('../../models/company');
const { dateToString } = require('../../helpers/date');
const { handleCompany } = require('../../helpers/company');
const { handleSupplier } = require('../../helpers/supplier');
const { handlePurchaseItems } = require('../../helpers/purchase-items');

module.exports = {
  createPurchase: async ({ purchaseInput }, req) => {
    const items = purchaseInput.items;
    const supplierId = purchaseInput.supplier;
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

      const supplier = await Supplier.findOne({ where: { id: supplierId } });

      if (!supplier) {
        throw new Error('Fornecedor inválido.');
      }

      if (supplier.companyId !== company.id) {
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

      const purchase = await Purchase.create({
        value: value,
        supplierId: supplierId,
        companyId: companyId
      });

      const purchaseItems = [];

      this.items.map(async item => {
        const qty = item.quantity;
        const productId = item.product;

        const purchaseItem = await PurchaseItem.create({
          quantity: qty,
          productId: productId,
          purchaseId: purchase.id
        });

        purchaseItems.push(purchaseItem);
      });

      return {
        ...purchase.dataValues,
        createdAt: dateToString(purchase.createdAt),
        updatedAt: dateToString(purchase.updatedAt),
        supplier: handleSupplier(supplier),
        company: handleCompany(company),
        items: handlePurchaseItems([...purchaseItems])
      };
    } catch (err) {
      throw err;
    }
  },
  updatePurchase: async ({ id, purchaseInput }, req) => {
    const items = purchaseInput.items;
    const supplierId = purchaseInput.supplier;
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

      const supplier = await Supplier.findOne({ where: { id: supplierId } });

      if (!supplier) {
        throw new Error('Fornecedor inválido.');
      }

      if (supplier.companyId !== company.id) {
        throw new Error('Não autorizado.');
      }

      const purchase = Purchase.findOne({
        where: { id: id, companyId: companyId }
      });

      if (!purchase) {
        throw new Error('Compra não encontrada.');
      }

      items.map(async item => {
        const qty = item.quantity;
        const productId = item.product;
        const product = await Product.findOne({ where: { id: productId } });

        value += product.price * qty;
      });

      purchase.value = value;
      if (supplierId !== purchase.supplierId) {
        purchase.supplierId = supplierId;
      }

      const updatedPurchase = await purchase.save();

      const oldItems = await PurchaseItem.findAll({
        where: { purchaseId: purchase.id }
      });

      if (oldItems.length < 1) {
        throw new Error('Items da compra não encontrado.');
      }

      oldItems.map(async item => {
        await item.destroy();
      });

      const purchaseItems = [];

      items.map(async item => {
        const qty = item.quantity;
        const productId = item.product;

        const purchaseItem = await PurchaseItem.create({
          quantity: qty,
          productId: productId,
          purchaseId: purchase.id
        });

        purchaseItems.push(purchaseItem);
      });

      return {
        ...updatedPurchase.dataValues,
        createdAt: dateToString(updatedPurchase.createdAt),
        updatedAt: dateToString(updatedPurchase.updatedAt),
        supplier: handleSupplier(supplier),
        company: handleCompany(company),
        items: handlePurchaseItems([...purchaseItems])
      };
    } catch (err) {
      throw err;
    }
  },
  deletePurchase: async ({ id, companyId }, req) => {
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

      const purchase = Purchase.findOne({
        where: { id: id, companyId: company.id }
      });

      if (!purchase) {
        throw new Error('Compra não encontrada.');
      }

      return !!purchase.destroy();
    } catch (err) {
      throw err;
    }
  },
  purchases: async ({ companyId }, req) => {
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

      const purchases = await Purchase.findAll({
        where: { companyId: companyId }
      });

      return purchases.map(async purchase => {
        const purchaseItems = await PurchaseItem.findAll({
          where: { purchaseId: purchase.id }
        });

        return {
          ...purchase.dataValues,
          createdAt: dateToString(purchase.createdAt),
          updatedAt: dateToString(purchase.updatedAt),
          supplier: handleSupplier(supplier),
          company: handleCompany(company),
          items: handlePurchaseItems([...purchaseItems])
        };
      });
    } catch (err) {
      throw err;
    }
  },
  purchase: async ({ id, companyId }, req) => {
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

      const purchase = await Purchase.findOne({
        where: { id: id, companyId: company.id }
      });

      if (!purchase) {
        throw new Error('Compra não encontrada.');
      }

      const purchaseItems = await PurchaseItem.findAll({
        where: { purchaseId: purchase.id }
      });

      return {
        ...purchase.dataValues,
        createdAt: dateToString(purchase.createdAt),
        updatedAt: dateToString(purchase.updatedAt),
        supplier: handleSupplier(supplier),
        company: handleCompany(company),
        items: handlePurchaseItems([...purchaseItems])
      };
    } catch (err) {
      throw err;
    }
  }
};
