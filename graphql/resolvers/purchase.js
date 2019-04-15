const validator = require('validator');

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
    let value = 0;

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
        where: { id: supplierId, companyId: company.id }
      });

      if (!supplier) {
        const error = new Error('Fornecedor inválido.');
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

      const purchase = await Purchase.create({
        value: value,
        supplierId: supplierId,
        companyId: companyId
      });

      const purchaseItems = [];

      await Promise.all(
        items.map(async item => {
          const qty = item.quantity;
          const productId = item.product;

          const purchaseItem = await PurchaseItem.create({
            quantity: qty,
            productId: productId,
            purchaseId: purchase.id
          });

          purchaseItems.push(purchaseItem);
        })
      );

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
    let value = 0;

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
        where: { id: supplierId, companyId: company.id }
      });

      if (!supplier) {
        const error = new Error('Fornecedor inválido.');
        error.code = 422;
        throw error;
      }

      const purchase = await Purchase.findOne({
        where: { id: id, companyId: companyId }
      });

      if (!purchase) {
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

      purchase.value = value;
      if (supplierId !== purchase.supplierId) {
        purchase.supplierId = supplierId;
      }

      const updatedPurchase = await purchase.save();

      const oldItems = await PurchaseItem.findAll({
        where: { purchaseId: purchase.id }
      });

      if (oldItems.length < 1) {
        const error = new Error('Items da compra não encontrados.');
        error.code = 404;
        throw error;
      }

      oldItems.map(async item => {
        await item.destroy();
      });

      const purchaseItems = [];

      await Promise.all(
        items.map(async item => {
          const qty = item.quantity;
          const productId = item.product;

          const purchaseItem = await PurchaseItem.create({
            quantity: qty,
            productId: productId,
            purchaseId: purchase.id
          });

          purchaseItems.push(purchaseItem);
        })
      );

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

      const purchase = await Purchase.findOne({
        where: { id: id, companyId: company.id }
      });

      if (!purchase) {
        const error = new Error('Compra não encontrada.');
        error.code = 404;
        throw error;
      }

      return !!purchase.destroy();
    } catch (err) {
      throw err;
    }
  },
  purchases: async ({ companyId }, req) => {
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

      const purchases = await Purchase.findAll({
        where: { companyId: companyId }
      });

      return purchases.map(async purchase => {
        const purchaseItems = await PurchaseItem.findAll({
          where: { purchaseId: purchase.id }
        });

        const supplier = await Supplier.findOne({
          where: { id: purchase.supplierId, companyId: company.id }
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

      const purchase = await Purchase.findOne({
        where: { id: id, companyId: company.id }
      });

      if (!purchase) {
        const error = new Error('Compra não encontrada.');
        error.code = 404;
        throw error;
      }

      const supplier = await Supplier.findOne({
        where: { id: purchase.supplierId, companyId: company.id }
      });

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
