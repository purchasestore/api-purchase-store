const express = require('express');

const sequelize = require('./util/database');
const User = require('./models/user');
const Company = require('./models/company');
const Supplier = require('./models/supplier');
const Customer = require('./models/customer');
const Purchase = require('./models/purchase');
const Sale = require('./models/sale');
const PurchaseItem = require('./models/purchase-item');
const SaleItem = require('./models/sale-item');
const Category = require('./models/category');
const Product = require('./models/product');

const app = express();

Company.belongsTo(User, {
  constraints: true,
  onDelete: 'CASCADE'
});
User.hasOne(Company);
Supplier.belongsTo(Company);
Supplier.hasOne(Purchase);
Company.hasMany(Supplier);
Customer.belongsTo(Company);
Customer.hasOne(Sale);
Company.hasMany(Customer);
Purchase.belongsTo(Company);
Sale.belongsTo(Company);
Category.hasMany(Product);
Product.belongsTo(Company);
Product.belongsToMany(Purchase, { through: PurchaseItem });
Product.belongsToMany(Sale, { through: SaleItem });

sequelize
//   .sync({ force: true })
  .sync()
  .then(() => app.listen(process.env.PORT || 3000))
  .catch(err => console.log(err));
