import { Bet, BetWithoutId } from "../../model/bet.model";

export interface IBetRepository {
  //   getBet(id: number): Promise<Bet>;
  //   getBetList(): Promise<Bet[]>;

  insertBet(bet: BetWithoutId): Promise<Bet>;
}

export const IBetRepository = Symbol("IBetRepository");
