import { User } from "../model/user.model";

export const BalanceHelper = {
  deductBalance: (user: User, amount: number) => {
    console.log("Deduction");
    console.log(user.balance);
    console.log(amount);
    if (amount > user.balance) throw new Error("Insufficient balance.");
    return user.balance - amount;
  },

  addBalance: (user: User, amount: number) => {
    console.log("Addition");
    console.log(user.balance);
    console.log(amount);
    return user.balance + amount;
  },
};
