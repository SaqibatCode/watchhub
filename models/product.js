// models/product.js
const {
    DataTypes
} = require('sequelize');
const sequelize = require('./index');

// Define Product model
const Product = sequelize.define('Product', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING, // URL or path to the product image
        allowNull: true,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

// Sync model with the database
Product.sync()
    .then(() => console.log('Product table has been created.'))
    .catch((err) => console.log('Error creating table: ', err));

module.exports = Product;