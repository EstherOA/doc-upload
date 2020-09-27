const { District } = require("../../models").models;
const Joi = require("joi");

const districtResolver = {
  Query: {
    async getDistrict(_, args, context) {
      const schema = Joi.object({
        id: Joi.string().alphanum().required(),
      });

      try {
        const { error } = schema.validate(args);

        if (error) {
          console.log(error);
          throw new Error("Invalid data");
        }

        return await District.findOne({ where: { id: args.id } });
      } catch (e) {
        console.log("Error fetching district: ", e);
        throw new Error(e);
      }
    },
    async getAllDistricts(_, args, context) {
      try {
        return await District.findAll();
      } catch (e) {
        console.log("Error while retrieving districts: ", e);
        throw new Error(e);
      }
    },
    async getDistrictsByRegion(_, args, context) {
      const schema = Joi.object({
        regionId: Joi.string().alphanum().required(),
      });

      try {
        const { error } = schema.validate(args);

        if (error) {
          console.log(error);
          throw new Error("Invalid data");
        }
        return await District.findAll({
          where: {
            regionId: args.regionId,
          },
        });
      } catch (e) {
        console.log("Error fetching districts: ", e);
        throw new Error(e);
      }
    },
    async getDistrictUsers(_, args, context) {
      const schema = Joi.object({
        regionId: Joi.string().alphanum().required(),
      });

      try {
        const { error } = schema.validate(args);

        if (error) {
          console.log(error);
          throw new Error("Invalid data");
        }
        const district = await District.findOne({
          where: {
            id: args.id,
          },
        });
        if (district) {
          return district.getUserDistricts();
        }
      } catch (e) {
        console.log("Error fetching users: ", e);
        throw new Error(e);
      }
    },
  },
  Mutation: {
    async createDistrict(_, args, context) {
      const schema = Joi.object({
        name: Joi.string().min(2).required(),
        regionId: Joi.string().alphanum().required(),
      });

      try {
        const { error } = schema.validate(args);

        if (error) {
          console.log(error);
          throw new Error("Invalid data");
        }
        return await District.create(args);
      } catch (e) {
        console.log("Error creating district: ", e);
        throw new Error(e);
      }
    },
    async removeDistrict(_, args, context) {
      const schema = Joi.object({
        id: Joi.string().alphanum().required(),
      });

      try {
        const { error } = schema.validate(args);

        if (error) {
          console.log(error);
          throw new Error("Invalid data");
        }
        return await District.destroy({
          where: {
            id: args.id,
          },
        });
      } catch (e) {
        console.log("Error deleting district: ", e);
        throw new Error(e);
      }
    },
    async updateDistrict(_, args, context) {
      const schema = Joi.object({
        name: Joi.string().min(2),
        regionId: Joi.string().alphanum(),
        id: Joi.string().alphanum().required(),
      });

      try {
        const { error } = schema.validate(args);

        if (error) {
          console.log(error);
          throw new Error("Invalid data");
        }

        const { id, ...data } = args;

        const result = await District.update(data, {
          where: {
            id: id,
          },
        });
        if (!result) throw new Error();

        return await District.findOne({
          where: {
            id: id,
          },
        });
      } catch (e) {
        console.log("Error updating district: ", e);
        throw new Error(e);
      }
    },
    async addUser(_, args, context) {
      const district = await District.findOne({
        where: {
          id: args.id,
        },
      });
      if (district && !district.hasUser(args.userId)) {
        const result = district.addUser(args.userId);
        console.log(result);
        return district;
      }
      throw new Error("Error adding user to district");
    },
  },
};

module.exports = districtResolver;
