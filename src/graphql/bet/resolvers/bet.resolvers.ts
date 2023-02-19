import { container } from "../../../config/dependency-injection/container";
import { BetService } from "../../../service/bet/bet.service";

export const resolvers = {
  Query: {
    getBet: () => {
      return null;
    },
  },
  Mutation: {
    createBet: async (_: any, input: any) => {
      const betService = container.resolve(BetService);
      await betService.createBet();
      return null;
    },
  },
};
