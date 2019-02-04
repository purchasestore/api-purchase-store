const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const In = sequelize.define('in', {
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
  tableName: 'in'
});

module.exports = In;
