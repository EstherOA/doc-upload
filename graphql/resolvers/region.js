const { Region } = require("../models").models;

const regionResolver = {
  Query: {
    async getRegion(_, args, context) {
      if (args.id) {
        return await Region.findOne({ where: { id: args.id } });
      }
      throw new Error("Region not found");
    },
    async getAllRegions(_, args, context) {
      const regionList = await Region.findAll();
      if (regionList) {
        return regionList;
      }
      throw new Error("Error while retrieving regions");
    },
  },
  Mutation: {
    async createRegion(_, args, context) {
      if (args) {
        return await Region.create(args);
      }
      throw new Error("Region creation failed");
    },
    async removeRegion(_, args, context) {
      return await Region.destroy({
        where: {
          id: args.id,
        },
      });
    },
    async updateRegion(_, args, context) {
      const { id, ...data } = args;

      if (data) {
        Region.update(data, {
          where: {
            id: id,
          },
        });
        return await Region.findOne({
          where: {
            id: id,
          },
        });
      }
    },
  },
};

module.exports = regionResolver;
