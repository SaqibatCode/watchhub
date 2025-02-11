// models/review.js
const {
    DataTypes
} = require('sequelize');
const sequelize = require('./index');
const Product = require('./product'); // Product model
const User = require('./user'); // User model

// Define Review model
const Review = sequelize.define('Review', {
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        },
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
});

// Sync model with the database
Review.sync()
    .then(() => console.log('Review table has been created.'))
    .catch((err) => console.log('Error creating table: ', err));

module.exports = Review;