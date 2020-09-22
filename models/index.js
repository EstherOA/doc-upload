var Sequelize = require("sequelize");
var document = require("./document");
const region = require("./region");
var user = require("./user");

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

const models = {
  User: user(sequelize, Sequelize),
  Document: document(sequelize, Sequelize),
  Region: region(sequelize, Sequelize),
  District: region(sequelize, Sequelize),
};

Object.keys(models).forEach((key) => {
  if ("associate" in models[key]) {
    models[key].associate(models);
  }
});

db.models = models;

module.exports = db;
