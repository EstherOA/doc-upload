const { gql } = require("apollo-server-express");

const regionSchema = gql`
  type Region {
    id: Int!
    name: String!
  }
`;

module.exports = regionSchema;
