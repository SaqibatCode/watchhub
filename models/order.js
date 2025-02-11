// models/order.js
const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Product = require('./product'); // Product model

// Define Order model
const Order = sequelize.define('Order', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Pending',
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shippingDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

// Sync model with the database
Order.sync()
  .then(() => console.log('Order table has been created.'))
  .catch((err) => console.log('Error creating table: ', err));

module.exports = Order;
