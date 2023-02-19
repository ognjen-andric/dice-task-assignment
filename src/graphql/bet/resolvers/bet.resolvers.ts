import { container } from "../../../config/dependency-injection/container";
import { BetInput } from "../../../model/bet.model";
import { ContextValue } from "../../../model/context.graphql.model";
import { BetService } from "../../../service/bet/bet.service";
import { GraphQLError } from "graphql";

export const resolvers = {
  Query: {
    getBet: async (_: any, args: { id: number }) => {
      const { id } = args;
      const betService = container.resolve(BetService);
      const bet = await betService.getBet(id);
      if (!bet) throw new GraphQLError("Bet could not be found.");
      return bet;
    },
    getBetList: async () => {
      const betService = container.resolve(BetService);
      return await betService.getBetList();
    },
    getBestBetPerUser: async (_: any, args: { limit?: number }) => {
      const { limit } = args;
      const betService = container.resolve(BetService);
      return await betService.getBestBetPerUser(limit);
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
