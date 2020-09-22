const { gql } = require("apollo-server-express");

const userSchema = gql`
  type User {
    id: Int!
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }
`;

module.exports = userSchema;
