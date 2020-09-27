require("dotenv").config();
var express = require("express");
var http = require("http");
var bodyParser = require("body-parser");
var { sequelize } = require("./models");
const router = express.Router();
const { ApolloServer } = require("apollo-server-express");

const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");
var cors = require("cors");
const { getUserFromToken } = require("./graphql/auth");

var app = express();

//cors and graphql
app.use("*", cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res, next) => {
  res.json({
    status: "success",
    data: "Hello Omnistan Upload",
  });
});
app.use("/", router);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: {
    endpoint: "/graphql",
  },
  context: async ({ req }) => {
    const authorisation = req.headers.authorization || "";

    const user = await getUserFromToken(authorisation.split(" ")[1]);

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
