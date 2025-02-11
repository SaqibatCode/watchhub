const {Sequelize, DataTypes} = require('sequelize');
const config = require('../config/database');

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    logging: false,
    dialectModule: require('mysql2'),
});


sequelize.authenticate()
.then(() => console.log('Database Connection Successful'))
.catch(err => console.error('Unable to Connect To Database', err));

module.exports = sequelize;