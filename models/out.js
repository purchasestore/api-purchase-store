const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Out = sequelize.define('out', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  amount: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'out'
});

module.exports = Out;
