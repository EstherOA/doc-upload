"use strict";

const { models } = require(".");

const document = (sequelize, Sequelize) => {
  const Document = sequelize.define("document", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    fileType: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    url: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    comments: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    size: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });

  Document.associate = (models) => {
    Document.belongsTo(models.District);
  };

  Document.associate = (models) => {
    Document.belongsTo(models.User);
  };

  return Document;
};

module.exports = document;
