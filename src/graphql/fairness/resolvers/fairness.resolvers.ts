import { container } from "../../../config/dependency-injection/container";
import { ContextValue } from "../../../model/context.graphql.model";
import { FairnessService } from "../../../service/fairness/fairness.service";

export const resolvers = {
    Query : {
        getNextFairness: async (_: any, __: any, contextValue: ContextValue) => {
            if (!contextValue.user) {
                throw new Error("You must be logged in to do that.");
            }
            const fairnessService = container.resolve(FairnessService);
            return fairnessService.getNextFairness(contextValue.user.id)
        },
        getOldFairness: async (_: any, args: {gameId: number}) => {
            const {gameId} = args;
            const fairnessService = container.resolve(FairnessService);
            return fairnessService.getOldFairness(gameId);
        }
    }
}