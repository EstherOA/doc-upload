const { Document } = require("../../models").models;

const documentResolver = {
  Query: {
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
          regionId: args.regionId,
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
          districtId: args.districtId,
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
    async updateDocument(_, args, context) {
      const { id, ...data } = args;

      if (data) {
        Document.update(data, {
          where: {
            id: id,
          },
        });
        return await Document.findOne({
          where: {
            id: id,
          },
        });
      }
    },
  },
};

module.exports = documentResolver;
