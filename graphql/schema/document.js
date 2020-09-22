const { gql } = require("apollo-server-express");

const docSchema = gql`
  type Document {
    id: Int!
    name: String!
    url: String!
    fileType: String!
    userId: Int!
    districtId: String!
    regionId: String!
    comments: String!
  }
`;

module.exports = docSchema;
