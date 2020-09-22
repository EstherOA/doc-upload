const { District } = require("../models").models;

const districtResolver = {
  Query: {
    async getDistrict(_, args, context) {
      if (args.id) {
        return await District.findOne({ where: { id: args.id } });
      }
      throw new Error("District not found");
    },
    async getAllDistricts(_, args, context) {
      const districtList = await District.findAll();
      if (districtList) {
        return districtList;
      }
      throw new Error("Error while retrieving districts");
    },
    //get all districts in a region
    //get all users in a district
  },
  Mutation: {
    //set users in district
    async createDistrict(_, args, context) {
      if (args) {
        return await District.create(args);
      }
      throw new Error("District creation failed");
    },
    async removeDistrict(_, args, context) {
      return await District.destroy({
        where: {
          id: args.id,
        },
      });
    },
    async updateDistrict(_, args, context) {
      const { id, ...data } = args;

      if (data) {
        District.update(data, {
          where: {
            id: id,
          },
        });
        return await District.findOne({
          where: {
            id: id,
          },
        });
      }
    },
  },
};

module.exports = districtResolver;
