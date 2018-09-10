import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import { ApolloServer, gql } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';

import models from './models';

dotenv.config();

const PORT = 4000;

const app = express();

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};

const graphqlEndpoint = '/graphql';

const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({
  app,
  gui: {
    endpoint: graphqlEndpoint,
  },
});

// create or sync models with db
models.sequelize.sync()
  .then(() => {
    app.listen({ port: PORT }, () =>
      console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
    );
  });
