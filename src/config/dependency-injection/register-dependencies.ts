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

  //   container.resolve(IUserRepository);
};
