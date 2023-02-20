import { inject, injectable } from "tsyringe";
import { randomUUID, createHmac } from 'crypto';
import { IFairnessRepository } from "../../repository/fairness/fairness.repository";

@injectable()
export class FairnessService{
    constructor(
        @inject(IFairnessRepository) private fairnessRepo: IFairnessRepository
    ){}

    static generateSecretValues(){
        const winningTicket = Math.floor(Math.random() * 10000);
        const secret = randomUUID();
        const hmac = createHmac('sha256', secret);
        hmac.update(winningTicket.toString());
        const hash = hmac.digest('hex');
        return {
            result: winningTicket,
            secret,
            hash
        }
    }

    async getNextFairness(userId: number) {
        return this.fairnessRepo.getNextHash(userId);
    }

    async getOldFairness(gameId: number) {
        return this.fairnessRepo.getHashFromGameId(gameId);
    }
}