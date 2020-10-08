"use strict";

const region = (sequelize, Sequelize) => {
  const Region = sequelize.define("region", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });

  Region.associate = (models) => {
    Region.hasMany(models.District, {
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };

  return Region;
};

module.exports = region;
