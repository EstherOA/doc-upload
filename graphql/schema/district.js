const { gql } = require("apollo-server-express");

const districtSchema = gql`
  type District {
    id: Int!
    name: String!
    regionId: Int!
  }
`;

module.exports = districtSchema;
