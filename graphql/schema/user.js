const { gql } = require("apollo-server-express");

const userSchema = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    createdAt: String!
    updatedAt: String!
    deletedAt: String
  }
`;

module.exports = userSchema;
