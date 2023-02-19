export type Bet = {
  id: number;
  userId: number;
  betAmount: number;
  chance: number;
  payout: number;
  win: boolean;
};

export type BetWithoutId = Omit<Bet, "id">;

export type BetInput = {
  amount: number;
  chance: number;
};

type BetWon = {
  hasWon: true;
  payout: number;
};

type BetLost = {
  hasWon: false;
};

export type BetOutcome = BetWon | BetLost;
