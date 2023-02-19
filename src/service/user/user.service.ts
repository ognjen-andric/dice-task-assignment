import { inject, injectable } from "tsyringe";
import { User } from "../../model/user.model";
import { IUserRepository } from "../../repository/user/user.repository";

@injectable()
export class UserService {
  constructor(
    @inject(IUserRepository) private userRepository: IUserRepository
  ) {}

  async getAllUsers() {
    return this.userRepository.getUserList();
  }

  async getUser(id: number): Promise<User | null> {
    try {
      return await this.userRepository.getUser(id);
    } catch (e) {
      return null;
    }
  }
}
