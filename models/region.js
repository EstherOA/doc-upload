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
    Region.hasMany(models.District);
  };

  return Region;
};

module.exports = region;
