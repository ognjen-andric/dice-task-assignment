import { container } from "../../../config/dependency-injection/container";
import { BetInput } from "../../../model/bet.model";
import { ContextValue } from "../../../model/context.graphql.model";
import { BetService } from "../../../service/bet/bet.service";

export const resolvers = {
  Query: {
    getBet: () => {
      return null;
    },
  },
  Mutation: {
    createBet: async (
      _: any,
      args: { input: BetInput },
      contextValue: ContextValue
    ) => {
      const { input } = args;
      const betService = container.resolve(BetService);
      if (!contextValue.user) {
        throw new Error("You must be logged in to do that.");
      }
      return await betService.createBet(input, contextValue.user);
    },
  },
};
