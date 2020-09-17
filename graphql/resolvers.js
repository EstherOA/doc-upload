const { Document } = require("../models").models;
const { User } = require("../models").models;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { AuthenticationError } = require("apollo-server-express");

const verifyToken = (token) => {
  try {
    const { email } = jwt.verify(token, "supersecret");
    return { email, token };
  } catch (e) {
    throw new AuthenticationError(
      "Authentication token is invalid, please log in"
    );
  }
};

const resolvers = {
  Query: {
    async getDocument(_, args) {
      if (args.id) {
        return await Document.findOne({ where: { id: args.id } });
      }
      throw new Error("Document not found");
    },
    async getAllDocuments(_, args) {
      const docList = await Document.findAll();
      if (docList) {
        return docList;
      }
      throw new Error("Error while retrieving documents");
    },
    async getDocumentsByRegion(_, args) {
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
    async getDocumentsByDistrict(_, args) {
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
    async getDocumentsByUserId(_, args) {
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
    async createDocument(_, args) {
      if (args) {
        return await Document.create(args);
      }
      throw new Error("Document creation failed");
    },
    async removeDocument(_, args) {
      return await Document.destroy({
        where: {
          id: args.id,
        },
      });
    },
    async registerUser(_, args) {
      const user = await User.create({
        password: await bcrypt.hash(password, 10),
        ...args,
      });

      return jwt.sign(
        { email: user.email, id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: "3m" }
      );
    },
    async loginUser(_, { email, password }) {
      const user = await User.findOne({ where: { email: email } });
      if (!user) {
        throw new AuthenticationError("User does not exist");
      }

      const isUserValid = await bcrypt.compare(password, user.password);

      if (!valid) {
        throw new AuthenticationError("Authentication failed");
      }

      const token = jwt.sign(
        { email: email, id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: "3m" }
      );
      return { user, token };
    },
    async forgotPassword(_, { password }) {},
    async updateUser(_, args) {},
    async deleteUser(_, args) {},
  },
};

module.exports = resolvers;
