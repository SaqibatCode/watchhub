const {DataTypes} = require('sequelize');
const sequelize = require('./index');

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

User.sync()
.then(() => console.log('User Table Has Been Created Successfully'))
.catch(err => console.error('Error Creating Table', err));

module.exports = User;