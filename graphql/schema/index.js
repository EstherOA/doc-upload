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
    tokenExpiration: Int!
  }

  type Query {
    getUser(id: ID!): User
    getAllUsers: [User]
    getDocument(id: ID!): Document
    getAllDocuments: [Document]
    getDocumentsByRegion(regionId: ID!): [Document]
    getDocumentsByDistrict(districtId: ID!): [Document]
    getDocumentsByUserId(userId: ID!): [Document]
    getRegion(id: ID!): Region
    getAllRegions: [Region]
    getDistrict(id: ID!): District
    getAllDistricts: [District]
    getUserDistricts(id: ID!): [District]
    getDistrictsByRegion(regionId: ID!): [District]
    getDistrictUsers(id: ID!): [User]
  }

  type Mutation {
    createDocument(
      name: String!
      url: String!
      fileType: String!
      userId: ID!
      districtId: ID!
      comments: String
      size: Float!
    ): Document
    updateDocument(
      id: ID!
      name: String
      url: String
      fileType: String
      userId: ID
      districtId: ID
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
      id: ID!
      firstName: String
      lastName: String
      email: String
    ): User
    createRegion(name: String!): Region
    updateRegion(id: ID!, name: String!): Region
    createDistrict(name: String!, regionId: ID!): District
    updateDistrict(id: ID!, name: String, regionId: ID): District
    removeUser(id: ID!): Boolean
    removeRegion(id: ID!): Boolean
    removeDistrict(id: ID!): Boolean
    setUserDistricts(id: ID!, districts: [ID!]!): User
    addUser(id: ID!, userId: ID!): District
  }
`;

module.exports = schema;
