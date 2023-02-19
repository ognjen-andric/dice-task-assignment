import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSchema } from "graphql";
import { betDefinition } from "./graphql/bet";
import { schema } from "./graphql/default.schema";
import { userDefinition } from "./graphql/user";
import { contextAuthMiddleware } from "./middleware/context-auth/context-auth.middleware";

const getDefaultSchema = () => {
  //As I haven't worked with BE GraphQL
  // I have a hunch that there is a nicer and easier solution for
  /// modularizing my schema but can't think of one at this moment...
  return schema;
};

const getDefinitions = () => {
  const schemas = [
    getDefaultSchema(),
    betDefinition.schema,
    userDefinition.schema,
  ];
  return buildSchema(schemas.join("\n"));
};

const getResolvers = () => {
  return {
    Query: {
      ...userDefinition.resolvers.Query,
      ...betDefinition.resolvers.Query,
    },
    Mutation: {
      ...userDefinition.resolvers.Mutation,
      ...betDefinition.resolvers.Mutation,
    },
  };
};

export const startGraphqlServer = async () => {
  const server = new ApolloServer({
    typeDefs: getDefinitions(),
    resolvers: getResolvers(),
  });

  const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => {
      return await contextAuthMiddleware(req);
    },
  });

  console.log(`Running Apollo GraphQL at : ${url}`);
};
