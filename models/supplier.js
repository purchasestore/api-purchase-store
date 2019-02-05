const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Supplier = sequelize.define('supplier', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  cnpj: {
    type: Sequelize.STRING(18),
    allowNull: true
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  cellphone: {
    type: Sequelize.STRING,
    allowNull: false
  },
  address: {
    type: Sequelize.STRING,
    allowNull: false
  },
  city: {
    type: Sequelize.STRING,
    allowNull: false
  },
  state: {
    type: Sequelize.STRING,
    allowNull: false
  },
  landmark: Sequelize.STRING,
  note: Sequelize.STRING
});

module.exports = Supplier;
