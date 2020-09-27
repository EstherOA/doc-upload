const { gql } = require("apollo-server-express");

const regionSchema = gql`
  type Region {
    id: ID!
    name: String!
    createdAt: String!
    updatedAt: String!
    deletedAt: String
  }
`;

module.exports = regionSchema;
