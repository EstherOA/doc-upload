const { User } = require("../../models").models;

const bcrypt = require("bcrypt");
const { AuthenticationError } = require("apollo-server-express");
const { createToken, verifyToken, authoriseUser } = require("../auth");

const userResolver = {
  Query: {
    async getUser(_, args, context) {
      const user = await User.findOne({ where: { id: args.id } });
      return user;
    },
  },
  Mutation: {
    async registerUser(_, args) {
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
      return { user, token };
    },
    async loginUser(_, { email, password }) {
      const user = await User.findOne({ where: { email: email } });
      if (!user) {
        throw new AuthenticationError("User does not exist");
      }

      const isUserValid = await bcrypt.compare(password, user.password);

      if (!isUserValid) {
        throw new AuthenticationError("Authentication failed");
      }
      const token = createToken(user);

      return { user, token };
    },
    async forgotPassword(_, { password }, context) {},
    async updateUser(_, args, context) {
      const { id, ...data } = args;

      if (data) {
        User.update(data, {
          where: {
            id: id,
          },
        });
        return await User.findOne({
          where: {
            id: id,
          },
        });
      }
    },
    async removeUser(_, args, context) {
      return await User.destroy({
        where: {
          id: args.id,
        },
      });
    },
  },
};

module.exports = userResolver;
