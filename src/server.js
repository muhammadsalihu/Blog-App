import express from "express";
import dotenv from "dotenv";
import { ApolloServer } from "apollo-server-express";
import http from "http";

import "./config/db";
import constants from "./config/constants";
import typeDefs from "./graphql/schema";
import resolvers from "./graphql/resolvers";
import authMiddlewares from "./config/middlewares";

const app = express();
dotenv.config();
const port = process.env.PORT;
app.use(express.json());
authMiddlewares(app);

// Apollo server set up for graphql (See Documentation)
const schema = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true, // To enable graphiql in Production Mode
  context: ({ req, res, connection }) => {
    // Check for either a http request or a subscription
    if (connection) {
      return connection.context;
    } else {
      const logged_in_user = req.isAuth;
      const Id = req.userId;
      const admin = req.isAdmin;
      const employee = req.isEmployee;

      return {
        logged_in_user,
        Id,
        admin,
        employee
      };
    }
  }
});

schema.applyMiddleware({ app, path: constants.GRAPHQL_PATH });

// Wrap the Express server, Server setup for websockets to use graphql subscriptions
const graphQLServer = http.createServer(app);
schema.installSubscriptionHandlers(graphQLServer);

graphQLServer.listen(port, () => {
  console.log(`Server is Listening on Port ${port}`);
  console.log(
    `🚀 Subscriptions ready at ws://localhost:${port}${schema.subscriptionsPath}`
  );
});
