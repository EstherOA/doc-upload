const { Document } = require("../../models").models;
const Joi = require("joi");
const { District } = require("../../models").models;

const documentResolver = {
  Query: {
    async getDocument(_, args, context) {
      const schema = Joi.object({
        id: Joi.string().alphanum().required(),
      });

      try {
        const { error } = schema.validate(args);

        if (error) {
          console.log(error);
          throw new Error(error);
        }

        return await Document.findOne({ where: { id: args.id } });
      } catch (e) {
        console.log("Error fetching document: ", e);
        throw new Error(e);
      }
    },
    async getAllDocuments(_, args, context) {
      try {
        return await Document.findAll();
      } catch (e) {
        console.log("Error fetching documents: ", e);
        throw new Error(e);
      }
    },
    async getDocumentsByRegion(_, args, context) {
      const schema = Joi.object({
        regionId: Joi.string().alphanum().required(),
      });

      try {
        const { error } = schema.validate(args);

        if (error) {
          console.log(error);
          throw new Error(error);
        }
        return await Document.findAll({
          include: [
            {
              model: District,
              where: { regionId: args.regionId },
            },
          ],
        });
      } catch (e) {
        console.log("Error fetching documents: ", e);
        throw new Error(e);
      }
    },
    async getDocumentsByDistrict(_, args, context) {
      const schema = Joi.object({
        districtId: Joi.string().alphanum().required(),
      });

      try {
        const { error } = schema.validate(args);

        if (error) {
          console.log(error);
          throw new Error(error);
        }
        return await Document.findAll({
          where: {
            districtId: args.districtId,
          },
        });
      } catch (e) {
        console.log("Error fetching document: ", e);
        throw new Error(e);
      }
    },
    async getDocumentsByUserId(_, args, context) {
      const schema = Joi.object({
        userId: Joi.string().alphanum().required(),
      });

      try {
        const { error } = schema.validate(args);

        if (error) {
          console.log(error);
          throw new Error(error);
        }
        return await Document.findAll({
          where: {
            userId: args.userId,
          },
        });
      } catch (e) {
        console.log("Error fetching document: ", e);
        throw new Error(e);
      }
    },
  },
  Mutation: {
    async createDocument(_, args, context) {
      const schema = Joi.object({
        name: Joi.string().min(2).required(),
        url: Joi.string().min(3).required(),
        fileType: Joi.string().min(2).required(),
        size: Joi.number().required().max(500000),
        comments: Joi.string().min(3).max(100),
        districtId: Joi.string().alphanum().required(),
        userId: Joi.string().alphanum().required(),
      });

      try {
        const { error } = schema.validate(args);

        if (error) {
          console.log(error);
          throw new Error(error);
        }
        return await Document.create(args);
      } catch (e) {
        console.log("Error creating document: ", e);
        throw new Error(e);
      }
    },
    async removeDocument(_, args, context) {
      const schema = Joi.object({
        id: Joi.string().alphanum().required(),
      });

      try {
        const { error } = schema.validate(args);

        if (error) {
          console.log(error);
          throw new Error(error);
        }

        return await Document.destroy({
          where: {
            id: args.id,
          },
        });
      } catch (e) {
        console.log("Error deleting document: ", e);
        throw new Error(e);
      }
    },
    async updateDocument(_, args, context) {
      const schema = Joi.object({
        id: Joi.string().alphanum().required(),
        name: Joi.string().min(2),
        url: Joi.string().min(3),
        fileType: Joi.string().min(2),
        size: Joi.number().max(500000),
        comments: Joi.string().min(3).max(100),
        districtId: Joi.string().alphanum(),
        userId: Joi.string().alphanum(),
      });

      try {
        const { error } = schema.validate(args);

        if (error) {
          console.log(error);
          throw new Error(error);
        }
        const { id, ...data } = args;

        const result = await Document.update(data, {
          where: {
            id: id,
          },
        });
        if (!result) throw new Error();
        return await Document.findOne({
          where: {
            id: id,
          },
        });
      } catch (e) {
        console.log("Error updating document: ", e);
        throw new Error(e);
      }
    },
  },
};

module.exports = documentResolver;
