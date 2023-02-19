import { Balance } from "../../model/balance.model";
import { RepositoryOptions } from "../../model/repository-options.model";
import { User } from "../../model/user.model";

export interface IUserRepository {
  getUser(id: number): Promise<User | null>;
  getUserList(): Promise<User[]>;

  updateBalance(
    user: User,
    newBalance: Balance,
    options?: RepositoryOptions
  ): Promise<User>;
}

export const IUserRepository = Symbol("IUserRepository");
