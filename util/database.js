const Sequelize = require('sequelize');

const sequelize = new Sequelize('purchase-store', 'root', 'awesomesenha', {
  dialect: 'mysql',
  host: 'localhost',
  operatorsAliases: false
});

module.exports = sequelize;
