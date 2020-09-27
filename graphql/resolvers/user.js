const { User } = require("../../models").models;
const { District } = require("../../models").models;
const bcrypt = require("bcrypt");
const { AuthenticationError } = require("apollo-server-express");
const { createToken, isAuthenticatedUser } = require("../auth");

const Op = require("sequelize").Op;

const Joi = require("joi");

const userResolver = {
  Query: {
    async getUser(_, { id }, context) {
      isAuthenticatedUser(context.user);

      const schema = Joi.object({
        id: Joi.string().alphanum().required(),
      });

      try {
        const { error } = schema.validate({ id });

        if (error) {
          throw new Error("Invalid data");
        }
        const user = await User.findOne({ where: { id: id } });
        return user;
      } catch (e) {
        console.log("Error retrieving user: ", e);
        throw new Error(e);
      }
    },
    async getAllUsers(_, args, context) {
      isAuthenticatedUser(context.user);

      try {
        return await User.findAll();
      } catch (e) {
        console.log("Error retrieving users: ", e);
        throw new Error(e);
      }
    },
    async getUserDistricts(_, args, context) {
      isAuthenticatedUser(context.user);

      const schema = Joi.object({
        id: Joi.string().alphanum().required(),
      });

      try {
        const { error } = schema.validate(args);

        if (error) {
          throw new Error("Invalid data");
        }

        const user = await User.findOne({
          where: {
            id: args.id,
          },
        });
        if (!user) {
          throw new Error("User not found");
        }
        return user.getDistricts();
      } catch (e) {
        console.log("Error retrieving user districts: ", e);
        throw new Error(e);
      }
    },
  },
  Mutation: {
    async registerUser(_, args) {
      const schema = Joi.object({
        firstName: Joi.string().min(2).required(),
        lastName: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        password: Joi.string().alphanum().min(6).required(),
      });

      try {
        const { error } = schema.validate(args);

        if (error) {
          throw new Error("Invalid data");
        }

        const foundUser = await User.findOne({
          where: {
            email: args.email,
          },
        });

        if (foundUser) {
          throw new Error("User already exists");
        }

        const { password, ...data } = args;
        const user = await User.create({
          password: await bcrypt.hash(args.password, 10),
          ...data,
        });

        const token = createToken(user);
        return { user, token, tokenExpiration: 600000 };
      } catch (e) {
        console.log("Error registering user: ", e);
        throw new Error(e);
      }
    },
    async loginUser(_, { email, password }) {
      const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().alphanum().min(6).required(),
      });

      try {
        const { error } = schema.validate({ email, password });

        if (error) {
          throw new Error("Invalid data");
        }

        const user = await User.findOne({ where: { email: email } });
        if (!user) {
          throw new AuthenticationError("User does not exist");
        }

        const isUserValid = await bcrypt.compare(password, user.password);

        if (!isUserValid) {
          throw new AuthenticationError("Authentication failed");
        }
        const token = createToken(user);

        return { user, token, tokenExpiration: 600000 };
      } catch (e) {
        console.log("Error logging in user: ", e);
        throw new AuthenticationError(e);
      }
    },
    async forgotPassword(_, { password }, context) {},
    async updateUser(_, args, context) {
      isAuthenticatedUser(context.user);

      const schema = Joi.object({
        id: Joi.string().alphanum().required(),
        firstName: Joi.string().min(2),
        lastName: Joi.string().min(3),
        email: Joi.string().email().required(),
        password: Joi.string().alphanum().min(6),
      });

      try {
        const { error } = schema.validate(args);

        if (error) {
          throw new Error("Invalid data");
        }

        const { id, ...data } = args;

        const result = await User.update(data, {
          where: {
            id: id,
          },
        });
        if (!result) throw new Error();

        return await User.findOne({
          where: {
            id: id,
          },
        });
      } catch (e) {
        console.log("Error updating user: ", e);
        throw new Error(e);
      }
    },
    async removeUser(_, args, context) {
      isAuthenticatedUser(context.user);

      const schema = Joi.object({
        id: Joi.string().alphanum().required(),
      });

      try {
        const { error } = schema.validate(args);

        if (error) {
          throw new Error("Invalid data");
        }

        return await User.destroy({
          where: {
            id: args.id,
          },
        });
      } catch (e) {
        console.log("Error deleting user: ", e);
        throw new Error(e);
      }
    },
    async setUserDistricts(_, args, context) {
      isAuthenticatedUser(context.user);

      const schema = Joi.object({
        id: Joi.string().alphanum().required(),
        districts: Joi.array().items(Joi.string().alphanum().required()),
      });

      try {
        const { error } = schema.validate(args);

        if (error) {
          throw new Error("Invalid data");
        }

        const user = await User.findOne({
          where: {
            id: args.id,
          },
        });
        if (!user) {
          throw new Error("User not found");
        }
        const districtList = await District.findAll({
          where: {
            id: {
              [Op.or]: args.districts,
            },
          },
        });

        if (!districtList || districtList.length < 1) {
          throw new Error("Districts not found");
        }

        await user.setDistricts(districtList);
        return true;
      } catch (e) {
        console.log("Error updating user distrcts: ", e);
        throw new Error(e);
      }
    },
  },
};

module.exports = userResolver;
