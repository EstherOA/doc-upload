"use strict";

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
    district: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    region: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });

  Document.associate = (models) => {
    Document.belongsTo(models.User);
  };

  // Document.findByRegion = async (region) => {
  //   let documentList = await Document.findAll({
  //     where: {
  //       region: region,
  //     },
  //   });
  //   return documentList;
  // };

  // Document.findByDistrict = async (district) => {
  //   let documentList = await Document.findAll({
  //     where: {
  //       district: district,
  //     },
  //   });
  //   return documentList;
  // };

  // Document.findByUserId = async (userId) => {
  //   let documentList = await Document.findAll({
  //     where: {
  //       userId: userId,
  //     },
  //   });
  //   return documentList;
  // };

  return Document;
};

module.exports = document;
