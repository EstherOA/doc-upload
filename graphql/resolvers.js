const { Document } = require("../models").models;
const { User } = require("../models").models;

const bcrypt = require("bcrypt");
const { AuthenticationError } = require("apollo-server-express");
const { createToken, verifyToken, authoriseUser } = require("./auth");

const resolvers = {
  Query: {
    async getUser(_, args, context) {
      const user = await User.findOne({ where: { id: args.id } });
      return user;
    },
    async getDocument(_, args, context) {
      if (args.id) {
        return await Document.findOne({ where: { id: args.id } });
      }
      throw new Error("Document not found");
    },
    async getAllDocuments(_, args, context) {
      const docList = await Document.findAll();
      if (docList) {
        return docList;
      }
      throw new Error("Error while retrieving documents");
    },
    async getDocumentsByRegion(_, args, context) {
      if (!context) throw new Error("You must be logged in");
      const docList = await Document.findAll({
        where: {
          region: args.region,
        },
      });
      if (docList) {
        return docList;
      }
      throw new Error("Error while retrieving documents");
    },
    async getDocumentsByDistrict(_, args, context) {
      const docList = await Document.findAll({
        where: {
          district: args.district,
        },
      });
      if (docList) {
        return docList;
      }
      throw new Error("Error while retrieving documents");
    },
    async getDocumentsByUserId(_, args, context) {
      const docList = await Document.findAll({
        where: {
          userId: args.userId,
        },
      });
      if (docList) {
        return docList;
      }
      throw new Error("Error while retrieving documents");
    },
  },
  Mutation: {
    async createDocument(_, args, context) {
      if (args) {
        return await Document.create(args);
      }
      throw new Error("Document creation failed");
    },
    async removeDocument(_, args, context) {
      return await Document.destroy({
        where: {
          id: args.id,
        },
      });
    },
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

module.exports = resolvers;
