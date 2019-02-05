const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const PurchaseItem = sequelize.define('purchaseItem', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  quantity: Sequelize.INTEGER
});

module.exports = PurchaseItem;
