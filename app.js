const express = require('express');

const sequelize = require('./util/database');
const User = require('./models/user');
const Company = require('./models/company');
const Supplier = require('./models/supplier');
const Customer = require('./models/customer');
const In = require('./models/in');
const Out = require('./models/out');
const Sale = require('./models/sale');
const Product = require('./models/product');
const Category = require('./models/category');

const app = express();

sequelize
  // .sync({ force: true })
  .sync()
  .then(() => app.listen(process.env.PORT || 3000))
  .catch(err => console.log(err));
