const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Company = sequelize.define('company', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  trade: Sequelize.STRING,
  cnpj: {
    type: Sequelize.STRING(18),
    allowNull: false
  }
});

module.exports = Company;
