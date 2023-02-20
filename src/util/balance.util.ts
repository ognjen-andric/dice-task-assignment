import { User } from "../model/user.model";

export const BalanceUtil = {
  deductBalance: (user: User, amount: number) => {
    if (amount > user.balance) throw new Error("Insufficient balance.");
    return user.balance - amount;
  },

  addBalance: (user: User, amount: number) => {
    return user.balance + amount;
  },
};
