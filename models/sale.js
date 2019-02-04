const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Sale = sequelize.define('sale', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  value: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  discount: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  percentage: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  online: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
  disclosure: Sequelize.BOOLEAN
});

module.exports = Sale;
