import { BoilerplateFairness, FinishedFairness, HiddenFairness, ShownFairness } from "../../model/fairness.model";

export interface IFairnessRepository {
    getNextHash(userId: number) : Promise<HiddenFairness>
    getHashFromGameId(gameId: number) : Promise<FinishedFairness | null>
    getHashFromUserId(userId: number) : Promise<ShownFairness>

    insertNewHash(fairness: BoilerplateFairness) : Promise<HiddenFairness>
    updateHash(fairness: FinishedFairness) : Promise<void>
}
export const IFairnessRepository = Symbol('IFairnessRepository');