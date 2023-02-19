import { Balance } from "../../model/balance.model";
import { User } from "../../model/user.model";

export interface IUserRepository {
  getUser(id: number): Promise<User | null>;
  getUserList(): Promise<User[]>;
  updateBalance(user: User, newBalance: Balance): Promise<void>;
}

export const IUserRepository = Symbol("IUserRepository");
