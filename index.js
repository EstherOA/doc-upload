require("dotenv").config();
var express = require("express");
var jwt = require("jsonwebtoken");
var { models, sequelize } = require("./models");
const { ApolloServer } = require("apollo-server-express");

const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");
var cors = require("cors");
const { getUserFromToken } = require("./graphql/auth");

var app = express();

//cors and graphql
app.use("*", cors());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: {
    endpoint: "/graphql",
  },
  context: ({ req }) => {
    const token = req.headers.authorization || "";

    const user = getUserFromToken(token);

    return { user };
  },
});

server.applyMiddleware({ app });

const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log("The server started on port " + PORT);
  });
});

module.exports = app;
