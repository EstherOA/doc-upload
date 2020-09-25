const { gql } = require("apollo-server-express");
const districtSchema = require("./district");
const regionSchema = require("./region");
const docSchema = require("./document");
const userSchema = require("./user");

const schema = gql`
  ${userSchema}

  ${docSchema}

  ${regionSchema}

  ${districtSchema}

  type AuthPayload {
    user: User!
    token: String!
  }

  type Query {
    getUser(id: Int!): User
    getAllUsers: [User]
    getDocument(id: Int!): Document
    getAllDocuments: [Document]
    getDocumentsByRegion(regionId: Int!): [Document]
    getDocumentsByDistrict(districtId: Int!): [Document]
    getDocumentsByUserId(userId: Int!): [Document]
    getRegion(id: Int!): Region
    getAllRegions: [Region]
    getDistrict(id: Int!): District
    getAllDistricts: [District]
  }

  type Mutation {
    createDocument(
      name: String!
      url: String!
      fileType: String!
      userId: Int!
      districtId: String!
      comments: String!
      size: Float!
    ): Document
    updateDocument(
      id: Int!
      name: String
      url: String
      fileType: String
      userId: Int
      districtId: String
      size: Float
      comments: String
    ): Document
    removeDocument(id: ID!): Boolean
    registerUser(
      firstName: String!
      lastName: String!
      email: String!
      password: String!
    ): AuthPayload
    loginUser(email: String!, password: String!): AuthPayload
    forgotPassword(password: String!): User
    updateUser(
      id: Int!
      firstName: String
      lastName: String
      email: String
    ): User
    createRegion(name: String!): Region
    updateRegion(id: Int!, name: String!): Region
    createDistrict(name: String!, regionId: Int!): District
    updateDistrict(id: Int!, name: String, regionId: Int): District
    removeUser(id: ID!): Boolean
    removeRegion(id: ID!): Boolean
    removeDistrict(id: ID!): Boolean
  }
`;

module.exports = schema;
