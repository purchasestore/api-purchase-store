const express = require('express');
const graphqlHttp = require('express-graphql');

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

app.use(auth);

Company.belongsTo(User);
User.hasOne(Company, { constraints: true, onDelete: 'CASCADE' });
Supplier.belongsTo(Company);
Supplier.hasOne(Purchase);
Company.hasMany(Supplier, { constraints: true, onDelete: 'CASCADE' });
Customer.belongsTo(Company);
Customer.hasOne(Sale);
Company.hasMany(Customer, { constraints: true, onDelete: 'CASCADE' });
Purchase.belongsTo(Company, { constraints: true, onDelete: 'CASCADE' });
Sale.belongsTo(Company, { constraints: true, onDelete: 'CASCADE' });
Category.hasMany(Product);
Category.belongsTo(Company, { constraints: true, onDelete: 'CASCADE' });
Product.belongsTo(Company, { constraints: true, onDelete: 'CASCADE' });
Product.belongsToMany(Purchase, { through: PurchaseItem, onDelete: 'CASCADE' });
Product.belongsToMany(Sale, { through: SaleItem, onDelete: 'CASCADE' });

app.use(
  '/graphql',
  graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
    formatError(err) {
      if (!err.originalError) {
        return err;
      }

      const data = err.originalError.data;
      const message = err.message || 'Ocorreu um erro.';
      const code = err.originalError.code || 500;

      return { message: message, status: code, data: data };
    }
  })
);

sequelize
  // .sync({ force: true })
  .sync()
  .then(() => app.listen(process.env.PORT || 3000))
  .catch(err => console.log(err));
