import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../../repository/user/user.repository";

@injectable()
export class BetService {
  constructor(
    @inject(IUserRepository) private userRepository: IUserRepository
  ) {}

  async createBet() {
    await this.userRepository.getUserList();
  }
}
