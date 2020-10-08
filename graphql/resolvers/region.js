const { Region } = require("../../models").models;
const Joi = require("joi");
const { isAuthenticatedUser } = require("../utils");

const getAllRegions = async () => {
  return await Region.findAll();
};

const getRegion = async (id) => {
  let region = await Region.findOne({ where: { id: id } });
  if (!region) throw new Error("Region not found");
  return [region];
};
const regionResolver = {
  Query: {
    async regions(_, args, context) {
      isAuthenticatedUser(context.user);
      const schema = Joi.object({
        id: Joi.string().alphanum(),
      });

      try {
        const { error } = schema.validate(args);

        if (error) {
          throw new Error("Invalid data");
        }

        if (args.id) {
          return await getRegion(args.id);
        } else return await getAllRegions();
      } catch (e) {
        console.log("Error retrieving regions", e);
        throw new Error(e);
      }
    },
  },
  Mutation: {
    async createRegion(_, args, context) {
      isAuthenticatedUser(context.user);

      const schema = Joi.object({
        name: Joi.string().min(3).required(),
      });

      try {
        const { error } = schema.validate(args);

        if (error) {
          throw new Error("Invalid data");
        }
        return await Region.create(args);
      } catch (e) {
        console.log("Error creating region: ", e);
        throw new Error(e);
      }
    },
    async removeRegion(_, args, context) {
      isAuthenticatedUser(context.user);

      const schema = Joi.object({
        id: Joi.string().alphanum().required(),
      });

      try {
        const { error } = schema.validate(args);

        if (error) {
          throw new Error("Invalid data");
        }
        return await Region.destroy({
          where: {
            id: args.id,
          },
        });
      } catch (e) {
        console.log("Error deleting region: ", e);
        throw new Error(e);
      }
    },
    async updateRegion(_, args, context) {
      isAuthenticatedUser(context.user);

      const schema = Joi.object({
        name: Joi.string().min(3).required(),
        id: Joi.string().alphanum().required(),
      });

      try {
        const { error } = schema.validate(args);

        if (error) {
          console.log(error);
          throw new Error("Invalid data");
        }
        const { id, ...data } = args;

        const result = await Region.update(data, {
          where: {
            id: id,
          },
        });
        if (!result) throw new Error();

        return await Region.findOne({
          where: {
            id: id,
          },
        });
      } catch (e) {
        console.log("Error updating region: ", e);
        throw new Error(e);
      }
    },
  },
};

module.exports = regionResolver;
