const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Purchase = sequelize.define('purchase', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  value: {
    type: Sequelize.DOUBLE,
    allowNull: false
  }
});

module.exports = Purchase;
