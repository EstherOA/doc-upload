"use strict";

const district = (sequelize, Sequelize) => {
  const District = sequelize.define("district", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });

  District.associate = (models) => {
    District.belongsTo(models.Region);
  };

  District.associate = (models) => {
    District.belongsToMany(models.User, { through: "UserDistrict" });
  };

  return District;
};

module.exports = district;
