import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { ApolloServer, gql, makeExecutableSchema } from 'apollo-server-express';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import cors from 'cors';

import models from './models';

dotenv.config();

// Merging all typeDefs and resolver files respectively for scalability
const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './types')));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));

const PORT = 4000;

const app = express();
const SECRET = process.env.secret;
const SECRET2 = process.env.secret2;

app.use(cors('*'));

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const graphqlEndpoint = '/graphql';

const server = new ApolloServer({
  schema,
  context: {
    models,
    user: {
      id: 1,
    },
    SECRET,
    SECRET2,
  },
});

server.applyMiddleware({
  app,
  gui: {
    endpoint: graphqlEndpoint,
  },
});

// create or sync models with db
models.sequelize.sync()
  .then(() => {
    app.listen({ port: PORT }, () => console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`));
  });
