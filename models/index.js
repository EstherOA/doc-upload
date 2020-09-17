var Sequelize = require("sequelize");
var document = require("./document");
var user = require("./user");

const sequelize = new Sequelize("doc", "postgres", "root2111", {
  host: process.env.DATABASE_HOST,
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

const models = {
  User: user(sequelize, Sequelize),
  Document: document(sequelize, Sequelize),
};

Object.keys(models).forEach((key) => {
  if ("associate" in models[key]) {
    models[key].associate(models);
  }
});

db.models = models;

module.exports = db;
