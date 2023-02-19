import { inject, injectable } from "tsyringe";
import { BalanceUtil } from "../../util/balance.util";
import { Bet, BetInput, BetOutcome } from "../../model/bet.model";
import { User } from "../../model/user.model";
import { IBetRepository } from "../../repository/bet/bet.repository";
import { BetRepository } from "../../repository/bet/bet.sqlite.repository";
import { IUserRepository } from "../../repository/user/user.repository";
import { Logger } from "../logger/logger.service";

@injectable()
export class BetService {
  constructor(
    @inject(IUserRepository) private userRepository: IUserRepository,
    @inject(IBetRepository) private betRepository: BetRepository,
    @inject(Logger) private logger: Logger
  ) {}

  private hasWon(input: BetInput): boolean {
    const usersTickets = input.chance * 100;
    const winningTicket = Math.floor(Math.random() * 10000);
    if (winningTicket <= usersTickets) return true;
    return false;
  }

  private getPayout(input: BetInput): number {
    return (input.amount * 100) / input.chance;
  }

  private getOutcome(input: BetInput): BetOutcome {
    const hasWon = this.hasWon(input);
    if (!hasWon) {
      return {
        hasWon,
      };
    }

    const payout = this.getPayout(input);
    return {
      hasWon,
      payout,
    };
  }

  private async insertNewBet(
    input: BetInput,
    outcome: BetOutcome,
    user: User
  ): Promise<Bet> {
    const payout = outcome.hasWon ? outcome.payout : 0;
    return this.betRepository.insertBet({
      betAmount: input.amount,
      chance: input.chance,
      payout,
      win: outcome.hasWon,
      userId: user.id,
    });
  }

  async createBet(input: BetInput, user: User): Promise<Bet> {
    return new Promise(async (resolve, reject) => {
      try {
        const newBalance = BalanceUtil.deductBalance(user, input.amount);
        const updatedUser = await this.userRepository.updateBalance(
          user,
          newBalance
        );

        const outcome = this.getOutcome(input);
        const bet = await this.insertNewBet(input, outcome, updatedUser);
        if (outcome.hasWon) {
          const payoutBalance = BalanceUtil.addBalance(
            updatedUser,
            outcome.payout
          );
          await this.userRepository.updateBalance(user, payoutBalance);
        }
        resolve(bet);
      } catch (e) {
        reject(e);
      }
    });
  }

  async getBet(id: number): Promise<Bet | null> {
    try {
      return await this.betRepository.getBet(id);
    } catch (e) {
      this.logger.error(JSON.stringify(e));
      return null;
    }
  }

  async getBetList(): Promise<Bet[]> {
    try {
      return await this.betRepository.getBetList();
    } catch (e) {
      this.logger.error(JSON.stringify(e));
      return [];
    }
  }

  async getBestBetPerUser(limit?: number): Promise<Bet[]> {
    return await this.betRepository.getBestBetPerUser(limit);
  }
}
