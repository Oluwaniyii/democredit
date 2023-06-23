/** @format */
/**
 * Since Migrations will be handled manually, inspect your mysql container and replace host with the ipAddress
 */
require("dotenv").config();

module.exports = {
  development: {
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: "",
    dialect: "mysql",
    migrationStorage: "json",
    migrationStorage: "sequelize"
  },
  test: {
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: "",
    dialect: "mysql",
    migrationStorage: "json",
    migrationStorage: "sequelize"
  },
  production: {
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: "",
    dialect: "mysql",
    migrationStorage: "json",
    migrationStorage: "sequelize"
  }
};
