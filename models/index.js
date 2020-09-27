const { Model } = require("sequelize");
var Sequelize = require("sequelize");
const district = require("./district");
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
  Region: region(sequelize, Sequelize),
  User: user(sequelize, Sequelize),
  District: district(sequelize, Sequelize),
  Document: document(sequelize, Sequelize),
};

// Object.keys(models).forEach((key) => {
//   if ("associate" in models[key]) {
//     models[key].associate(models);
//   }
// });

models.Region.hasMany(models.District);
models.User.hasMany(models.Document);
models.User.belongsToMany(models.District, { through: "userDistricts" });
models.District.hasMany(models.Document);
models.District.belongsTo(models.Region);
models.District.belongsToMany(models.User, { through: "userDistricts" });
models.Document.belongsTo(models.User);
models.Document.belongsTo(models.District);

db.models = models;

module.exports = db;
