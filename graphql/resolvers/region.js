const { Region } = require("../../models").models;
const Joi = require("joi");

const regionResolver = {
  Query: {
    async getRegion(_, args, context) {
      isAuthenticatedUser(context.user);

      const schema = Joi.object({
        id: Joi.string().alphanum().required(),
      });

      try {
        const { error } = schema.validate(args);

        if (error) {
          throw new Error("Invalid data");
        }
        return await Region.findOne({ where: { id: args.id } });
      } catch (e) {
        console.log("Error retrieving region: ", e);
        throw new Error(e);
      }
    },
    async getAllRegions(_, args, context) {
      isAuthenticatedUser(context.user);

      try {
        return await Region.findAll();
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
