require("dotenv").config();
var express = require("express");
var jwt = require("jsonwebtoken");
var http = require("http");
var { sequelize } = require("./models");
const { ApolloServer, gql } = require("apollo-server-express");

const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");
var cors = require("cors");
const { getUserFromToken } = require("./graphql/auth");

var app = express();

//cors and graphql
app.use("*", cors());

// const typeDefs = gql`
//   type Book {
//     title: String
//     author: String
//   }

//   type Query {
//     books: [Book]
//   }
// `;

// const resolvers = {
//   Query: {
//     books: () => ["books"],
//   },
// };

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
  introspection: true,
});

server.applyMiddleware({ app });

const httpServer = http.createServer(app);

const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
  httpServer.listen(PORT, () => {
    console.log("The server started on port " + PORT);
  });
});

module.exports = server;
