import { resolvers } from "./resolvers/user.resolvers";
import { schema } from "./schema/user.schema";

export const userDefinition = {
  schema,
  resolvers,
};
