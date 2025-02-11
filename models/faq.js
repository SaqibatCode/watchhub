// models/faq.js
const { DataTypes } = require('sequelize');
const sequelize = require('./index');

// Define FAQ model
const Faq = sequelize.define('Faq', {
  question: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  answer: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

// Sync model with the database
Faq.sync()
  .then(() => console.log('FAQ table has been created.'))
  .catch((err) => console.log('Error creating FAQ table: ', err));

module.exports = Faq;
