require('dotenv').config();
const { Sequelize } = require('sequelize');

const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const sequelizeConnection = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: 'localhost',
  port: 3306,
  dialect: 'mysql',
  timezone: '+07:00',
  // logging: console.log,
  logging: false,
});

module.exports = sequelizeConnection;
