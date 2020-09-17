"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Documents", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      url: {
        type: Sequelize.STRING,
      },
      type: {
        type: Sequelize.STRING,
      },
      userId: {
        type: Sequelize.STRING,
      },
      district: {
        type: Sequelize.STRING,
      },
      region: {
        type: Sequelize.STRING,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Documents");
  },
};
