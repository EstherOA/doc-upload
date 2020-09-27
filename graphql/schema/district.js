const { gql } = require("apollo-server-express");

const districtSchema = gql`
  type District {
    id: ID!
    name: String!
    regionId: ID!
    createdAt: String!
    updatedAt: String!
    deletedAt: String
  }
`;

module.exports = districtSchema;
