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

  type UserDistrict {
    userId: ID!
    districtId: ID!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    users(id: ID): [User!]!
    documents(id: ID, regionId: ID, userId: ID, districtId: ID): [Document!]!
    regions(id: ID): [Region!]!
    districts(id: ID, regionId: ID): [District!]!
    getUserDistricts(id: ID!): [District]
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
    setUserDistricts(id: ID!, districts: [ID!]!): Boolean
    addUser(id: ID!, userId: ID!): UserDistrict
    removeDistrictUser(id: ID!, userId: ID!): Boolean
  }
`;

module.exports = schema;
