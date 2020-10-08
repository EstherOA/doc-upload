const { Document } = require("../../models").models;
const Joi = require("joi");
const Op = require("sequelize").Op;
const { District } = require("../../models").models;
const {
  isAuthenticatedUser,
  isAuthorisedUser,
  getUserDistrictIds,
  saveDocumentToS3,
  deleteDocumentFromS3,
} = require("../utils");
const { v4: uuidv4 } = require("uuid");

const getDocument = async (id) => {
  const document = await Document.findOne({ where: { id: id } });
  if (!document) throw new Error("Document not found");
  return document;
};

const getAllDocuments = async () => {
  return await Document.findAll();
};

const getDocumentsByRegion = async (regionId) => {
  return await Document.findAll({
    include: [
      {
        model: District,
        where: { regionId: regionId },
      },
    ],
  });
};

const getDocumentsByUserId = async (userId) => {
  return await Document.findAll({
    where: {
      userId: userId,
    },
  });
};

const getDocumentsByDistrict = async (districtId) => {
  return await Document.findAll({
    where: {
      districtId: args.districtId,
    },
  });
};

const documentResolver = {
  Query: {
    async documents(_, args, context) {
      isAuthenticatedUser(context.user);
      const schema = Joi.object({
        userId: Joi.string().alphanum(),
        districtId: Joi.string().alphanum(),
        regionId: Joi.string().alphanum(),
      }).nand("userId", "districtId", "regionId");
      try {
        const { error } = schema.validate(args);

        if (error) {
          console.log(error);
          throw new Error(error);
        }

        if (args.id) {
          await isAuthorisedUser(context.user, args.id);
          await getDocument(args.id);
        } else if (args.regionId) {
          await getDocumentsByRegion(args.regionId);
        } else if (args.districtId) {
          await getDocumentsByDistrict(args.districtId);
        } else if (args.userId) {
          await getDocumentsByUserId(args.userId);
        } else await getAllDocuments();
      } catch (e) {
        console.log("Error fetching documents: ", e);
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
        const district = await District.findOne({
          where: { id: args.districtId },
        });
        if (!district) throw new Error("District does not exist");
        const data = saveDocumentToS3(
          district.getRegion().name,
          district.name,
          uuidv4()
        );
        return await Document.create({ url: data.Location, ...args });
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

        if (doc) {
          deleteDocumentFromS3(doc.name.split(".")[0]);
          return doc.destroy();
        }
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
