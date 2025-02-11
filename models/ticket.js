// models/ticket.js
const {
    DataTypes
} = require('sequelize');
const sequelize = require('./index');
const User = require('./user'); // User model

// Define Ticket model
const Ticket = sequelize.define('Ticket', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'Open', // Open, In Progress, Resolved
    },
});

// Sync the model
Ticket.sync()
    .then(() => console.log('Ticket table has been created.'))
    .catch((err) => console.log('Error creating ticket table: ', err));

module.exports = Ticket;