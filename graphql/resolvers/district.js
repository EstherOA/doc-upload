const { District } = require("../../models").models;

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
    async getDistrictsByRegion(_, args, context) {
      const districts = await District.findAll({
        where: {
          regionId: args.regionId,
        },
      });
      if (districts) {
        return districts;
      }
      throw new Error("Error while retrieving districts");
    },
    async getDistrictUsers(_, args, context) {
      const district = await District.findOne({
        where: {
          id: args.id,
        },
      });
      if (district) {
        return district.getUserDistricts();
      }
      throw new Error("Error while retrieving district users");
    },
  },
  Mutation: {
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
    async addUser(_, args, context) {
      const district = await District.findOne({
        where: {
          id: args.id,
        },
      });
      if (district && !district.hasUserDistrict(args.userId)) {
        district.addUserDistrict(args.userId);
      }
    },
  },
};

module.exports = districtResolver;
