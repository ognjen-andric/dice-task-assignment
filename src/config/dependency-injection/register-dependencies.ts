import { IBetRepository } from "../../repository/bet/bet.repository";
import { BetRepository } from "../../repository/bet/bet.sqlite.repository";
import { IUserRepository } from "../../repository/user/user.repository";
import { UserRepository } from "../../repository/user/user.sqlite.repository";
import { Logger } from "../../service/logger/logger.service";
import { container } from "./container";

export const registerDependencies = async () => {
  const logger = container.resolve(Logger);
  logger.log("Registering dependecies...");

  /** User Repository */
  const userRepo = container.resolve(UserRepository);
  await userRepo.synchronize();
  await userRepo.populate();
  container.registerInstance(IUserRepository, userRepo);

  /** Bet repository */
  const betRepo = container.resolve(BetRepository);
  await betRepo.synchronize();
  container.registerInstance(IBetRepository, betRepo);
};
