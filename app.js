require("dotenv").config();
var express = require("express");
var { models, sequelize } = require("./models");
const { ApolloServer } = require("apollo-server-express");

const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");
var cors = require("cors");

var app = express();

//cors and graphql
app.use("*", cors());

const auth = jwt({
  secret: process.env.JWT_SECRET,
  credentialsRequired: false,
});
app.use(auth);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: {
    endpoint: "/graphql",
  },
  context: ({ req }) => {
    const token = req.headers.authorization || "";
    return { token };
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
