const { gql } = require("apollo-server-express");

const docSchema = gql`
  type Document {
    id: ID!
    name: String!
    url: String!
    fileType: String!
    userId: ID!
    districtId: ID!
    comments: String!
    size: Float!
    createdAt: String!
    updatedAt: String!
    deletedAt: String
  }
`;

module.exports = docSchema;
