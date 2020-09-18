const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Document {
    id: Int!
    name: String!
    url: String!
    fileType: String!
    userId: Int!
    district: String!
    region: String!
  }

  type User {
    id: Int!
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }

  type AuthPayload {
    user: User!
    token: String!
  }

  type Query {
    getUser(id: Int!): User
    getDocument(id: Int!): Document
    getAllDocuments: [Document]
    getDocumentsByRegion(region: String!): [Document]
    getDocumentsByDistrict(district: String!): [Document]
    getDocumentsByUserId(userId: Int!): [Document]
  }

  type Mutation {
    createDocument(
      name: String!
      url: String!
      region: String!
      district: String!
      fileType: String!
      userId: Int!
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
    removeUser(id: ID!): Boolean
  }
`;

module.exports = typeDefs;
