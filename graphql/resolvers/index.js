const districtResolver = require("./district");
const documentResolver = require("./document");
const regionResolver = require("./region");
const userResolver = require("./user");

const resolvers = {
  Query: {
    ...userResolver.Query,
    ...documentResolver.Query,
    ...districtResolver.Query,
    ...regionResolver.Query,
  },
  Mutation: {
    ...documentResolver.Mutation,
    ...userResolver.Mutation,
    ...regionResolver.Mutation,
    ...districtResolver.Mutation,
  },
};

module.exports = resolvers;
