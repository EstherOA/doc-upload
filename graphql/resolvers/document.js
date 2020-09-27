const { Document } = require("../../models").models;
const Joi = require("joi");
const Op = require("sequelize").Op;
const { District } = require("../../models").models;
const {
  isAuthenticatedUser,
  isAuthorisedUser,
  getUserDistrictIds,
} = require("../auth");

const documentResolver = {
  Query: {
    async getDocument(_, args, context) {
      isAuthenticatedUser(context.user);
      await isAuthorisedUser(context.user, args.id);

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
      isAuthenticatedUser(context.user);

      try {
        return await Document.findAll();
      } catch (e) {
        console.log("Error fetching documents: ", e);
        throw new Error(e);
      }
    },
    async getDocumentsByRegion(_, args, context) {
      isAuthenticatedUser(context.user);

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
      isAuthenticatedUser(context.user);

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
      isAuthenticatedUser(context.user);

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
      isAuthenticatedUser(context.user);
      await isAuthorisedUser(context.user, args.districtId);

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
      isAuthenticatedUser(context.user);

      const schema = Joi.object({
        id: Joi.string().alphanum().required(),
      });

      try {
        const { error } = schema.validate(args);

        if (error) {
          console.log(error);
          throw new Error(error);
        }

        const doc = await Document.findOne({
          where: {
            id: args.id,
            districtId: {
              [Op.or]: await getUserDistrictIds(context.user),
            },
          },
        });
        if (doc) return doc.destroy();
        throw new Error("Document not found");
      } catch (e) {
        console.log("Error deleting document: ", e);
        throw new Error(e);
      }
    },
    async updateDocument(_, args, context) {
      isAuthenticatedUser(context.user);

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
        let result = false;
        if (error) {
          console.log(error);
          throw new Error(error);
        }
        const { id, ...data } = args;
        const userDistrictList = await getUserDistrictIds(context.user);

        if (args.districtId && !userDistrictList.includes(args.districtId))
          throw new Error(
            "You do not have the permission to perform this action"
          );

        const doc = await Document.findOne({
          where: {
            id: args.id,
            districtId: {
              [Op.or]: userDistrictList,
            },
          },
        });
        console.log(doc);

        if (doc) {
          result = await doc.update(args);
        }
        if (!result) throw new Error("Document not found");
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
