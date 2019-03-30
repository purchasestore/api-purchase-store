const express = require('express');
const graphqlHttp = require('express-graphql');
const bodyParser = require('body-parser');

const graphqlSchema = require('./graphql/schema/index');
const graphqlResolvers = require('./graphql/resolvers/index');
const auth = require('./middleware/auth');
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

app.use(bodyParser.json());
app.use(auth);

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
Category.belongsTo(Company);
Product.belongsTo(Company);
Product.belongsToMany(Purchase, { through: PurchaseItem, onDelete: 'CASCADE' });
Product.belongsToMany(Sale, { through: SaleItem, onDelete: 'CASCADE' });

app.use(
  '/graphql',
  graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true
  })
);

sequelize
  // .sync({ force: true })
  .sync()
  .then(() => app.listen(process.env.PORT || 3000))
  .catch(err => console.log(err));
