const { District } = require("../../models").models;
const { User } = require("../../models").models;
const Joi = require("joi");
const user = require("../../models/user");
const { isAuthenticatedUser, isAuthorisedUser } = require("../utils");
const Op = require("sequelize").Op;

const getDistrict = async (id) => {
  const district = await District.findOne({ where: { id: id } });
  if (!district) throw new Error("District not found");
  return [district];
};

const getAllDistricts = async () => {
  return await District.findAll();
};

const getDistrictsByRegion = async (regionId) => {
  return await District.findAll({
    where: {
      regionId: regionId,
    },
  });
};

const districtResolver = {
  Query: {
    async getDistrictUsers(_, args, context) {
      isAuthenticatedUser(context.user);
      await isAuthorisedUser(context.user, args.id);

      const schema = Joi.object({
        id: Joi.string().alphanum().required(),
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
          return district.getUsers();
        }
        throw new Error("District not found");
      } catch (e) {
        console.log("Error fetching users: ", e);
        throw new Error(e);
      }
    },
    async districts(_, args, context) {
      isAuthenticatedUser(context.user);
      const schema = Joi.object({
        id: Joi.string().alphanum(),
        regionId: Joi.string().alphanum(),
      }).nand("id", "regionId");
      try {
        const { error } = schema.validate(args);

        if (error) {
          console.log(error);
          throw new Error("Invalid data: ", error);
        }
        if (args.id) {
          await isAuthorisedUser(context.user, args.id);
          return await getDistrict(args.id);
        } else if (args.regionId) {
          return await getDistrictsByRegion(args.regionId);
        } else {
          return await getAllDistricts();
        }
      } catch (e) {
        console.log("Error fetching districts: ", e);
        throw new Error(e);
      }
    },
  },
  Mutation: {
    async createDistrict(_, args, context) {
      isAuthenticatedUser(context.user);

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
      isAuthenticatedUser(context.user);
      await isAuthorisedUser(context.user, args.id);

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
      isAuthenticatedUser(context.user);
      await isAuthorisedUser(context.user, args.id);

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
      isAuthenticatedUser(context.user);
      await isAuthorisedUser(context.user, args.id);

      const schema = Joi.object({
        userId: Joi.string().alphanum().required(),
        id: Joi.string().alphanum().required(),
      });

      try {
        const { error } = schema.validate(args);

        if (error) {
          console.log(error);
          throw new Error("Invalid data");
        }
        let district = await District.findOne({
          where: {
            id: args.id,
          },
        });
        if (!district) {
          throw new Error("District not found");
        }
        const user = await User.findOne({
          where: {
            id: args.userId,
          },
        });
        if (await district.hasUser(user)) {
          throw new Error(`District already has user: ${args.userId}`);
        }
        return await district.addUser(args.userId);
      } catch (e) {
        console.log("Error adding user to district: ", e);
        throw new Error(e);
      }
    },
    async removeDistrictUser(_, args, context) {
      isAuthenticatedUser(context.user);
      await isAuthorisedUser(context.user, args.id);

      const schema = Joi.object({
        userId: Joi.string().alphanum().required(),
        id: Joi.string().alphanum().required(),
      });
      try {
        const { error } = schema.validate(args);

        if (error) {
          console.log(error);
          throw new Error("Invalid data");
        }
        let district = await District.findOne({
          where: {
            id: args.id,
          },
        });
        if (!district) {
          throw new Error("District not found");
        }
        return await district.removeUser(args.userId);
      } catch (e) {
        console.log("Error removing user from district: ", e);
        throw new Error(e);
      }
    },
  },
};

module.exports = districtResolver;
